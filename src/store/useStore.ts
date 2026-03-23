import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  subject: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  deckId: string;
  level: 'Novo' | 'Aprendendo' | 'Revisando' | 'Dominado';
  interval: number; // in days
  nextReview: string;
  lastReviewed?: string;
}

export interface Deck {
  id: string;
  name: string;
  subject: string;
  cardCount: number;
  newCards: number;
  reviewCards: number;
}

export interface UpcomingExam {
  id: string;
  nome: string;
  data: string;
  diasRestantes: number;
}

export interface StudyRoutine {
  id: string;
  targetExam: string;
  dailyHours: number;
  schedule: {
    day: string;
    subjects: string[];
  }[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  type?: 'text' | 'plan' | 'questions' | 'flashcards';
  data?: any;
  engine?: string;
}

export interface Question {
  id: string;
  prova: string;
  ano: number;
  materia: string;
  assunto: string;
  pergunta: string;
  alternativas: string[];
  resposta: number;
  explicacao: string;
  imagem?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuestionHistory {
  questionId: string;
  userAnswer: number;
  isCorrect: boolean;
  timestamp: string;
  timeSpent?: number; // in seconds
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface MindMap {
  id: string;
  topic: string;
  nodes: {
    label: string;
    subNodes: string[];
  }[];
  createdAt: string;
}

export interface ExamDetail extends UpcomingExam {
  tipo: 'vestibular' | 'concurso';
  materias: string[];
  nivel: 'Fácil' | 'Médio' | 'Difícil' | 'Muito Difícil';
  descricao: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  solved: number;
  correct: number;
  streak: number;
  level: number;
  xp: number;
}

interface UserState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  league: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  dailyXP: number;
  lastStudyDate: string | null;
  dailyGoalMinutes: number;
  sessions: StudySession[];
  decks: Deck[];
  flashcards: Flashcard[];
  notes: Note[];
  chatHistory: Message[];
  blockedApps: string[];
  isAppBlockerActive: boolean;
  favorites: string[]; // question IDs
  favoriteExams: string[]; // exam IDs
  history: QuestionHistory[];
  exams: ExamDetail[];
  routine: StudyRoutine | null;
  achievements: Achievement[];
  mindMaps: MindMap[];
  leaderboard: LeaderboardEntry[];
  
  // Actions
  setName: (name: string) => void;
  addXP: (amount: number) => void;
  addSession: (session: StudySession) => void;
  addFlashcard: (card: Flashcard) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  addDeck: (deck: Deck) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, content: string) => void;
  checkStreak: () => void;
  addChatMessage: (msg: Message) => void;
  clearChat: () => void;
  toggleAppBlocker: (active: boolean) => void;
  setBlockedApps: (apps: string[]) => void;
  toggleFavorite: (questionId: string) => void;
  toggleFavoriteExam: (examId: string) => void;
  addToHistory: (entry: QuestionHistory) => void;
  setRoutine: (routine: StudyRoutine) => void;
  unlockAchievement: (id: string) => void;
  addMindMap: (map: MindMap) => void;
  updateLeaderboard: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: 'Estudante',
      xp: 0,
      level: 1,
      streak: 0,
      league: 'Bronze',
      dailyXP: 0,
      lastStudyDate: null,
      dailyGoalMinutes: 120,
      sessions: [],
      decks: [
        { id: '1', name: 'Biologia Celular', subject: 'Biologia', cardCount: 12, newCards: 5, reviewCards: 7 },
        { id: '2', name: 'Mecânica', subject: 'Física', cardCount: 8, newCards: 2, reviewCards: 6 },
      ],
      flashcards: [],
      notes: [],
      chatHistory: [],
      blockedApps: ['Instagram', 'TikTok', 'YouTube'],
      isAppBlockerActive: false,
      favorites: [],
      favoriteExams: [],
      history: [],
      exams: [
        // Vestibulares 2026 (Lista Completa)
        { id: "enem_2026", nome: "ENEM 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Matemática","Português","Humanas","Natureza"], nivel: "Médio", descricao: "Exame Nacional do Ensino Médio" },
        { id: "fuvest_2026", nome: "Fuvest 2026", tipo: "vestibular", data: "2026-11-22", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular da USP" },
        { id: "unicamp_2026", nome: "Unicamp 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular da Unicamp" },
        { id: "unesp_2026", nome: "UNESP 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular da Unesp" },
        { id: "ita_2026", nome: "ITA 2026", tipo: "vestibular", data: "2026-10-10", diasRestantes: 0, materias: ["Matemática", "Física", "Química"], nivel: "Muito Difícil", descricao: "Vestibular do ITA" },
        { id: "ime_2026", nome: "IME 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Matemática", "Física", "Química"], nivel: "Muito Difícil", descricao: "Vestibular do IME" },
        { id: "ufrj", nome: "UFRJ 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFRJ" },
        { id: "ufmg", nome: "UFMG 2026", tipo: "vestibular", data: "2026-11-01", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFMG" },
        { id: "ufpr", nome: "UFPR 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFPR" },
        { id: "ufsc", nome: "UFSC 2026", tipo: "vestibular", data: "2026-10-30", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFSC" },
        { id: "puc_sp", nome: "PUC-SP 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular PUC-SP" },
        { id: "fgv", nome: "FGV 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular FGV" },
        { id: "insper", nome: "Insper 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular Insper" },
        { id: "ufrgs_2026", nome: "UFRGS 2026", tipo: "vestibular", data: "2026-11-01", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFRGS" },
        { id: "ufba_2026", nome: "UFBA 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFBA" },
        { id: "ufpe_2026", nome: "UFPE 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFPE" },
        { id: "ufrn_2026", nome: "UFRN 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFRN" },
        { id: "ufal_2026", nome: "UFAL 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFAL" },
        { id: "ufpi_2026", nome: "UFPI 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFPI" },
        { id: "ufpa_2026", nome: "UFPA 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFPA" },
        { id: "ufam_2026", nome: "UFAM 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFAM" },
        { id: "unb_2026", nome: "UnB 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular da UnB" },
        { id: "ufg_2026", nome: "UFG 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFG" },
        { id: "ufmt_2026", nome: "UFMT 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFMT" },
        { id: "ufms_2026", nome: "UFMS 2026", tipo: "vestibular", data: "2026-10-25", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UFMS" },
        { id: "uece_2026", nome: "UECE 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UECE" },
        { id: "uema_2026", nome: "UEMA 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UEMA" },
        { id: "upe_2026", nome: "UPE 2026", tipo: "vestibular", data: "2026-11-15", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular UPE" },
        { id: "puc_rj_2026", nome: "PUC-RJ 2026", tipo: "vestibular", data: "2026-10-20", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular PUC-RJ" },
        { id: "espm_2026", nome: "ESPM 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular ESPM" },
        { id: "faap_2026", nome: "FAAP 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Médio", descricao: "Vestibular FAAP" },
        { id: "einstein_2026", nome: "Albert Einstein 2026", tipo: "vestibular", data: "2026-10-18", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular Medicina Einstein" },

        // Concursos Públicos 2026
        { id: "policia_federal", nome: "Polícia Federal", tipo: "concurso", data: "2026-06-19", diasRestantes: 0, materias: ["Direito","Informática","Raciocínio Lógico"], nivel: "Difícil", descricao: "Concurso Agente PF" },
        { id: "prf", nome: "PRF", tipo: "concurso", data: "2026-08-10", diasRestantes: 0, materias: ["Legislação de Trânsito", "Direito"], nivel: "Difícil", descricao: "Concurso Policial Rodoviário Federal" },
        { id: "inss", nome: "INSS", tipo: "concurso", data: "2026-09-15", diasRestantes: 0, materias: ["Seguridade Social", "Direito"], nivel: "Médio", descricao: "Concurso Técnico do Seguro Social" },
        { id: "banco_brasil", nome: "Banco do Brasil", tipo: "concurso", data: "2026-07-20", diasRestantes: 0, materias: ["Conhecimentos Bancários"], nivel: "Médio", descricao: "Concurso Escriturário BB" },
        { id: "caixa", nome: "Caixa Econômica", tipo: "concurso", data: "2026-08-30", diasRestantes: 0, materias: ["Conhecimentos Bancários"], nivel: "Médio", descricao: "Concurso Técnico Bancário Caixa" },
        { id: "petrobras", nome: "Petrobras", tipo: "concurso", data: "2026-05-20", diasRestantes: 0, materias: ["Conhecimentos Técnicos"], nivel: "Médio", descricao: "Concurso Petrobras" },
        { id: "petroreconcavo", nome: "PetroRecôncavo", tipo: "concurso", data: "2026-07-10", diasRestantes: 0, materias: ["Conhecimentos Técnicos"], nivel: "Médio", descricao: "Concurso PetroRecôncavo" },
        { id: "correios", nome: "Correios", tipo: "concurso", data: "2026-09-05", diasRestantes: 0, materias: ["Português", "Matemática"], nivel: "Fácil", descricao: "Concurso Agente de Correios" },
        { id: "receita", nome: "Receita Federal", tipo: "concurso", data: "2026-10-15", diasRestantes: 0, materias: ["Direito Tributário"], nivel: "Difícil", descricao: "Concurso Auditor Fiscal" },
        { id: "ibge", nome: "IBGE", tipo: "concurso", data: "2026-06-01", diasRestantes: 0, materias: ["Geografia", "Matemática"], nivel: "Fácil", descricao: "Concurso Recenseador IBGE" },
      ],
      routine: null,
      achievements: [
        { id: '1', title: 'Primeiro Passo', description: 'Completou sua primeira sessão de foco', icon: '🎯', unlocked: false },
        { id: '2', title: 'Fogo nos Estudos', description: 'Manteve um streak de 7 dias', icon: '🔥', unlocked: false },
        { id: '100q', title: 'Centurião', description: 'Resolveu 100 questões', icon: '💯', unlocked: false, progress: 0, maxProgress: 100 },
        { id: '1000q', title: 'Mestre das Questões', description: 'Resolveu 1000 questões', icon: '👑', unlocked: false, progress: 0, maxProgress: 1000 },
        { id: 'enem', title: 'Foco no ENEM', description: 'Resolveu 50 questões do ENEM', icon: '📝', unlocked: false, progress: 0, maxProgress: 50 },
      ],
      mindMaps: [],
      leaderboard: [
        { id: '1', name: 'João Silva', solved: 12500, correct: 11200, streak: 45, level: 50, xp: 125000 },
        { id: '2', name: 'Maria Santos', solved: 11300, correct: 10100, streak: 32, level: 48, xp: 113000 },
        { id: '3', name: 'Pedro Oliveira', solved: 10900, correct: 9800, streak: 28, level: 45, xp: 109000 },
        { id: '4', name: 'Ana Costa', solved: 9500, correct: 8500, streak: 20, level: 40, xp: 95000 },
        { id: '5', name: 'Lucas Pereira', solved: 8200, correct: 7300, streak: 15, level: 35, xp: 82000 },
      ],

      setName: (name) => set({ name }),
      
      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const newDailyXP = state.dailyXP + amount;
        const newLevel = Math.min(100, Math.floor(newXP / 1000) + 1);
        
        let newLeague = state.league;
        if (newXP >= 10000) newLeague = 'Diamante';
        else if (newXP >= 5000) newLeague = 'Ouro';
        else if (newXP >= 2000) newLeague = 'Prata';

        set({ xp: newXP, level: newLevel, dailyXP: newDailyXP, league: newLeague });
        get().updateLeaderboard();
      },

      addSession: (session) => {
        const { sessions, lastStudyDate, streak } = get();
        const today = new Date().toISOString().split('T')[0];
        
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
        flashcards: [card, ...state.flashcards] 
      })),

      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f)
      })),

