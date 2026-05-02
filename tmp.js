var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var useStore_exports = {};
__export(useStore_exports, {
  usePlan: () => usePlan,
  useStore: () => useStore
});
module.exports = __toCommonJS(useStore_exports);
var import_zustand = require("zustand");
var import_middleware = require("zustand/middleware");
const useStore = (0, import_zustand.create)()(
  (0, import_middleware.persist)(
    (set, get) => ({
      name: "Estudante",
      bio: "Focado na aprova\xE7\xE3o! \u{1F680}",
      profilePic: "",
      coverPic: "",
      themeColor: "#10B981",
      xp: 0,
      level: 1,
      streak: 0,
      league: "Bronze",
      dailyXP: 0,
      lastStudyDate: null,
      dailyGoalMinutes: 120,
      sessions: [],
      decks: [
        { id: "1", name: "Biologia Celular", subject: "Biologia", cardCount: 12, newCards: 5, reviewCards: 7 },
        { id: "2", name: "Mec\xE2nica", subject: "F\xEDsica", cardCount: 8, newCards: 2, reviewCards: 6 }
      ],
      flashcards: [],
      notes: [],
      chatHistory: [],
      blockedApps: ["Instagram", "TikTok", "YouTube"],
      isAppBlockerActive: false,
      favorites: [],
      reviewLater: [],
      favoriteExams: [],
      history: [],
      exams: [
        // Vestibulares 2026 (Lista Completa)
        { id: "enem_2026", nome: "ENEM 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Matem\xE1tica", "Portugu\xEAs", "Humanas", "Natureza"], nivel: "M\xE9dio", descricao: "Exame Nacional do Ensino M\xE9dio" },
        { id: "fuvest_2026", nome: "Fuvest 2026", tipo: "vestibular", data: "2026-11-22", diasRestantes: 0, materias: ["Geral"], nivel: "Dif\xEDcil", descricao: "Vestibular da USP" },
        { id: "unicamp_2026", nome: "Unicamp 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Dif\xEDcil", descricao: "Vestibular da Unicamp" },
        { id: "unesp_2026", nome: "UNESP 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular da Unesp" },
        { id: "ita_2026", nome: "ITA 2026", tipo: "vestibular", data: "2026-10-10", diasRestantes: 0, materias: ["Matem\xE1tica", "F\xEDsica", "Qu\xEDmica"], nivel: "Muito Dif\xEDcil", descricao: "Vestibular do ITA" },
        { id: "ime_2026", nome: "IME 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Matem\xE1tica", "F\xEDsica", "Qu\xEDmica"], nivel: "Muito Dif\xEDcil", descricao: "Vestibular do IME" },
        { id: "ufrj", nome: "UFRJ 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFRJ" },
        { id: "ufmg", nome: "UFMG 2026", tipo: "vestibular", data: "2026-11-01", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFMG" },
        { id: "ufpr", nome: "UFPR 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFPR" },
        { id: "ufsc", nome: "UFSC 2026", tipo: "vestibular", data: "2026-10-30", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFSC" },
        { id: "puc_sp", nome: "PUC-SP 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular PUC-SP" },
        { id: "fgv", nome: "FGV 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Dif\xEDcil", descricao: "Vestibular FGV" },
        { id: "insper", nome: "Insper 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Dif\xEDcil", descricao: "Vestibular Insper" },
        { id: "ufrgs_2026", nome: "UFRGS 2026", tipo: "vestibular", data: "2026-11-01", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFRGS" },
        { id: "ufba_2026", nome: "UFBA 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFBA" },
        { id: "ufpe_2026", nome: "UFPE 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFPE" },
        { id: "ufrn_2026", nome: "UFRN 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFRN" },
        { id: "ufal_2026", nome: "UFAL 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFAL" },
        { id: "ufpi_2026", nome: "UFPI 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFPI" },
        { id: "ufpa_2026", nome: "UFPA 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFPA" },
        { id: "ufam_2026", nome: "UFAM 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFAM" },
        { id: "unb_2026", nome: "UnB 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular da UnB" },
        { id: "ufg_2026", nome: "UFG 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFG" },
        { id: "ufmt_2026", nome: "UFMT 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFMT" },
        { id: "ufms_2026", nome: "UFMS 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UFMS" },
        { id: "uece_2026", nome: "UECE 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UECE" },
        { id: "uema_2026", nome: "UEMA 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UEMA" },
        { id: "upe_2026", nome: "UPE 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular UPE" },
        { id: "puc_rj_2026", nome: "PUC-RJ 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular PUC-RJ" },
        { id: "espm_2026", nome: "ESPM 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular ESPM" },
        { id: "faap_2026", nome: "FAAP 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "M\xE9dio", descricao: "Vestibular FAAP" },
        { id: "einstein_2026", nome: "Albert Einstein 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Dif\xEDcil", descricao: "Vestibular Medicina Einstein" },
        // Concursos Públicos 2026
        { id: "policia_federal", nome: "Pol\xEDcia Federal", tipo: "concurso", data: "2026-06-19", diasRestantes: 0, materias: ["Direito", "Inform\xE1tica", "Racioc\xEDnio L\xF3gico"], nivel: "Dif\xEDcil", descricao: "Concurso Agente PF" },
        { id: "prf", nome: "PRF", tipo: "concurso", data: "2026-08-10", diasRestantes: 0, materias: ["Legisla\xE7\xE3o de Tr\xE2nsito", "Direito"], nivel: "Dif\xEDcil", descricao: "Concurso Policial Rodovi\xE1rio Federal" },
        { id: "inss", nome: "INSS", tipo: "concurso", data: "2026-09-15", diasRestantes: 0, materias: ["Seguridade Social", "Direito"], nivel: "M\xE9dio", descricao: "Concurso T\xE9cnico do Seguro Social" },
        { id: "banco_brasil", nome: "Banco do Brasil", tipo: "concurso", data: "2026-07-20", diasRestantes: 0, materias: ["Conhecimentos Banc\xE1rios"], nivel: "M\xE9dio", descricao: "Concurso Escritur\xE1rio BB" },
        { id: "caixa", nome: "Caixa Econ\xF4mica", tipo: "concurso", data: "2026-08-30", diasRestantes: 0, materias: ["Conhecimentos Banc\xE1rios"], nivel: "M\xE9dio", descricao: "Concurso T\xE9cnico Banc\xE1rio Caixa" },
        { id: "petrobras", nome: "Petrobras", tipo: "concurso", data: "2026-05-20", diasRestantes: 0, materias: ["Conhecimentos T\xE9cnicos"], nivel: "M\xE9dio", descricao: "Concurso Petrobras" },
        { id: "petroreconcavo", nome: "PetroRec\xF4ncavo", tipo: "concurso", data: "2026-07-10", diasRestantes: 0, materias: ["Conhecimentos T\xE9cnicos"], nivel: "M\xE9dio", descricao: "Concurso PetroRec\xF4ncavo" },
        { id: "correios", nome: "Correios", tipo: "concurso", data: "2026-09-05", diasRestantes: 0, materias: ["Portugu\xEAs", "Matem\xE1tica"], nivel: "F\xE1cil", descricao: "Concurso Agente de Correios" },
        { id: "receita", nome: "Receita Federal", tipo: "concurso", data: "2026-10-15", diasRestantes: 0, materias: ["Direito Tribut\xE1rio"], nivel: "Dif\xEDcil", descricao: "Concurso Auditor Fiscal" },
        { id: "ibge", nome: "IBGE", tipo: "concurso", data: "2026-06-01", diasRestantes: 0, materias: ["Geografia", "Matem\xE1tica"], nivel: "F\xE1cil", descricao: "Concurso Recenseador IBGE" }
      ],
      routine: null,
      achievements: [
        { id: "1", title: "Primeiro Passo", description: "Completou sua primeira sess\xE3o de foco", icon: "\u{1F3AF}", unlocked: false },
        { id: "2", title: "Fogo nos Estudos", description: "Manteve um streak de 7 dias", icon: "\u{1F525}", unlocked: false },
        { id: "100q", title: "Centuri\xE3o", description: "Resolveu 100 quest\xF5es", icon: "\u{1F4AF}", unlocked: false, progress: 0, maxProgress: 100 },
        { id: "1000q", title: "Mestre das Quest\xF5es", description: "Resolveu 1000 quest\xF5es", icon: "\u{1F451}", unlocked: false, progress: 0, maxProgress: 1e3 },
        { id: "enem", title: "Foco no ENEM", description: "Resolveu 50 quest\xF5es do ENEM", icon: "\u{1F4DD}", unlocked: false, progress: 0, maxProgress: 50 }
      ],
      mindMaps: [],
      essays: [],
      savedTopics: [],
      showOnlyReviewLater: false,
      navFilters: {},
      setNavFilters: (navFilters) => set({ navFilters }),
      clearNavFilters: () => set({ navFilters: {} }),
      hasCompletedOnboarding: false,
      dailyChallenge: null,
      userId: null,
      isAuthReady: false,
      levelUpData: null,
      smartRecommendation: null,
      mastery: {
        "Matem\xE1tica": 0,
        "Portugu\xEAs": 0,
        "F\xEDsica": 0,
        "Qu\xEDmica": 0,
        "Biologia": 0,
        "Hist\xF3ria": 0,
        "Geografia": 0,
        "Filosofia": 0,
        "Sociologia": 0,
        "Ingl\xEAs": 0
      },
      voiceEnabled: false,
      learningPaths: {},
      currentBossBattle: null,
      studyRooms: {
        activeRoom: null,
        rooms: [
          { id: "library", name: "Biblioteca Central", vibe: "Lofi & Chuva", users: 1242, icon: "Library", youtubeId: "5qap5aO4i9A" },
          { id: "cafe", name: "Cyberpunk Caf\xE9", vibe: "Synthwave & Neon", users: 856, icon: "Coffee", youtubeId: "W1B5Z9A2bEQ" },
          { id: "forest", name: "Cabana na Floresta", vibe: "Natureza & Calma", users: 432, icon: "Trees", youtubeId: "xNN7iTA57jM" },
          { id: "space", name: "Esta\xE7\xE3o Espacial", vibe: "Ambiente & Estrelas", users: 215, icon: "Rocket", youtubeId: "qHBFvwjcJkY" },
          { id: "rock", name: "Rock Cl\xE1ssico", vibe: "Energia & Foco", users: 340, icon: "Zap", youtubeId: "kXYiU_JCYtU" },
          { id: "rain", name: "Som de Chuva", vibe: "Chuva Forte", users: 512, icon: "CloudRain", youtubeId: "mPZkdNFkNps" }
        ],
        globalPulse: 2745,
        audioVolume: 50,
        audioPlaying: false
      },
      essayCoPilot: {
        enabled: false,
        suggestions: [],
        analysis: null
      },
      memoryRooms: [],
      neuralSync: 0,
      prestigeLevel: 0,
      plan: "free",
      flashcardsAddedToday: 0,
      lastFlashcardAddedDate: null,
      aiTutorQueriesToday: 0,
      lastAiTutorQueryDate: null,
      essaysThisWeek: 0,
      lastEssayDate: null,
      streakProtectorActive: false,
      dailyFlashcardsUsed: 0,
      dailyFlashcardsDate: null,
      featureUsage: {},
      onboardingData: null,
      leaderboard: [
        { id: "1", name: "Gabriele Sa", solved: 12500, correct: 11200, streak: 45, level: 50, xp: 125e3, medals: { gold: 12, silver: 5, bronze: 2 } },
        { id: "2", name: "Maria Santos", solved: 11300, correct: 10100, streak: 32, level: 48, xp: 113e3, medals: { gold: 8, silver: 10, bronze: 4 } },
        { id: "3", name: "Pedro Oliveira", solved: 10900, correct: 9800, streak: 28, level: 45, xp: 109e3, medals: { gold: 5, silver: 8, bronze: 12 } },
        { id: "4", name: "Ana Costa", solved: 9500, correct: 8500, streak: 20, level: 40, xp: 95e3, medals: { gold: 3, silver: 6, bronze: 8 } },
        { id: "5", name: "Lucas Pereira", solved: 8200, correct: 7300, streak: 15, level: 35, xp: 82e3, medals: { gold: 1, silver: 4, bronze: 15 } }
      ],
      setName: (name) => set({ name }),
      setBio: (bio) => set({ bio }),
      setProfilePic: (profilePic) => set({ profilePic }),
      setCoverPic: (coverPic) => set({ coverPic }),
      setThemeColor: (themeColor) => set({ themeColor }),
      prestige: () => set((state) => ({
        prestigeLevel: state.prestigeLevel + 1,
        level: 1,
        xp: 0,
        mastery: {},
        achievements: state.achievements.map((a) => ({ ...a, unlocked: false, progress: 0 })),
        neuralSync: 0
      })),
      clearLevelUp: () => set({ levelUpData: null }),
      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const newDailyXP = state.dailyXP + amount;
        const oldLevel = state.level;
        const newLevel = Math.min(100, Math.floor(newXP / 1e3) + 1);
        let newLeague = state.league;
        if (newXP >= 1e4) newLeague = "Diamante";
        else if (newXP >= 5e3) newLeague = "Ouro";
        else if (newXP >= 2e3) newLeague = "Prata";
        import("./useCelebrationStore").then(({ useCelebrationStore }) => {
          const randomX = (typeof window !== "undefined" ? window.innerWidth / 2 : 200) + (Math.random() * 100 - 50);
          useCelebrationStore.getState().addXPEvent(amount, randomX, window.innerHeight / 2);
          if (newLevel > oldLevel) {
            useCelebrationStore.getState().triggerLevelUp(newLevel);
          }
        });
        set({
          xp: newXP,
          level: newLevel,
          dailyXP: newDailyXP,
          league: newLeague,
          levelUpData: newLevel > oldLevel ? { oldLevel, newLevel } : state.levelUpData
        });
        get().updateLeaderboard();
      },
      addSession: (session) => {
        const { sessions, lastStudyDate, streak } = get();
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        let newStreak = streak;
        if (lastStudyDate !== today) {
          newStreak += 1;
        }
        set({
          sessions: [session, ...sessions],
          lastStudyDate: today,
          streak: newStreak
        });
        get().addXP(session.duration * 10);
      },
      addFlashcard: (card) => set((state) => ({
        flashcards: [{ ...card, easeFactor: 2.5, repetitions: 0 }, ...state.flashcards]
      })),
      deleteFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter((f) => f.id !== id)
      })),
      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map((f) => f.id === id ? { ...f, ...updates } : f)
      })),
      reviewFlashcard: (id, rating) => set((state) => {
        const flashcards = state.flashcards.map((f) => {
          if (f.id !== id) return f;
          let { easeFactor = 2.5, repetitions = 0, interval = 0 } = f;
          if (rating === "again") {
            repetitions = 0;
            interval = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
          } else if (rating === "hard") {
            repetitions = Math.max(1, repetitions);
            interval = Math.max(1, interval * 1.2);
            easeFactor = Math.max(1.3, easeFactor - 0.15);
          } else if (rating === "good") {
            repetitions += 1;
            interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : interval * easeFactor;
          } else if (rating === "easy") {
            repetitions += 1;
            interval = repetitions === 1 ? 4 : interval * easeFactor * 1.3;
            easeFactor += 0.15;
          }
          interval = Math.round(interval);
          const nextReviewDate = /* @__PURE__ */ new Date();
          nextReviewDate.setDate(nextReviewDate.getDate() + interval);
          let level = "Novo";
          if (interval > 21) level = "Dominado";
          else if (interval > 7) level = "Revisando";
          else if (interval > 0) level = "Aprendendo";
          return {
            ...f,
            easeFactor,
            repetitions,
            interval,
            level,
            nextReview: nextReviewDate.toISOString(),
            lastReviewed: (/* @__PURE__ */ new Date()).toISOString()
          };
        });
        return { flashcards };
      }),
      addDeck: (deck) => set((state) => ({
        decks: [deck, ...state.decks]
      })),
      deleteDeck: (id) => set((state) => ({
        decks: state.decks.filter((d) => d.id !== id),
        flashcards: state.flashcards.filter((f) => f.deckId !== id)
      })),
      addNote: (note) => set((state) => ({
        notes: [note, ...state.notes]
      })),
      updateNote: (id, content) => set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, content, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : n)
      })),
      checkStreak: () => {
        const { lastStudyDate, streak, streakProtectorActive } = get();
        if (!lastStudyDate) return;
        const lastDate = new Date(lastStudyDate);
        const today = /* @__PURE__ */ new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        if (diffDays > 1) {
          if (streakProtectorActive) {
            set({ streakProtectorActive: false, lastStudyDate: today.toISOString().split("T")[0] });
          } else {
            set({ streak: 0 });
          }
        }
      },
      addChatMessage: (msg) => set((state) => ({
        chatHistory: [...state.chatHistory, msg]
      })),
      clearChat: () => set({ chatHistory: [] }),
      toggleAppBlocker: (active) => set({ isAppBlockerActive: active }),
      setBlockedApps: (apps) => set({ blockedApps: apps }),
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id) ? state.favorites.filter((fid) => fid !== id) : [...state.favorites, id]
      })),
      toggleReviewLater: (id) => set((state) => ({
        reviewLater: state.reviewLater.includes(id) ? state.reviewLater.filter((fid) => fid !== id) : [...state.reviewLater, id]
      })),
      toggleFavoriteExam: (id) => set((state) => ({
        favoriteExams: state.favoriteExams.includes(id) ? state.favoriteExams.filter((fid) => fid !== id) : [...state.favoriteExams, id]
      })),
      addToHistory: (entry) => {
        set((state) => {
          const newHistory = [entry, ...state.history];
          const totalSolved = newHistory.length;
          const achievements = [...state.achievements];
          const updateAchievement = (id, progress, max) => {
            const idx = achievements.findIndex((a) => a.id === id);
            if (idx !== -1 && !achievements[idx].unlocked) {
              achievements[idx].progress = progress;
              if (progress >= max) achievements[idx].unlocked = true;
            }
          };
          updateAchievement("100q", totalSolved, 100);
          updateAchievement("1000q", totalSolved, 1e3);
          return { history: newHistory, achievements };
        });
        get().updateLeaderboard();
      },
      setRoutine: (routine) => set({ routine }),
      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map((a) => a.id === id ? { ...a, unlocked: true } : a)
      })),
      addMindMap: (map) => set((state) => ({
        mindMaps: [map, ...state.mindMaps]
      })),
      updateLeaderboard: () => {
        const { name, history, streak, level, xp, leaderboard } = get();
        const solved = history.length;
        const correct = history.filter((h) => h.isCorrect).length;
        const userEntry = {
          id: "me",
          name: name || "Voc\xEA",
          solved,
          correct,
          streak,
          level,
          xp,
          medals: {
            gold: Math.floor(level / 10),
            silver: Math.floor(level / 5),
            bronze: Math.floor(level / 2)
          }
        };
        const filteredLeaderboard = leaderboard.filter((e) => e.id !== "me");
        const newLeaderboard = [...filteredLeaderboard, userEntry].sort((a, b) => b.xp - a.xp);
        set({ leaderboard: newLeaderboard });
      },
      addEssay: (essay) => set((state) => ({ essays: [essay, ...state.essays] })),
      updateEssay: (id, updates) => set((state) => ({
        essays: state.essays.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),
      toggleSavedTopic: (id) => set((state) => ({
        savedTopics: state.savedTopics.includes(id) ? state.savedTopics.filter((t) => t !== id) : [...state.savedTopics, id]
      })),
      setUserId: (userId) => set({ userId }),
      setAuthReady: (isAuthReady) => set({ isAuthReady }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setDailyChallenge: (dailyChallenge) => set({ dailyChallenge }),
      setSmartRecommendation: (smartRecommendation) => set({ smartRecommendation }),
      updateMastery: (subject, score) => set((state) => {
        const currentMastery = state.mastery[subject] || 0;
        const newMastery = Math.min(100, Math.max(0, currentMastery * 0.7 + score * 0.3));
        return { mastery: { ...state.mastery, [subject]: newMastery } };
      }),
      toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      setLearningPath: (subject, path) => set((state) => ({
        learningPaths: { ...state.learningPaths, [subject]: path }
      })),
      completeMilestone: (subject, milestoneId) => set((state) => {
        const path = state.learningPaths[subject];
        if (!path) return state;
        const newMilestones = path.milestones.map(
          (m) => m.id === milestoneId ? { ...m, isCompleted: true } : m
        );
        return {
          learningPaths: {
            ...state.learningPaths,
            [subject]: { ...path, milestones: newMilestones }
          }
        };
      }),
      startBossBattle: (subject, questions) => set({
        currentBossBattle: { subject, questions, score: 0, isActive: true }
      }),
      endBossBattle: (score) => set((state) => {
        if (!state.currentBossBattle) return state;
        const subject = state.currentBossBattle.subject;
        const masteryBonus = score * 2;
        const currentMastery = state.mastery[subject] || 0;
        const newMastery = Math.min(100, currentMastery + masteryBonus);
        return {
          currentBossBattle: null,
          mastery: { ...state.mastery, [subject]: newMastery }
        };
      }),
      joinRoom: (roomId) => set((state) => ({
        studyRooms: { ...state.studyRooms, activeRoom: roomId, audioPlaying: !!roomId }
      })),
      updateGlobalPulse: () => set((state) => ({
        studyRooms: { ...state.studyRooms, globalPulse: state.studyRooms.globalPulse + Math.floor(Math.random() * 10) - 5 }
      })),
      setAudioVolume: (volume) => set((state) => ({
        studyRooms: { ...state.studyRooms, audioVolume: volume }
      })),
      setAudioPlaying: (playing) => set((state) => ({
        studyRooms: { ...state.studyRooms, audioPlaying: playing }
      })),
      toggleEssayCoPilot: () => set((state) => ({
        essayCoPilot: { ...state.essayCoPilot, enabled: !state.essayCoPilot.enabled }
      })),
      setEssayAnalysis: (analysis) => set((state) => ({
        essayCoPilot: { ...state.essayCoPilot, analysis }
      })),
      addEssaySuggestion: (suggestion) => set((state) => ({
        essayCoPilot: { ...state.essayCoPilot, suggestions: [suggestion, ...state.essayCoPilot.suggestions].slice(0, 5) }
      })),
      clearEssaySuggestions: () => set((state) => ({
        essayCoPilot: { ...state.essayCoPilot, suggestions: [] }
      })),
      addMemoryRoom: (room) => set((state) => ({
        memoryRooms: [...state.memoryRooms, room]
      })),
      addMemoryItem: (roomId, item) => set((state) => ({
        memoryRooms: state.memoryRooms.map((r) => r.id === roomId ? { ...r, items: [...r.items, item] } : r)
      })),
      updateNeuralSync: (val) => set({ neuralSync: val }),
      setPlan: (plan) => set({ plan }),
      incrementFlashcardsAdded: () => {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        set((state) => ({
          flashcardsAddedToday: state.lastFlashcardAddedDate === today ? state.flashcardsAddedToday + 1 : 1,
          lastFlashcardAddedDate: today
        }));
      },
      incrementAiTutorQueries: () => {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        set((state) => ({
          aiTutorQueriesToday: state.lastAiTutorQueryDate === today ? state.aiTutorQueriesToday + 1 : 1,
          lastAiTutorQueryDate: today
        }));
      },
      incrementEssaysThisWeek: () => {
        const today = /* @__PURE__ */ new Date();
        set((state) => {
          let count = state.essaysThisWeek;
          const last = state.lastEssayDate ? new Date(state.lastEssayDate) : null;
          if (!last) {
            count = 1;
          } else {
            const diffTime = Math.abs(today.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
            if (diffDays > 7) {
              count = 1;
            } else {
              count += 1;
            }
          }
          return {
            essaysThisWeek: count,
            lastEssayDate: today.toISOString()
          };
        });
      },
      setStreakProtector: (active) => set({ streakProtectorActive: active }),
      incrementFlashcardUsage: () => {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        set((state) => ({
          dailyFlashcardsUsed: state.dailyFlashcardsDate === today ? state.dailyFlashcardsUsed + 1 : 1,
          dailyFlashcardsDate: today
        }));
      },
      trackFeature: (feature) => set((state) => ({
        featureUsage: {
          ...state.featureUsage,
          [feature]: (state.featureUsage[feature] || 0) + 1
        }
      })),
      setOnboardingData: (data) => set({ onboardingData: data })
    }),
    {
      name: "studyflow-storage-v10"
    }
  )
);
const usePlan = () => {
  const store = useStore();
  const isPremium = store.plan === "premium";
  const checkLimit = (feature) => {
    if (isPremium) return true;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    switch (feature) {
      case "flashcards":
        return store.dailyFlashcardsUsed < 10;
      case "aiTutor":
        return store.lastAiTutorQueryDate !== today || store.aiTutorQueriesToday < 3;
      case "essay":
        return store.essaysThisWeek < 1;
      case "exams":
        return false;
      case "streakProtector":
        return false;
      default:
        return true;
    }
  };
  return {
    plan: store.plan,
    isPremium,
    checkLimit
  };
};
