import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser
  app.use(express.json());

  // In-memory "database" for now
  let db = {
    users: {
      "default": {
        id: "default",
        name: "Estudante Premium",
        xp: 1250,
        level: 12,
        streak: 5,
        league: "Ouro",
        coins: 450,
        history: [] as any[],
        stats: {
          solved: 145,
          correct: 112,
          timeSpent: 3600 * 5, // 5 hours
        }
      }
    },
    leaderboard: [
      { id: '1', name: 'Gabriele Sa', solved: 12500, correct: 11200, streak: 45, level: 50, xp: 125000 },
      { id: '2', name: 'Maria Santos', solved: 11300, correct: 10100, streak: 32, level: 48, xp: 113000 },
      { id: '3', name: 'Pedro Oliveira', solved: 10900, correct: 9800, streak: 28, level: 45, xp: 109000 },
      { id: 'default', name: 'Estudante Premium', solved: 145, correct: 112, streak: 5, level: 12, xp: 1250 },
    ]
  };

  // API routes
  app.get("/api/user", (req, res) => {
    res.json(db.users.default);
  });

  app.post("/api/user/xp", (req, res) => {
    const { amount } = req.body;
    const user = db.users.default;
    user.xp += amount;
    user.level = Math.floor(user.xp / 1000) + 1;
    
    // Update leaderboard
    const lbEntry = db.leaderboard.find(e => e.id === 'default');
    if (lbEntry) {
      lbEntry.xp = user.xp;
      lbEntry.level = user.level;
    }
    
    res.json(user);
  });

  app.get("/api/leaderboard", (req, res) => {
    res.json(db.leaderboard.sort((a, b) => b.xp - a.xp));
  });

  app.get("/api/history", (req, res) => {
    res.json(db.users.default.history);
  });

  app.post("/api/history", (req, res) => {
    const { item } = req.body;
    const user = db.users.default;
    const entry = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    };
    user.history.push(entry);
    user.stats.solved += 1;
    if (item.isCorrect) user.stats.correct += 1;
    
    res.json(entry);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
