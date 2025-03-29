import { useSearchParams, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const meta = () => {
  return [
    { title: "ShoshoShare - Edit Post" },
    { name: "description", content: "Edit your social media post" },
  ];
};

export default function Edit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId = searchParams.get("id");

  // TODO: Fetch post data using postId
  // For now, using sample data that matches the actual post structure
  const post = {
    id: parseInt(postId),
    title: "Sample Post",
    content: "This is a sample post content",
    platform: "Twitter",
    draft_date: new Date(),
    scheduled_date: new Date(), // Set to current date for testing
    scheduled_time: "14:00", // Set to current time for testing
    status: "scheduled"
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      // TODO: Implement actual delete API call
      console.log("Deleting post:", postId);
      navigate("/schedule");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          suppressHydrationWarning
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Post</CardTitle>
              <Button 
                variant="outline" 
                onClick={handleDelete}
                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete Post
              </Button>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    defaultValue={post.title}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    defaultValue={post.content}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Platform
                  </label>
                  <select
                    id="platform"
                    defaultValue={post.platform}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      id="scheduled_date"
                      defaultValue={post.scheduled_date ? post.scheduled_date.toISOString().split('T')[0] : ''}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      id="scheduled_time"
                      defaultValue={post.scheduled_time || ''}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 