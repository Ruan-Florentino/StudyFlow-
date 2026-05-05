/** Tempo máximo até headers da resposta (evita fetch pendente sem limite). */
const REQUEST_TIMEOUT_MS = 30_000;

function openRouterErrorMessage(body: unknown): string {
  if (body == null || typeof body !== 'object') return '';
  const b = body as Record<string, unknown>;
  if (typeof b.error === 'string') return b.error;
  const err = b.error;
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
  }
  return '';
}
const MAX_ATTEMPTS = 3;

function mergeSignals(a?: AbortSignal, b?: AbortSignal): AbortSignal | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  const merged = new AbortController();
  const forward = () => {
    if (!merged.signal.aborted) merged.abort();
  };
  if (a.aborted || b.aborted) {
    forward();
    return merged.signal;
  }
  a.addEventListener('abort', forward);
  b.addEventListener('abort', forward);
  return merged.signal;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const timeoutCtrl = new AbortController();
  const timer = setTimeout(() => timeoutCtrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: mergeSignals(init.signal, timeoutCtrl.signal),
    });
  } finally {
    clearTimeout(timer);
  }
}

class AthenaClient {
  private baseURL = '/api/ai';

  /**
   * Streaming: timeout na conexão inicial; leitura do corpo segue sem limite duro
   * (evita cortar respostas longas após o primeiro chunk).
   */
  async *streamChat(params: {
    messages: { role: string; content: string }[];
    model: string;
    temperature?: number;
    signal?: AbortSignal;
  }): AsyncGenerator<string> {
    console.log(`📤 [ATHENA] Request iniciado (Stream): ${params.model}`);

    let response: Response | undefined;
    let lastStreamErr: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        response = await fetchWithTimeout(
          this.baseURL,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: params.messages,
              model: params.model,
              temperature: params.temperature ?? 0.7,
              stream: true,
            }),
            signal: params.signal,
          },
          REQUEST_TIMEOUT_MS
        );
        break;
      } catch (e: unknown) {
        lastStreamErr = e;
        const name = e instanceof Error ? e.name : '';
        const retriable =
          name === 'AbortError' ||
          (e instanceof Error &&
            (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')));
        if (!retriable || attempt === MAX_ATTEMPTS) {
          if (name === 'AbortError') {
            throw new Error('IA demorou demais para iniciar a resposta. Tente novamente.');
          }
          throw e instanceof Error ? e : new Error('Falha de rede ao contatar Athena.');
        }
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
    if (!response) {
      throw lastStreamErr instanceof Error
        ? lastStreamErr
        : new Error('Falha ao iniciar stream da Athena.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg =
        openRouterErrorMessage(errorData) ||
        (errorData as { error?: string }).error ||
        `HTTP ${response.status}`;
      throw new Error(msg);
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
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices[0]?.delta?.content || '';
              if (content) yield content;
            } catch {
              console.warn('[ATHENA] Falha ao parsear chunk JSON streaming', line);
            }
          }
        }
      }
    }

    console.log('✅ [ATHENA] Stream finalizado com sucesso');
  }

  private async chatOnce(params: {
    messages: { role: string; content: string }[];
    model: string;
    temperature?: number;
    signal?: AbortSignal;
  }): Promise<string> {
    let response: Response;
    try {
      response = await fetchWithTimeout(
        this.baseURL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: params.messages,
            model: params.model,
            temperature: params.temperature ?? 0.7,
          }),
          signal: params.signal,
        },
        REQUEST_TIMEOUT_MS
      );
    } catch (e: unknown) {
      const name = e instanceof Error ? e.name : '';
      if (name === 'AbortError') {
        throw new Error('IA demorou demais. Tente novamente.');
      }
      throw e instanceof Error ? e : new Error('Falha de rede ao contatar Athena.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg =
        openRouterErrorMessage(errorData) ||
        (errorData as { error?: string }).error ||
        `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('Resposta vazia da Athena');
    return content as string;
  }

  /** Até 3 tentativas em falhas de rede ou timeout (AbortError). */
  async chat(params: {
    messages: { role: string; content: string }[];
    model: string;
    temperature?: number;
    signal?: AbortSignal;
  }): Promise<string> {
    console.log(`📤 [ATHENA] Request iniciado: ${params.model}`);

    let lastErr: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const out = await this.chatOnce(params);
        console.log('✅ [ATHENA] Resposta recebida com sucesso');
        return out;
      } catch (e) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : String(e);
        const retriable =
          (e instanceof Error && e.name === 'AbortError') ||
          msg.includes('Failed to fetch') ||
          msg.includes('NetworkError') ||
          msg.includes('demorou demais');
        console.warn(`[ATHENA] tentativa ${attempt}/${MAX_ATTEMPTS} falhou:`, msg);
        if (!retriable || attempt === MAX_ATTEMPTS) break;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
    throw lastErr instanceof Error
      ? lastErr
      : new Error('Não foi possível obter resposta da Athena.');
  }
}

export const athenaClient = new AthenaClient();
