import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize the Gemini client
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on the provided prompt and aspect ratio using Gemini 2.5 Flash Image.
 * Supports an optional reference image for image-to-image generation.
 */
export const generateImageFromText = async (
  prompt: string,
  aspectRatio: AspectRatio,
  referenceImageBase64?: string | null
): Promise<string | null> => {
  try {
    const parts: any[] = [];

    // If a reference image is provided, add it as inline data
    if (referenceImageBase64) {
      try {
        // Extract the Base64 data and MimeType
        // format: data:image/png;base64,.....
        const match = referenceImageBase64.match(/^data:(.+);base64,(.+)$/);
        
        if (match) {
          const mimeType = match[1];
          const data = match[2];
          
          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          });
        }
      } catch (e) {
        console.warn("Failed to parse reference image, proceeding with text only.");
      }
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // Note: imageSize is only for pro models, responseMimeType not supported for nano banana
        },
      },
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64EncodeString = part.inlineData.data;
            // MimeType is usually image/png or image/jpeg coming back from the model inlineData
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${base64EncodeString}`;
          }
        }
      }
    }

    console.warn("No image data found in response");
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Uses Gemini text model to enhance a simple user prompt into a detailed artistic description.
 */
export const enhancePrompt = async (originalPrompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `You are an expert AI art prompt assistant. 
            Your task is to take the following user idea and expand it into a highly detailed, professional image generation prompt.
            
            User Input: "${originalPrompt}"
            
            Guidelines:
            1. Add specific details about lighting (e.g., cinematic, golden hour, neon).
            2. Describe the style (e.g., photorealistic, oil painting, 3D render, anime).
            3. Mention textures, background, and camera angles.
            4. IMPORTANT: Output the result in the SAME LANGUAGE as the User Input (Arabic if Arabic, English if English).
            5. Output ONLY the enhanced prompt text, no explanations.
            6. Keep it concise but rich (max 50-60 words).
            7. Do NOT surround the output with quotes.`
          }
        ]
      }
    });

    let text = response.text ? response.text.trim() : null;
    if (text) {
      // Remove potential wrapping quotes or markdown code blocks
      text = text.replace(/^["']|["']$/g, '').replace(/^```(?:json|text)?|```$/g, '').trim();
    }
    return text;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return null;
  }
};