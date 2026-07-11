/**
 * Telemetria opcional para depuração local (ex.: ingest Cursor/agent).
 * Arquitetura: um único ponto de saída — nunca envia em build de produção;
 * em dev só envia se `VITE_DEBUG_INGEST_URL` estiver definida.
 */

export type DevAgentLogPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  sessionId?: string;
  runId?: string;
};

function ingestUrl(): string | undefined {
  const raw = import.meta.env.VITE_DEBUG_INGEST_URL;
  if (typeof raw !== 'string' || raw.trim() === '') return undefined;
  return raw.trim();
}

/**
 * Fire-and-forget. Falhas de rede são ignoradas (depuração apenas).
 */
export function devAgentLog(payload: DevAgentLogPayload): void {
  if (import.meta.env.PROD) return;
  const url = ingestUrl();
  if (!url) return;

  const sessionId = payload.sessionId ?? 'athena-dev';
  const body = JSON.stringify({
    sessionId,
    runId: payload.runId ?? 'dev',
    hypothesisId: payload.hypothesisId,
    location: payload.location,
    message: payload.message,
    data: payload.data,
    timestamp: Date.now(),
  });

  void fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': sessionId,
    },
    body,
  }).catch(() => {});
}
