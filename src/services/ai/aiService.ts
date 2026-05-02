import { httpsCallable } from 'firebase/functions';
import { fns } from '../../lib/firebase';
import type { Schema } from '@google/genai';

// ─────────────────────────────────────────────
// FUNÇÕES CALLABLE
// ─────────────────────────────────────────────
const callGenerateText = httpsCallable(fns, 'generateText');
const callGenerateStructured = httpsCallable(fns, 'generateStructured');
const callChatWithHistory = httpsCallable(fns, 'chatWithHistory');
const callAnalyzeFile = httpsCallable(fns, 'analyzeFile');

const cache = new Map<string, { value: any; expiresAt: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 min

function cacheKey(prompt: string, model: string) {
  return `${model}:${prompt.slice(0, 200)}`;
}

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key: string, value: any) {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
}

export interface GenerateTextOptions {
  model?: string;
  systemPrompt?: string;
  cache?: boolean;
}

export async function generateText(
  prompt: string, 
  options: GenerateTextOptions = {}
): Promise<string> {
  const { model = 'FLASH', cache: useCache = true } = options;
  
  const key = cacheKey(prompt, model);
  if (useCache) {
    const cached = getCached(key);
    if (cached) return cached;
  }
  
  try {
    const res: any = await callGenerateText({ prompt, options });
    const text = res.data.text || '';
    if (useCache) setCached(key, text);
    return text;
  } catch (err: any) {
    console.error("AI Error:", err);
    throw new Error(err.message || "Erro ao conectar com a IA");
  }
}

export async function generateStructured<T = any>(
  prompt: string,
  schema: Schema,
  options: { model?: string; systemPrompt?: string } = {}
): Promise<T> {
  try {
    const res: any = await callGenerateStructured({ prompt, schema, options });
    const text = res.data.text || '';
    return JSON.parse(text) as T;
  } catch (err: any) {
    console.error('❌ JSON parse or AI error:', err);
    throw new Error('IA retornou erro ou JSON inválido');
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function chatWithHistory(
  history: ChatMessage[],
  newMessage: string,
  options: { model?: string; systemPrompt?: string } = {}
): Promise<string> {
  try {
    const res: any = await callChatWithHistory({ history, newMessage, options });
    return res.data.text || '';
  } catch (err: any) {
    console.error("Chat Error:", err);
    throw new Error(err.message || "Erro ao responder chat");
  }
}

export async function analyzeFile(
  file: File,
  prompt: string,
  options: { model?: string; systemPrompt?: string } = {}
): Promise<string> {
  const base64 = await fileToBase64(file);
  try {
    const res: any = await callAnalyzeFile({ 
      fileData: base64, 
      mimeType: file.type, 
      prompt, 
      options 
    });
    return res.data.text || '';
  } catch (err: any) {
    console.error("Analyze Error:", err);
    throw new Error(err.message || "Erro ao analisar arquivo");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const aiService = {
  generateText,
  generateStructured,
  chatWithHistory,
  analyzeFile,
};

export default aiService;
