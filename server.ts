import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from 'dotenv';
import { DEFAULT_OPENROUTER_CHAT_MODEL, OPENROUTER_PROXY_FALLBACK_MODELS } from "./src/config/openRouter.js";
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildOpenRouterModelChain(primary: string): string[] {
  const out: string[] = [];
  const add = (m: string) => {
    if (m && !out.includes(m)) out.push(m);
  };
  add(primary);
  for (const m of OPENROUTER_PROXY_FALLBACK_MODELS) add(m);
  return out;
}

function buildGatewayModelChain(requested: string): string[] {
  const migrated =
    requested === "deepseek/deepseek-chat" || requested === "openrouter/free"
      ? "deepseek/deepseek-v3.2"
      : requested;
  return Array.from(
    new Set([migrated, "google/gemini-3-flash", "openai/gpt-5.4-mini"])
  );
}

/**
 * Próximo modelo na cadeia: 429/404, ou 400 com slug inválido (verify-4: nemotron-3-super
 * retornou 400 "not a valid model ID" e parava antes do restante da lista).
 */
function openRouterErrorRetryable(status: number, rawBody: string): boolean {
  if (status === 429) return true;
  if (status === 404) return true;
  if (
    status === 400 &&
    /not a valid model id|invalid model|no endpoints found/i.test(rawBody)
  ) {
    return true;
  }
  return false;
}

/** Rate limit upstream (OpenRouter): várias tentativas no mesmo modelo com backoff crescente. */
const OPENROUTER_429_MAX_ROUNDS = 4;
function openRouter429BackoffMs(roundIndex: number): number {
  const steps = [3200, 5500, 9000];
  return steps[Math.min(roundIndex, steps.length - 1)] ?? 9000;
}

