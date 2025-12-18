
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Annotation } from "../types";

export const polishIllustration = async (
  base64Image: string,
  annotations: Annotation[],
  lighting: number
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const annotationSummary = annotations
      .map(a => `- ${a.label}: ${a.instruction}`)
      .join("\n");

    const prompt = `
      You are a professional fashion illustrator.
      Your task is to REFINE AND POLISH the provided fashion sketch.
      
      RULES:
      1. DO NOT add new design elements (sleeves, buttons, or extra items not in the original).
      2. STABILIZE line-weights: Make lines cleaner and more professional.
      3. CORRECT symmetry where applicable.
      4. APPLY FABRIC TEXTURES based on these specific user instructions:
      ${annotationSummary}
      5. Adjust lighting based on a ${lighting} degree light source.
      
      Output the refined illustration as a high-quality image.
    `;

    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: base64Image.split(",")[1] || base64Image,
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [imagePart, { text: prompt }] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error polishing illustration:", error);
    return null;
  }
};
