import process from "process";

if (!process.env.PEXELS_API_KEY) {
  throw new Error("PEXELS_API_KEY environment variable is required");
}

const PEXELS_API_URL = "https://api.pexels.com/v1";

export async function searchPhotos(query) {
  try {
    console.log("Searching Pexels for:", query);
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error("Pexels API error response:", response.status, response.statusText);
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Pexels search response:", data);
    
    if (!data.photos || !Array.isArray(data.photos)) {
      console.error("Invalid Pexels response format:", data);
      throw new Error("Invalid response format from Pexels API");
    }

    return data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large,
      thumb: photo.src.small,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    }));
  } catch (error) {
    console.error("Error searching Pexels photos:", error);
    throw new Error("Failed to search photos");
  }
}

export async function getRandomPhoto(query) {
  try {
    console.log("Getting random photo from Pexels for:", query);
    const randomPage = Math.floor(Math.random() * 100);
    console.log("Using random page:", randomPage);
    
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=1&page=${randomPage}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error("Pexels API error response:", response.status, response.statusText);
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Pexels random photo response:", data);

    if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) {
      console.error("No photos found in response:", data);
      throw new Error("No photos found");
    }

    const photo = data.photos[0];
    if (!photo.src || !photo.src.large) {
      console.error("Invalid photo format:", photo);
      throw new Error("Invalid photo format from Pexels API");
    }

    const result = {
      id: photo.id,
      url: photo.src.large,
      thumb: photo.src.small,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    };
    
    console.log("Returning photo:", result);
    return result;
  } catch (error) {
    console.error("Error getting random photo:", error);
    throw new Error("Failed to get random photo");
  }
} 