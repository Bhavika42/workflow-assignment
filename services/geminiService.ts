
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function runGeminiLLM(
  prompt: string, 
  images: string[] = [], 
  systemPrompt: string = ""
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  const contents: any[] = [];
  
  // Add images if present
  for (const imgBase64 of images) {
    // Extract base64 data and mime type
    const matches = imgBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      contents.push({
        inlineData: {
          mimeType: matches[1],
          data: matches[2]
        }
      });
    }
  }

  // Add text prompt
  contents.push({ text: prompt });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      systemInstruction: systemPrompt || undefined,
    }
  });

  return response.text || "No response received";
}
