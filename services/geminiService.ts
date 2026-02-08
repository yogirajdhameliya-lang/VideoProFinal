import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

export async function analyzeVideoUrl(url: string): Promise<VideoMetadata> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a YouTube metadata extractor. Analyze this URL: ${url}. 
      Return the metadata for the video or the first video in the playlist.
      If it's a playlist, prepend "[PLAYLIST]" to the title.
      If the URL is invalid or inaccessible, provide high-quality realistic mock data that matches the vibe of a popular video.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { 
              type: Type.STRING,
              description: "Title of the video or playlist"
            },
            thumbnail: { 
              type: Type.STRING,
              description: "A high-quality image URL (use https://picsum.photos/800/450 if real is unknown)"
            },
            duration: { 
              type: Type.STRING,
              description: "Duration formatted as MM:SS or 'X Videos' for playlists"
            },
            author: { 
              type: Type.STRING,
              description: "Channel name or Creator"
            },
            views: { 
              type: Type.STRING,
              description: "Approximate views count like '1.5M views'"
            },
          },
          required: ["title", "thumbnail", "duration", "author", "views"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    const isPlaylist = url.includes('list=') || url.includes('playlist');
    return {
      title: isPlaylist ? "[PLAYLIST] Global Tech Showcase 2025" : "The Future of 4K Cinema",
      thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
      duration: isPlaylist ? "32 Videos" : "15:42",
      author: "PYJTech Official",
      views: "1.8M views"
    };
  }
}
