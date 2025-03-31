import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { requireUserId } from "../services/auth.server";
import { db } from "../lib/db.server";
import { uploadImage } from "../services/storage.server";
import { searchPhotos } from "../services/pexels.server";

function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-gray-600 dark:text-gray-400">Generating your content...</p>
    </div>
  );
}

function UploadProgress({ onTimeout }) {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimeoutWarning(true);
      onTimeout?.();
    }, 10000); // Show warning after 10 seconds

    return () => clearTimeout(timeoutId);
  }, [onTimeout]);

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-progress"></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Uploading image...
      </p>
      {showTimeoutWarning && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Upload is taking longer than expected. Please don&apos;t close this window.
        </div>
      )}
    </div>
  );
}

UploadProgress.propTypes = {
  onTimeout: PropTypes.func
};

export async function action({ request }) {
  const { generateContent, moderateContent } = await import("../services/openai.server");
  const _userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "generate") {
    const prompt = formData.get("prompt");
    const platform = formData.get("platform");
    const shouldGenerateImage = formData.get("generateImage") === "true";

    console.log("Generate intent received:", { prompt, platform, shouldGenerateImage });

    try {
      // Generate content based on platform and prompt
      const content = await generateContent(
        `Create a ${platform} post about: ${prompt}. ${shouldGenerateImage ? 'Include an image description in the format [Image: description]' : ''}`
      );
      console.log("Generated content:", content);

      // Moderate the content
      const moderation = await moderateContent(content);
      if (moderation.flagged) {
        return json({ error: "Generated content was flagged as inappropriate" });
      }

      let images = [];
      let cleanedContent = content;

      if (shouldGenerateImage) {
        try {
          // Extract image description from content if it exists
          const imageMatch = content.match(/\[Image: (.*?)\]/);
          console.log("Image match result:", imageMatch);
          
          if (imageMatch) {
            const imageDescription = imageMatch[1];
            console.log("Extracted image description:", imageDescription);
            
            // Remove the [Image: ...] part from content
            cleanedContent = content.replace(/\[Image: .*?\]/, "").trim();
            console.log("Cleaned content:", cleanedContent);
            
            // Get multiple photos from Pexels based on the image description
            console.log("Fetching photos from Pexels for:", imageDescription);
            const photos = await searchPhotos(imageDescription, 10);
            console.log("Received photos from Pexels:", photos);
            
            if (photos && photos.length > 0) {
              images = photos;
              console.log("Final images array:", images);
            } else {
              console.error("No photos in response:", photos);
              throw new Error("Invalid photo response from Pexels");
            }
          } else {
            console.log("No image description found in content");
            return json({ 
              content: cleanedContent, 
              error: "No image description found in generated content. Please try generating again.",
              errorType: "image"
            });
          }
          
          const response = { content: cleanedContent, images };
          console.log("Returning response:", response);
          return json(response);
        } catch (photoError) {
          console.error("Error fetching photos:", photoError);
          return json({ 
            content: cleanedContent, 
            error: "Failed to fetch images. Please try again.",
            errorType: "image"
          });
        }
      }

      return json({ content: cleanedContent });
    } catch (error) {
      console.error("Error in generate action:", error);
      return json({ error: error.message });
    }
  }

  if (intent === "save") {
    const title = formData.get("title");
    const content = formData.get("content");
    const platform = formData.get("platform");
    const imageUrl = formData.get("imageUrl");
    const scheduledDate = formData.get("scheduledDate");
    const scheduledTime = formData.get("scheduledTime");

    // Combine date and time into a single DateTime
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    try {
      let storedImageUrl = null;
      if (imageUrl) {
        try {
          // Upload the image to Cloudinary
          storedImageUrl = await uploadImage(imageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          return json({ 
            error: "Failed to upload image. Please try again or generate a new image.",
            errorType: "upload"
          });
        }
      }

      await db.post.create({
        data: {
          title,
          content,
          platform,
          imageUrl: storedImageUrl,
          status: "SCHEDULED",
          scheduledDate: scheduledDateTime,
          scheduledTime: scheduledDateTime,
          userId: _userId,
        },
      });

      // Redirect to dashboard after successful save
      return redirect("/");
    } catch (error) {
      console.error("Error saving post:", error);
      return json({ 
        error: "Failed to save post. Please try again.",
        errorType: "save"
      });
    }
  }

  return json({ error: "Invalid intent" });
}