function debugAgentLog(
  message: string,
  hypothesisId: string,
  data: Record<string, unknown>
): void {
  if (process.env.DEBUG_AGENT_LOG !== "true") return;
  // #region agent log
  fetch("http://127.0.0.1:7839/ingest/44fdd0a7-1b3f-4321-b619-ab95422a5c71", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "5c09a1",
    },
    body: JSON.stringify({
      sessionId: "5c09a1",
      runId: "pre-fix",
      hypothesisId,
      location: "server.ts",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

type RateLimitBucket = {
  windowStart: number;
  count: number;
};

type AuthenticatedUser = {
  id: string;
  email?: string;
  plan: string;
  role: string;
};

type SecuritySeverity = "low" | "medium" | "high" | "critical";

const rateLimitStore = new Map<string, RateLimitBucket>();
let warnedDistributedRateLimit = false;

function getClientIp(req: express.Request): string {
  const raw = req.headers["x-forwarded-for"];
  if (typeof raw === "string" && raw.length > 0) {
    return raw.split(",")[0]?.trim() || req.ip || "unknown";
  }
  return req.ip || "unknown";
}

function hitRateLimit(
  key: string,
  now: number,
  maxRequests: number,
  windowMs: number
): { limited: boolean; remaining: number; resetMs: number } {
  const existing = rateLimitStore.get(key);
  if (!existing || now - existing.windowStart >= windowMs) {
    rateLimitStore.set(key, { windowStart: now, count: 1 });
    return { limited: false, remaining: maxRequests - 1, resetMs: windowMs };
  }
  existing.count += 1;
  const resetMs = Math.max(0, windowMs - (now - existing.windowStart));
  if (existing.count > maxRequests) {
    return { limited: true, remaining: 0, resetMs };
  }
  return { limited: false, remaining: maxRequests - existing.count, resetMs };
}

async function hitRateLimitHybrid(
  key: string,
  now: number,
  maxRequests: number,
  windowMs: number
): Promise<{ limited: boolean; remaining: number; resetMs: number }> {
  const cfg = getbackendServiceConfig();
  if (cfg) {
    try {
      const response = await fetch(`${cfg.url}/rest/v1/rpc/check_api_rate_limit`, {
        method: "POST",
        headers: {
          apikey: cfg.serviceRoleKey,
          Authorization: `Bearer ${cfg.serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_bucket_key: key.slice(0, 256),
          p_max_requests: maxRequests,
          p_window_ms: windowMs,
        }),
      });
      if (response.ok) {
        const payload = (await response.json()) as { limited?: boolean; reset_ms?: number };
        const limited = Boolean(payload.limited);
        const resetMs =
          typeof payload.reset_ms === "number" && !Number.isNaN(payload.reset_ms)
            ? payload.reset_ms
            : windowMs;
        return {
          limited,
          remaining: limited ? 0 : Math.max(0, maxRequests - 1),
          resetMs,
        };
      }
    } catch {
      /* fallback abaixo */
    }
  } else if (!warnedDistributedRateLimit) {
    warnedDistributedRateLimit = true;
    console.warn(
      "[Athena] Rate limit em memória: defina BACKEND_SERVICE_ROLE_KEY e aplique a migration check_api_rate_limit para limitação distribuída."
    );
  }
  return hitRateLimit(key, now, maxRequests, windowMs);
}

function buildContentSecurityPolicy(): string {
  let backendHost = "";
  const backendUrl = process.env.BACKEND_URL ?? process.env.VITE_BACKEND_URL ?? "";
  try {
    backendHost = new URL(backendUrl).hostname;
  } catch {
    backendHost = "";
  }
  const connectParts = [
    "'self'",
    "https://openrouter.ai",
    "https://www.youtube.com",
    "https://youtube.com",
    "https://www.youtube-nocookie.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];
  if (backendHost) {
    connectParts.push(`https://${backendHost}`, `wss://${backendHost}`);
  }
  const extraConnect = (process.env.CSP_EXTRA_CONNECT ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  for (const origin of extraConnect) {
    connectParts.push(origin);
  }
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self'",
    `connect-src ${connectParts.join(" ")}`,
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "worker-src 'self' blob:",
  ].join("; ");
}

function buildAllowedOrigins(): Set<string> {
  const defaults = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://studyflow.app",
    "https://www.studyflow.app",
    "https://athena.studyflow.app",
    "https://study-flow-ruan9.vercel.app",
  ];
  if (process.env.VERCEL_URL) {
    defaults.push(`https://${process.env.VERCEL_URL}`);
  }
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? "";
  const extra = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return new Set([...defaults, ...extra]);
}

function sanitizeUpstreamErrorMessage(raw: unknown): string {
  if (typeof raw !== "string") return "Erro ao processar solicitação no provedor.";
  return raw.length > 300 ? `${raw.slice(0, 300)}...` : raw;
}

function clientFacingOpenRouterError(status: number, data: unknown): Record<string, unknown> {
  if (status === 402 || /customer_verification_required|valid credit card/i.test(JSON.stringify(data))) {
    return {
      error: {
        message: "O serviço de IA está aguardando ativação de faturamento no provedor.",
        code: status,
      },
    };
  }
  if (process.env.NODE_ENV === "production") {
    return {
      error: {
        message: "Falha temporária no provedor de IA. Tente novamente em instantes.",
        code: status,
      },
    };
  }
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return { error: sanitizeUpstreamErrorMessage(String(data)) };
}

function getbackendConfig(): { url: string; anonKey: string } | null {
  const url = process.env.BACKEND_URL ?? process.env.VITE_BACKEND_URL;
  const anonKey = process.env.BACKEND_KEY ?? process.env.VITE_BACKEND_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function getbackendServiceConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.BACKEND_URL ?? process.env.VITE_BACKEND_URL;
  const serviceRoleKey = process.env.BACKEND_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function getBearerToken(req: express.Request): string | null {
  const raw = req.headers.authorization;
  if (!raw || typeof raw !== "string") return null;
  const [scheme, token] = raw.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token.trim();
}

async function verifybackendToken(token: string): Promise<AuthenticatedUser | null> {
  const cfg = getbackendConfig();
  if (!cfg) return null;
  try {
    const response = await fetch(`${cfg.url}/auth/v1/user`, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { id?: string; email?: string };
    if (!user.id) return null;
    const profileResponse = await fetch(
      `${cfg.url}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}&select=plan,role&limit=1`,
      {
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!profileResponse.ok) return null;
    const profiles = (await profileResponse.json()) as Array<{ plan?: string; role?: string }>;
    const profile = profiles[0];
    return {
      id: user.id,
      email: user.email,
      plan: profile?.plan ?? "free",
      role: profile?.role ?? "free",
    };
  } catch {
    return null;
  }
}

function hasPaidAccess(user: AuthenticatedUser): boolean {
  return (
    user.plan === "premium" ||
    user.plan === "pro" ||
    user.role === "premium" ||
    user.role === "supremo" ||
    user.role === "admin"
  );
}

async function logSecurityEvent(params: {
  actorUserId?: string;
  eventType: string;
  severity: SecuritySeverity;
  source: string;
  ip?: string;
  userAgent?: string;
  route?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const row = {
    actor_user_id: params.actorUserId ?? null,
    event_type: params.eventType,
    severity: params.severity,
    source: params.source,
    ip: params.ip ?? null,
    user_agent: params.userAgent ?? null,
    route: params.route ?? null,
    details: params.details ?? null,
  };
  const cfg = getbackendServiceConfig();
  if (cfg) {
    try {
      await fetch(`${cfg.url}/rest/v1/security_events`, {
        method: "POST",
        headers: {
          apikey: cfg.serviceRoleKey,
          Authorization: `Bearer ${cfg.serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      });
    } catch {
      /* best-effort */
    }
  }
  if (process.env.SECURITY_EVENTS_STDOUT === "true") {
    console.warn(
      JSON.stringify({
        type: "security_event",
        ts: new Date().toISOString(),
        ...row,
      })
    );
  }
}

async function authenticatebackendUser(
  req: express.Request,
  res: express.Response
): Promise<AuthenticatedUser | null> {
  const ip = getClientIp(req);
  const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined;
  if (!getbackendConfig()) {
    return { id: "guest", plan: "free", role: "free" };
  }
  const token = getBearerToken(req);
  if (!token) {
    void logSecurityEvent({
      eventType: "auth_missing_bearer",
      severity: "high",
      source: "api",
      ip,
      userAgent,
      route: req.path,
      details: { method: req.method },
    });
    res.status(401).json({ error: "Autenticação obrigatória." });
    return null;
  }
  const authenticatedUser = await verifybackendToken(token);
  if (!authenticatedUser) {
    void logSecurityEvent({
      eventType: "auth_invalid_token",
      severity: "high",
      source: "api",
      ip,
      userAgent,
      route: req.path,
      details: { method: req.method },
    });
    res.status(401).json({ error: "Token inválido ou expirado." });
    return null;
  }
  return authenticatedUser;
}

function isValidAiRequestBody(body: unknown): body is {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  stream?: boolean;
} {
  if (!body || typeof body !== "object") return false;
  const cast = body as Record<string, unknown>;
  if (!Array.isArray(cast.messages) || cast.messages.length === 0 || cast.messages.length > 40) {
    return false;
  }
  for (const item of cast.messages) {
    if (!item || typeof item !== "object") return false;
    const msg = item as Record<string, unknown>;
    if (typeof msg.role !== "string" || msg.role.length === 0 || msg.role.length > 24) return false;
    if (typeof msg.content !== "string" || msg.content.length === 0 || msg.content.length > 12_000) return false;
  }
  if (typeof cast.model !== "undefined" && (typeof cast.model !== "string" || cast.model.length > 120)) {
    return false;
  }
  if (
    typeof cast.temperature !== "undefined" &&
    (typeof cast.temperature !== "number" || Number.isNaN(cast.temperature) || cast.temperature < 0 || cast.temperature > 2)
  ) {
    return false;
  }
  if (typeof cast.stream !== "undefined" && typeof cast.stream !== "boolean") return false;
  return true;
}

type FrontendMode = "none" | "vite" | "static";

export async function createApp(frontendMode: FrontendMode = "none") {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();

  app.disable("x-powered-by");
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS origin não permitida"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  app.use(express.json({ limit: "256kb" }));
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Content-Security-Policy", buildContentSecurityPolicy());
    }
    next();
  });
  app.use((req, res, next) => {
    // #region agent log
    debugAgentLog("http_request_start", "H7", { method: req.method, path: req.path });
    // #endregion
    res.on("finish", () => {
      // #region agent log
      debugAgentLog("http_request_finish", "H7", { method: req.method, path: req.path, statusCode: res.statusCode });
      // #endregion
    });
    next();
  });
  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!err) return next();
    const maybeError = err as { message?: string; type?: string; status?: number };
    if (maybeError.message?.includes("CORS origin não permitida")) {
      const ip = getClientIp(_req);
      const userAgent = typeof _req.headers["user-agent"] === "string" ? _req.headers["user-agent"] : undefined;
      void logSecurityEvent({
        eventType: "cors_origin_blocked",
        severity: "medium",
        source: "api",
        ip,
        userAgent,
        route: _req.path,
        details: { method: _req.method, origin: _req.headers.origin ?? null },
      });
      return res.status(403).json({ error: "Origem não permitida." });
    }
    if (maybeError.type === "entity.too.large") {
      const ip = getClientIp(_req);
      const userAgent = typeof _req.headers["user-agent"] === "string" ? _req.headers["user-agent"] : undefined;
      void logSecurityEvent({
        eventType: "payload_too_large",
        severity: "medium",
        source: "api",
        ip,
        userAgent,
        route: _req.path,
        details: { method: _req.method },
      });
      return res.status(413).json({ error: "Payload muito grande." });
    }
    return next(err);
  });

  /** Agrega texto de legendas YouTube (json3). Usado pelo Resumidor de Vídeo (evita CORS no browser). */
  function parseYoutubeJson3Captions(json: { events?: Array<{ segs?: Array<{ utf8?: string }> }> }): string {
    if (!json?.events) return "";
    const parts: string[] = [];
    for (const ev of json.events) {
      if (!ev.segs) continue;
      for (const seg of ev.segs) {
        if (typeof seg.utf8 === "string") parts.push(seg.utf8);
      }
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  app.get("/api/youtube-transcript", async (req, res) => {
    const authenticatedUser = await authenticatebackendUser(req, res);
    if (!authenticatedUser) return;
    const ip = getClientIp(req);
    const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined;
    const limitKey = `yt:${authenticatedUser.id}:${ip}`;
    const paidAccess = hasPaidAccess(authenticatedUser);
    const rate = await hitRateLimitHybrid(
      limitKey,
      Date.now(),
      paidAccess ? 30 : 2,
      paidAccess ? 10 * 60_000 : 24 * 60 * 60_000
    );
    if (rate.limited) {
      void logSecurityEvent({
        actorUserId: authenticatedUser.id,
        eventType: "rate_limit_youtube_transcript",
        severity: "medium",
        source: "api",
        ip,
        userAgent,
        route: req.path,
        details: { retryAfterSec: Math.ceil(rate.resetMs / 1000) },
      });
      res.setHeader("Retry-After", String(Math.ceil(rate.resetMs / 1000)));
      return res.status(429).json({ error: "Muitas requisições. Tente novamente em alguns minutos." });
    }
    const raw = typeof req.query.v === "string" ? req.query.v.trim() : "";
    const idMatch = raw.match(/[a-zA-Z0-9_-]{11}/);
    const videoId = idMatch ? idMatch[0] : "";
    if (!videoId) {
      return res.status(400).json({ error: "Informe v= com URL ou id do YouTube (11 caracteres)." });
    }
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    const tryLangs = ["pt", "pt-BR", "en", "en-US", "es"];
    try {
      for (const lang of tryLangs) {
        const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${encodeURIComponent(lang)}&fmt=json3`;
        const r = await fetch(url, { headers: { "User-Agent": ua, Accept: "application/json,*/*" } });
        if (!r.ok) continue;
        const rawBody = await r.text();
        if (!rawBody || rawBody.length < 15) continue;
        let parsed: { events?: unknown };
        try {
          parsed = JSON.parse(rawBody) as { events?: unknown };
        } catch {
          continue;
        }
        const transcript = parseYoutubeJson3Captions(parsed as Parameters<typeof parseYoutubeJson3Captions>[0]);
        if (transcript.length >= 40) {
          console.log(`[VIDEO] transcript ok videoId=${videoId} lang=${lang} chars=${transcript.length}`);
          return res.json({ transcript, lang });
        }
      }
      const fallbackUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&fmt=json3`;
      const r2 = await fetch(fallbackUrl, { headers: { "User-Agent": ua, Accept: "application/json,*/*" } });
      if (r2.ok) {
        const rawBody = await r2.text();
        try {
          const parsed = JSON.parse(rawBody) as Parameters<typeof parseYoutubeJson3Captions>[0];
          const transcript = parseYoutubeJson3Captions(parsed);
          if (transcript.length >= 40) {
            console.log(`[VIDEO] transcript ok videoId=${videoId} lang=auto chars=${transcript.length}`);
            return res.json({ transcript, lang: "auto" });
          }
        } catch {
          /* ignore */
        }
      }
      console.warn(`[VIDEO] no transcript videoId=${videoId}`);
      return res.status(404).json({
        error:
          "Não foi possível obter legendas deste vídeo (muitos vídeos não têm legenda automática ou estão bloqueadas). Tente outro link.",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[VIDEO] transcript proxy error:", msg);
      return res.status(500).json({
        error: "Falha ao buscar legendas no YouTube.",
        ...(process.env.NODE_ENV !== "production" ? { details: msg } : {}),
      });
    }
  });

  // AI Proxy Route
  app.post("/api/ai", async (req, res) => {
    const authenticatedUser = await authenticatebackendUser(req, res);
    if (!authenticatedUser) return;
    const ip = getClientIp(req);
    const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined;
    const limitKey = `ai:${authenticatedUser.id}:${ip}`;
    const paidAccess = hasPaidAccess(authenticatedUser);
    const rate = await hitRateLimitHybrid(
      limitKey,
      Date.now(),
      paidAccess ? 20 : 3,
      paidAccess ? 5 * 60_000 : 24 * 60 * 60_000
    );
    if (rate.limited) {
      void logSecurityEvent({
        actorUserId: authenticatedUser.id,
        eventType: "rate_limit_ai",
        severity: "high",
        source: "api",
        ip,
        userAgent,
        route: req.path,
        details: { retryAfterSec: Math.ceil(rate.resetMs / 1000) },
      });
      res.setHeader("Retry-After", String(Math.ceil(rate.resetMs / 1000)));
      return res.status(429).json({ error: "Limite de uso da IA atingido. Aguarde e tente novamente." });
    }
    if (!isValidAiRequestBody(req.body)) {
      void logSecurityEvent({
        actorUserId: authenticatedUser.id,
        eventType: "invalid_ai_payload",
        severity: "medium",
        source: "api",
        ip,
        userAgent,
        route: req.path,
        details: { bodyKeys: Object.keys(req.body ?? {}) },
      });
      return res.status(400).json({ error: "Payload inválido para /api/ai." });
    }
    const { messages, model, temperature } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;
    // Em Functions, a Vercel fornece o token OIDC no request — não em process.env.
    // Em desenvolvimento local, `vercel env pull` o disponibiliza como variável.
    const GATEWAY_TOKEN =
      process.env.AI_GATEWAY_API_KEY ??
      req.header("x-vercel-oidc-token") ??
      process.env.VERCEL_OIDC_TOKEN;
    const useGateway = !API_KEY && Boolean(GATEWAY_TOKEN);

    if (!API_KEY && !GATEWAY_TOKEN) {
      console.error("❌ Erro: provedor de IA não configurado no ambiente.");
      return res.status(503).json({ error: "Serviço de IA temporariamente indisponível." });
    }

    try {
      const resolvedModel = model || DEFAULT_OPENROUTER_CHAT_MODEL;
      const modelChain = useGateway
        ? buildGatewayModelChain(resolvedModel)
        : buildOpenRouterModelChain(resolvedModel);
      const isStream = !!req.body.stream;
      const retryRounds = useGateway ? 1 : OPENROUTER_429_MAX_ROUNDS;
      const upstreamUrl = useGateway
        ? "https://ai-gateway.vercel.sh/v1/chat/completions"
        : "https://openrouter.ai/api/v1/chat/completions";
      debugAgentLog("chain_start", "H1-H3", {
        hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
        hasGatewayToken: Boolean(GATEWAY_TOKEN),
        provider: useGateway ? "vercel-ai-gateway" : "openrouter",
        requestedModel: model,
        resolvedModel,
        chainLen: modelChain.length,
        isStream,
      });
      console.log(`📡 Servidor: encaminhando requisição para ${useGateway ? "Vercel AI Gateway" : "OpenRouter"} (${resolvedModel})`);

      const upstreamSignal =
        typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
          ? AbortSignal.timeout(120_000)
          : undefined;

      for (let attempt = 0; attempt < modelChain.length; attempt++) {
        const tryModel = modelChain[attempt];
        let advanceToNextModel = false;

        for (let r429Round = 0; r429Round < retryRounds; r429Round++) {
          const response = await fetch(upstreamUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${useGateway ? GATEWAY_TOKEN : API_KEY}`,
              "Content-Type": "application/json",
              ...(useGateway
                ? {}
                : {
                    "HTTP-Referer": "https://athena.studyflow.app",
                    "X-Title": "Athena AI Proxy",
                  }),
            },
            body: JSON.stringify({
              model: tryModel,
              messages,
              temperature: temperature || 0.7,
              max_tokens: 4096,
              stream: isStream
            }),
            signal: upstreamSignal,
          });

          if (isStream) {
            if (response.ok) {
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');

              const reader = response.body?.getReader();
              if (!reader) return res.status(500).end();

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
              res.end();
              return;
            }

            const raw = await response.text();
            const retryNextStream =
              openRouterErrorRetryable(response.status, raw) && attempt < modelChain.length - 1;
            const willBackoff429 =
              response.status === 429 && r429Round < retryRounds - 1;
            debugAgentLog("upstream_response", "H1-H4-H5", {
              branch: "stream",
              tryModel,
              attempt,
              r429Round,
              status: response.status,
              rawHead: String(raw).slice(0, 220),
              willBackoff429,
              retryNext: retryNextStream,
            });
            if (response.status === 429 && r429Round < retryRounds - 1) {
              const backoffMs = openRouter429BackoffMs(r429Round);
              await new Promise((r) => setTimeout(r, backoffMs));
              continue;
            }

            if (retryNextStream) {
              console.warn(`[OpenRouter] ${tryModel} falhou (${response.status}), tentando próximo modelo…`);
              advanceToNextModel = true;
              break;
            }

            let data: unknown;
            try {
              data = JSON.parse(raw);
            } catch {
              data = { error: { message: sanitizeUpstreamErrorMessage(raw || `HTTP ${response.status}`) } };
            }
            console.error("❌ Erro OpenRouter (stream):", data);
            debugAgentLog("proxy_final_error", "H1-H5", {
              branch: "stream",
              tryModel,
              status: response.status,
              parseOk: typeof data === "object" && data !== null,
            });
            return res.status(response.status).json(
              clientFacingOpenRouterError(
                response.status,
                typeof data === "object" && data !== null
                  ? data
                  : { error: sanitizeUpstreamErrorMessage(String(data)) }
              )
            );
          }

          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          }

          const raw = await response.text();
          const retryNextJson =
            openRouterErrorRetryable(response.status, raw) && attempt < modelChain.length - 1;
          const willBackoff429Json =
            response.status === 429 && r429Round < retryRounds - 1;
          debugAgentLog("upstream_response", "H1-H4-H5", {
            branch: "json",
            tryModel,
            attempt,
            r429Round,
            status: response.status,
            rawHead: String(raw).slice(0, 220),
            willBackoff429: willBackoff429Json,
            retryNext: retryNextJson,
          });
          if (response.status === 429 && r429Round < retryRounds - 1) {
            const backoffMs = openRouter429BackoffMs(r429Round);
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          if (retryNextJson) {
            console.warn(`[OpenRouter] ${tryModel} falhou (${response.status}), tentando próximo modelo…`);
            advanceToNextModel = true;
            break;
          }

          let data: unknown;
          try {
            data = JSON.parse(raw);
          } catch {
            data = { error: { message: sanitizeUpstreamErrorMessage(raw || `HTTP ${response.status}`) } };
          }
          console.error("❌ Erro OpenRouter:", data);
          debugAgentLog("proxy_final_error", "H1-H5", {
            branch: "json",
            tryModel,
            status: response.status,
            parseOk: typeof data === "object" && data !== null,
          });
          return res.status(response.status).json(
            clientFacingOpenRouterError(
              response.status,
              typeof data === "object" && data !== null
                ? data
                : { error: sanitizeUpstreamErrorMessage(String(data)) }
            )
          );
        }

        if (advanceToNextModel) continue;
      }
    } catch (error: unknown) {
      void logSecurityEvent({
        actorUserId: authenticatedUser.id,
        eventType: "ai_proxy_internal_error",
        severity: "high",
        source: "api",
        ip,
        userAgent,
        route: req.path,
        details: { message: error instanceof Error ? error.message : "unknown_error" },
      });
      console.error("❌ Erro no Proxy AI:", error);
      const message = error instanceof Error ? error.message : "Erro interno";
      res.status(500).json({
        error: "Erro na comunicação com o provedor de IA",
        ...(process.env.NODE_ENV !== "production" ? { details: message } : {}),
      });
    }
  });

  // Vite middleware for development
  if (frontendMode === "vite") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (frontendMode === "static") {
    // Serving static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

export async function startServer() {
  const PORT = Number(process.env.PORT || 3000);
  const frontendMode: FrontendMode = process.env.NODE_ENV === "production" ? "static" : "vite";
  const app = await createApp(frontendMode);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor pronto em http://localhost:${PORT}`);
  });
}

const isDirectExecution = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === __filename;
if (isDirectExecution) {
  void startServer();
}
