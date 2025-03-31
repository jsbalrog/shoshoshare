import process from "process";

if (!process.env.UNSPLASH_ACCESS_KEY) {
  throw new Error("UNSPLASH_ACCESS_KEY environment variable is required");
}

const UNSPLASH_API_URL = "https://api.unsplash.com";

export async function searchPhotos(query) {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));
  } catch (error) {
    console.error("Error searching Unsplash photos:", error);
    throw new Error("Failed to search photos");
  }
}

export async function getRandomPhoto(query) {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const photo = await response.json();
    return {
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    };
  } catch (error) {
    console.error("Error getting random photo:", error);
    throw new Error("Failed to get random photo");
  }
} 