import OpenAI from "openai";
import process from "process";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(prompt, options = {}) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator. Generate engaging, platform-appropriate content based on the user's requirements.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      ...options,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}

export async function generateImage(prompt, options = {}) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      ...options,
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}

export async function moderateContent(content) {
  try {
    const response = await openai.moderations.create({
      model: "text-moderation-latest",
      input: content,
    });

    return response.results[0];
  } catch (error) {
    console.error("Error moderating content:", error);
    throw new Error("Failed to moderate content");
  }
} 