      addDeck: (deck) => set((state) => ({
        decks: [deck, ...state.decks]
      })),

      addNote: (note) => set((state) => ({ 
        notes: [note, ...state.notes] 
      })),

      updateNote: (id, content) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)
      })),

      checkStreak: () => {
        const { lastStudyDate, streak } = get();
        if (!lastStudyDate) return;
        
        const lastDate = new Date(lastStudyDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          set({ streak: 0 });
        }
      },

      addChatMessage: (msg) => set((state) => ({
        chatHistory: [...state.chatHistory, msg]
      })),

      clearChat: () => set({ chatHistory: [] }),

      toggleAppBlocker: (active) => set({ isAppBlockerActive: active }),

      setBlockedApps: (apps) => set({ blockedApps: apps }),

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fid => fid !== id)
          : [...state.favorites, id]
      })),

      toggleFavoriteExam: (id) => set((state) => ({
        favoriteExams: state.favoriteExams.includes(id)
          ? state.favoriteExams.filter(fid => fid !== id)
          : [...state.favoriteExams, id]
      })),

      addToHistory: (entry) => {
        set((state) => {
          const newHistory = [entry, ...state.history];
          const totalSolved = newHistory.length;
          
          const achievements = [...state.achievements];
          const updateAchievement = (id: string, progress: number, max: number) => {
            const idx = achievements.findIndex(a => a.id === id);
            if (idx !== -1 && !achievements[idx].unlocked) {
              achievements[idx].progress = progress;
              if (progress >= max) achievements[idx].unlocked = true;
            }
          };

          updateAchievement('100q', totalSolved, 100);
          updateAchievement('1000q', totalSolved, 1000);

          return { history: newHistory, achievements };
        });
        get().updateLeaderboard();
      },

      setRoutine: (routine) => set({ routine }),

      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
      })),

      addMindMap: (map) => set((state) => ({
        mindMaps: [map, ...state.mindMaps]
      })),

      updateLeaderboard: () => {
        const { name, history, streak, level, xp, leaderboard } = get();
        const solved = history.length;
        const correct = history.filter(h => h.isCorrect).length;
        
        const userEntry: LeaderboardEntry = {
          id: 'me',
          name: name || 'Você',
          solved,
          correct,
          streak,
          level,
          xp
        };

        const filteredLeaderboard = leaderboard.filter(e => e.id !== 'me');
        const newLeaderboard = [...filteredLeaderboard, userEntry].sort((a, b) => b.xp - a.xp);
        
        set({ leaderboard: newLeaderboard });
      },
    }),
    {
      name: 'studyflow-storage-v7',
    }
  )
);
