import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from "./src/config/openRouter";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // AI Proxy Route
  app.post("/api/ai", async (req, res) => {
    const { messages, model, temperature } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!API_KEY) {
      console.error("❌ Erro: OPENROUTER_API_KEY não configurada no ambiente.");
      return res.status(500).json({ error: "Configuração do servidor incompleta (API Key ausente)" });
    }

    try {
      console.log(`📡 Servidor: Encaminhando requisição para OpenRouter (${model})`);
      
      // Aborta chamadas presas ao OpenRouter (evita socket pendente no servidor).
      const upstreamSignal =
        typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
          ? AbortSignal.timeout(120_000)
          : undefined;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://studyflow.app",
          "X-Title": "StudyFlow AI Proxy",
        },
        body: JSON.stringify({
          model: model || DEFAULT_OPENROUTER_CHAT_MODEL,
          messages,
          temperature: temperature || 0.7,
          max_tokens: 4096,
          stream: req.body.stream || false
        }),
        signal: upstreamSignal,
      });

      if (req.body.stream) {
        if (!response.ok) {
          const raw = await response.text();
          let data: unknown;
          try {
            data = JSON.parse(raw);
          } catch {
            data = { error: { message: raw || `HTTP ${response.status}` } };
          }
          console.error("❌ Erro OpenRouter (stream):", data);
          return res.status(response.status).json(
            typeof data === "object" && data !== null ? data : { error: String(data) }
          );
        }
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

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Erro OpenRouter:", data);
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error: any) {
      console.error("❌ Erro no Proxy AI:", error);
      res.status(500).json({ error: "Erro na comunicação com o provedor de IA", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor pronto em http://localhost:${PORT}`);
  });
}

startServer();
