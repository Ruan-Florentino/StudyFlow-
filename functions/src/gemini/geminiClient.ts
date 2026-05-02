import { GoogleGenAI } from "@google/genai";
import { defineSecret } from "firebase-functions/params";

// Define the secret
export const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

let genAI: GoogleGenAI | null = null;

export const getGenAI = () => {
  if (!genAI) {
    const apiKey = GEMINI_API_KEY.value();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY secret is not defined");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};
