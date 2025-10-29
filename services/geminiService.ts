import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI with process.env.API_KEY directly and remove fallback/warning logic
// per API guidelines, which assume the API key is always available via environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runPrompt = async (prompt: string): Promise<string> => {
  // Fix: Removed conditional check for API_KEY, as the environment is assumed to be correctly configured.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI.";
  }
};