import { Message, ChatResponse } from '../types/chat.types';
import { AIModel } from '../types/model.types';
import { ATHENA_CONFIG } from '../constants/config';

class AthenaClient {
  private baseURL = '/api/ai';

  /**
   * Streaming implementation using a custom fetch wrapper or proxy
   * Note: Real SSE streaming requires the backend to support it. 
   * For the AI Studio environment, we'll try to simulate it if the proxy supports it, 
   * or handle the chunks.
   */
  async *streamChat(params: {
    messages: { role: string; content: string }[];
    model: string;
    temperature?: number;
    signal?: AbortSignal;
  }): AsyncGenerator<string> {
    console.log(`📤 [ATHENA] Request iniciado (Stream): ${params.model}`);

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: params.messages,
        model: params.model,
        temperature: params.temperature || 0.7,
        stream: true // Ask for stream
      }),
      signal: params.signal
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneRead } = await reader.read();
      done = doneRead;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        
        // OpenRouter streaming format is usually multiple JSON objects prefixed with "data: "
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') continue;
                
                try {
                    const data = JSON.parse(dataStr);
                    const content = data.choices[0]?.delta?.content || '';
                    if (content) yield content;
                } catch (e) {
                    // Fallback if not JSON
                    console.warn('[ATHENA] Falha ao parsear chunk JSON streaming', line);
                }
            } else {
                // If it's not SSE format, just yield the chunk (some proxies might just pass raw bits)
                // But typically it's formatted.
            }
        }
      }
    }
    
    console.log('✅ [ATHENA] Stream finalizado com sucesso');
  }

  async chat(params: {
    messages: { role: string; content: string }[];
    model: string;
    temperature?: number;
    signal?: AbortSignal;
  }): Promise<string> {
    console.log(`📤 [ATHENA] Request iniciado: ${params.model}`);

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: params.messages,
        model: params.model,
        temperature: params.temperature || 0.7,
      }),
      signal: params.signal
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) throw new Error('Resposta vazia da Athena');
    
    console.log('✅ [ATHENA] Resposta recebida com sucesso');
    return content;
  }
}

export const athenaClient = new AthenaClient();
