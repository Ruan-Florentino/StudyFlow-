import { GoogleGenAI, Type } from "@google/genai";

let _ai: any = null;

const ai = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (!_ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      _ai = new GoogleGenAI({ apiKey });
    }
    return _ai[prop];
  }
});

// ─────────────────────────────────────────────
// IA SERVICE CONFIG
// ─────────────────────────────────────────────

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

const DEFAULT_MODEL = 'gemini-1.5-flash';

export async function generateText(
  prompt: string, 
  options: GenerateTextOptions = {}
): Promise<string> {
  const { model: modelId = DEFAULT_MODEL, cache: useCache = true, systemPrompt } = options;
  
  const key = cacheKey(prompt, modelId);
  if (useCache) {
    const cached = getCached(key);
    if (cached) return cached;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { systemInstruction: systemPrompt }
    });
    const text = response.text || "";
    if (useCache) setCached(key, text);
    return text;
  } catch (err: any) {
    console.error("AI Error:", err);
    throw new Error(err.message || "Erro ao conectar com a IA");
  }
}

export async function generateStructured<T = any>(
  prompt: string,
  schema: any,
  options: { model?: string; systemPrompt?: string } = {}
): Promise<T> {
  const { model: modelId = DEFAULT_MODEL, systemPrompt } = options;
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    const text = response.text || "{}";
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
  const { model: modelId = DEFAULT_MODEL, systemPrompt } = options;
  try {
    const contents = history.map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('model' as const),
      parts: h.parts
    }));
    contents.push({ role: 'user' as const, parts: [{ text: newMessage }] });

    const response = await ai.models.generateContent({
      model: modelId,
      contents,
      config: { systemInstruction: systemPrompt }
    });

    return response.text || "";
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
  const { model: modelId = DEFAULT_MODEL, systemPrompt } = options;
  const base64 = await fileToBase64(file);
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64,
                mimeType: file.type
              }
            }
          ]
        }
      ],
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "";
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
