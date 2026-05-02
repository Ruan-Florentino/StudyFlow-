import { useState, useCallback } from 'react';
import { generateText, generateStructured, chatWithHistory, analyzeFile } from '../services/ai/aiService';
import type { Schema } from '../services/ai/schemas';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<any>(null);
  
  const callText = useCallback(async (
    prompt: string,
    options?: Parameters<typeof generateText>[1]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateText(prompt, options);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido na IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const callStructured = useCallback(async <T = any>(
    prompt: string,
    schema: Schema,
    options?: Parameters<typeof generateStructured>[2]
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateStructured<T>(prompt, schema, options);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido na IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const callChat = useCallback(async (
    history: Parameters<typeof chatWithHistory>[0],
    message: string,
    options?: Parameters<typeof chatWithHistory>[2]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await chatWithHistory(history, message, options);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido na IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const callFile = useCallback(async (
    file: File,
    prompt: string,
    options?: Parameters<typeof analyzeFile>[2]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFile(file, prompt, options);
      setData(result);
      return result;
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido na IA';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { 
    loading, error, data,
    callText, callStructured, callChat, callFile,
    reset: () => { setData(null); setError(null); },
  };
}
