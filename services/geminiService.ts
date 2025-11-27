import { GoogleGenAI } from "@google/genai";
import { Tone, FormattingOptions } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const formatTextWithAI = async (text: string, options: FormattingOptions): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are an expert professional editor and document formatter. 
    Your task is to take the provided raw text and rewrite/format it to be highly professional and visually structured using Markdown.

    Configuration:
    - Tone: ${options.tone}
    - Fix Grammar: ${options.fixGrammar ? "Yes, ensure perfect grammar and punctuation." : "No, keep original phrasing mostly intact."}
    - Include Summary: ${options.includeSummary ? "Yes, add a brief executive summary at the top." : "No."}

    Instructions:
    1. Use Markdown headers (#, ##, ###) to organize sections logically.
    2. Use bullet points or numbered lists to break up dense paragraphs.
    3. Use bolding (**text**) for key terms or emphasis, but do not overuse it.
    4. Ensure the output is ready to be copied into a professional document or email.
    5. Do NOT include any conversational filler before or after the content (e.g., "Here is your formatted text"). Just provide the formatted content.

    Raw Text:
    ${text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Failed to generate formatted text.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the formatting service.");
  }
};