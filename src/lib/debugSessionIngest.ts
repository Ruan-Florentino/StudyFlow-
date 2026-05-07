/**
 * Ingest NDJSON debug lines para sessão Cursor (somente dev).
 */
const DEBUG_INGEST =
  'http://127.0.0.1:7839/ingest/44fdd0a7-1b3f-4321-b619-ab95422a5c71';
const DEBUG_SESSION_ID = '5c09a1';

export type DebugSessionPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  runId?: string;
};

export function debugSessionIngest(payload: DebugSessionPayload): void {
  if (!import.meta.env.DEV) return;
  void fetch(DEBUG_INGEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: payload.runId ?? 'pre-fix',
      hypothesisId: payload.hypothesisId,
      location: payload.location,
      message: payload.message,
      data: payload.data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