export default function CreatePost() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [generatedContent, setGeneratedContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [availableImages, setAvailableImages] = useState([]);
  const isGenerating = navigation.state === "submitting" && navigation.formData?.get("intent") === "generate";
  const isSaving = navigation.state === "submitting" && navigation.formData?.get("intent") === "save";

  // Update currentImageUrl and availableImages when actionData changes
  useEffect(() => {
    console.log("Action data changed:", actionData);
    if (actionData?.imageUrl) {
      console.log("Setting new image URL:", actionData.imageUrl);
      setCurrentImageUrl(actionData.imageUrl);
      setSelectedImageUrl(actionData.imageUrl);
    }
    if (actionData?.images) {
      console.log("Setting available images:", actionData.images);
      setAvailableImages(actionData.images);
    }
  }, [actionData?.imageUrl, actionData?.images]);

  // Update generatedContent when actionData.content changes
  useEffect(() => {
    if (actionData?.content) {
      setGeneratedContent(actionData.content);
    }
  }, [actionData?.content]);

  // Handle success message
  useEffect(() => {
    if (actionData?.success) {
      setShowSuccessMessage(true);
      // Clear success message after 5 seconds
      const timeoutId = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [actionData?.success]);

  const handleUploadTimeout = () => {
    // You could add additional handling here, like showing a retry button
    console.log("Upload timeout reached");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Use AI to generate content and images for your social media posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                required
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select a platform</option>
                <option value="Twitter">Twitter</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content Prompt
              </label>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Describe what you want to post about..."
              />
            </div>

            <div className="flex items-center">
              <input
                id="generateImage"
                name="generateImage"
                type="checkbox"
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="generateImage" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                Generate image as well
              </label>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              name="intent"
              value="generate"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>

            {isGenerating && <LoadingIndicator />}

            {actionData?.error && (
              <div className={`rounded-md p-4 ${
                actionData.errorType === "upload" 
                  ? "bg-yellow-50 dark:bg-yellow-900/50" 
                  : "bg-red-50 dark:bg-red-900/50"
              }`}>
                <div className={`text-sm ${
                  actionData.errorType === "upload"
                    ? "text-yellow-700 dark:text-yellow-200"
                    : "text-red-700 dark:text-red-200"
                }`}>
                  {actionData.error}
                </div>
              </div>
            )}

            {showSuccessMessage && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
                <div className="text-sm text-green-700 dark:text-green-200">
                  {actionData?.message}
                </div>
              </div>
            )}

            {actionData?.content && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Generated Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  value={actionData.content}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {currentImageUrl && (
              <div>
                <label htmlFor="generatedImage" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Generated Image
                </label>
                <img
                  id="generatedImage"
                  src={currentImageUrl}
                  alt="Generated content"
                  className="mt-2 rounded-lg max-w-full h-auto"
                />
                <input type="hidden" name="imageUrl" value={selectedImageUrl} />
                <input type="hidden" name="content" value={generatedContent} />
                <input type="hidden" name="platform" value={selectedPlatform} />
                <Button
                  type="submit"
                  name="intent"
                  value="generate"
                  variant="outline"
                  className="mt-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate different images"}
                </Button>
              </div>
            )}

            {availableImages.length > 0 && (
              <div className="mt-4">
                <Label htmlFor="image-grid">Select an image</Label>
                <div id="image-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                  {availableImages.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`relative w-full rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageUrl === image.url
                          ? "border-blue-500 dark:border-blue-400"
                          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedImageUrl(image.url)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedImageUrl(image.url);
                        }
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Option ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {actionData?.content && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    name="intent"
                    value="save"
                    disabled={!generatedContent || isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Post"
                    )}
                  </Button>
                  {isSaving && !currentImageUrl && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Saving post...
                    </div>
                  )}
                </div>
                {isSaving && currentImageUrl && (
                  <UploadProgress onTimeout={handleUploadTimeout} />
                )}
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 