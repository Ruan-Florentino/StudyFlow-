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
  easeFactor?: number; // SM-2 ease factor
  repetitions?: number; // SM-2 consecutive correct answers
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
  id?: string;
  target: string;
  weeklyHours: number;
  schedule: {
    day: string;
    blocks: {
      subject: string;
      duration: number;
      type: 'theory' | 'practice' | 'review';
    }[];
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
  type?: 'text' | 'plan' | 'questions' | 'flashcards' | 'image' | 'audio' | 'music' | 'slides';
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
  accuracyRate?: number;
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

export interface EssayTopic {
  id: string;
  title: string;
}

export interface Essay {
  id: string;
  topicId: string;
  topicTitle: string;
  content: string;
  date: string;
  score?: number;
  feedback?: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    grammarErrors: string[];
    coherence: string;
    argumentation: string;
    conclusion: string;
    suggestions: string[];
  };
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
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

interface UserState {
  name: string;
  bio: string;
  profilePic: string;
  coverPic: string;
  themeColor: string;
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
  reviewLater: string[]; // question IDs
  favoriteExams: string[]; // exam IDs
  history: QuestionHistory[];
  exams: ExamDetail[];
  routine: StudyRoutine | null;
  achievements: Achievement[];
  mindMaps: MindMap[];
  leaderboard: LeaderboardEntry[];
  essays: Essay[];
  savedTopics: string[];
  showOnlyReviewLater?: boolean;
  hasCompletedOnboarding: boolean;
  dailyChallenge: Question | null;
  userId: string | null;
  isAuthReady: boolean;
  levelUpData: { oldLevel: number, newLevel: number } | null;
  smartRecommendation: { title: string; description: string; icon: string; actionTab: string; priority: string } | null;
  mastery: Record<string, number>;
  voiceEnabled: boolean;
  learningPaths: Record<string, { subject: string, milestones: any[] }>;
  currentBossBattle: { subject: string, questions: any[], score: number, isActive: boolean } | null;
  studyRooms: {
    activeRoom: string | null;
    rooms: Array<{ id: string; name: string; vibe: string; users: number; icon: string; youtubeId?: string }>;
    globalPulse: number;
    audioVolume: number;
    audioPlaying: boolean;
  };
  essayCoPilot: {
    enabled: boolean;
    suggestions: Array<{ id: string; text: string; type: 'style' | 'grammar' | 'idea' }>;
    analysis: { structure: number; clarity: number; vocabulary: number } | null;
  };
  memoryRooms: Array<{ id: string; name: string; items: Array<{ id: string; concept: string; association: string }> }>;
  neuralSync: number;
  prestigeLevel: number;
  
  // Premium System & Limits
  plan: 'free' | 'premium';
  flashcardsAddedToday: number;
  lastFlashcardAddedDate: string | null;
  aiTutorQueriesToday: number;
  lastAiTutorQueryDate: string | null;
  essaysThisWeek: number;
  lastEssayDate: string | null;
  streakProtectorActive: boolean;
  dailyFlashcardsUsed: number;
  dailyFlashcardsDate: string | null;
  featureUsage: Record<string, number>;

  // Onboarding Data
  onboardingData: {
    objetivo: string;
    horas: string;
    dificuldades: string[];
    objetivoFinalText: string;
    objetivoFinalDate: string;
  } | null;
  
  // Actions
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (pic: string) => void;
  setCoverPic: (pic: string) => void;
  setThemeColor: (color: string) => void;
  setUserId: (userId: string | null) => void;
  setAuthReady: (isAuthReady: boolean) => void;
  completeOnboarding: () => void;
  clearLevelUp: () => void;
  setSmartRecommendation: (rec: any) => void;
  updateMastery: (subject: string, score: number) => void;
  toggleVoice: () => void;
  prestige: () => void;
  setDailyChallenge: (q: Question | null) => void;
  setLearningPath: (subject: string, path: any) => void;
  completeMilestone: (subject: string, milestoneId: string) => void;
  startBossBattle: (subject: string, questions: any[]) => void;
  endBossBattle: (score: number) => void;
  addXP: (amount: number) => void;
  addSession: (session: StudySession) => void;
  addFlashcard: (card: Flashcard) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  addDeck: (deck: Deck) => void;
  deleteDeck: (id: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, content: string) => void;
  checkStreak: () => void;
  addChatMessage: (msg: Message) => void;
  clearChat: () => void;
  toggleAppBlocker: (active: boolean) => void;
  setBlockedApps: (apps: string[]) => void;
  toggleFavorite: (questionId: string) => void;
  toggleReviewLater: (questionId: string) => void;
  toggleFavoriteExam: (examId: string) => void;
  addToHistory: (entry: QuestionHistory) => void;
  setRoutine: (routine: StudyRoutine) => void;
  unlockAchievement: (id: string) => void;
  addMindMap: (map: MindMap) => void;
  updateLeaderboard: () => void;
  addEssay: (essay: Essay) => void;
  updateEssay: (id: string, updates: Partial<Essay>) => void;
  toggleSavedTopic: (topicId: string) => void;
  
  // Study Rooms
  joinRoom: (roomId: string | null) => void;
  updateGlobalPulse: () => void;
  setAudioVolume: (volume: number) => void;
  setAudioPlaying: (playing: boolean) => void;
  
  // Essay Co-pilot
  toggleEssayCoPilot: () => void;
  setEssayAnalysis: (analysis: any) => void;
  addEssaySuggestion: (suggestion: any) => void;
  clearEssaySuggestions: () => void;
  
  // Memory Palace & Neural Sync
  addMemoryRoom: (room: { id: string; name: string; items: Array<{ id: string; concept: string; association: string }> }) => void;
  addMemoryItem: (roomId: string, item: { id: string; concept: string; association: string }) => void;
  updateNeuralSync: (val: number) => void;
  
  // Premium & Limits Actions
  setPlan: (plan: 'free' | 'premium') => void;
  incrementFlashcardsAdded: () => void;
  incrementAiTutorQueries: () => void;
  incrementEssaysThisWeek: () => void;
  setStreakProtector: (active: boolean) => void;
  incrementFlashcardUsage: () => void;
  trackFeature: (feature: string) => void;
  
  // Onboarding Actions
  setOnboardingData: (data: any) => void;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: 'Estudante',
      bio: 'Focado na aprovação! 🚀',
      profilePic: '',
      coverPic: '',
      themeColor: '#10B981',
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
      reviewLater: [],
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
      essays: [],
      savedTopics: [],
      hasCompletedOnboarding: false,
      dailyChallenge: null,
      userId: null,
      isAuthReady: false,
      levelUpData: null,
      smartRecommendation: null,
      mastery: {
        'Matemática': 0,
        'Português': 0,
        'Física': 0,
        'Química': 0,
        'Biologia': 0,
        'História': 0,
        'Geografia': 0,
        'Filosofia': 0,
        'Sociologia': 0,
        'Inglês': 0
      },
      voiceEnabled: false,
      learningPaths: {},
      currentBossBattle: null,
      studyRooms: {
        activeRoom: null,
        rooms: [
          { id: 'library', name: 'Biblioteca Central', vibe: 'Lofi & Chuva', users: 1242, icon: 'Library', youtubeId: '5qap5aO4i9A' },
          { id: 'cafe', name: 'Cyberpunk Café', vibe: 'Synthwave & Neon', users: 856, icon: 'Coffee', youtubeId: 'W1B5Z9A2bEQ' },
          { id: 'forest', name: 'Cabana na Floresta', vibe: 'Natureza & Calma', users: 432, icon: 'Trees', youtubeId: 'xNN7iTA57jM' },
          { id: 'space', name: 'Estação Espacial', vibe: 'Ambiente & Estrelas', users: 215, icon: 'Rocket', youtubeId: 'qHBFvwjcJkY' },
          { id: 'rock', name: 'Rock Clássico', vibe: 'Energia & Foco', users: 340, icon: 'Zap', youtubeId: 'kXYiU_JCYtU' },
          { id: 'rain', name: 'Som de Chuva', vibe: 'Chuva Forte', users: 512, icon: 'CloudRain', youtubeId: 'mPZkdNFkNps' },
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
      plan: 'free',
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
        { id: '1', name: 'Gabriele Sa', solved: 12500, correct: 11200, streak: 45, level: 50, xp: 125000, medals: { gold: 12, silver: 5, bronze: 2 } },
        { id: '2', name: 'Maria Santos', solved: 11300, correct: 10100, streak: 32, level: 48, xp: 113000, medals: { gold: 8, silver: 10, bronze: 4 } },
        { id: '3', name: 'Pedro Oliveira', solved: 10900, correct: 9800, streak: 28, level: 45, xp: 109000, medals: { gold: 5, silver: 8, bronze: 12 } },
        { id: '4', name: 'Ana Costa', solved: 9500, correct: 8500, streak: 20, level: 40, xp: 95000, medals: { gold: 3, silver: 6, bronze: 8 } },
        { id: '5', name: 'Lucas Pereira', solved: 8200, correct: 7300, streak: 15, level: 35, xp: 82000, medals: { gold: 1, silver: 4, bronze: 15 } },
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
        achievements: state.achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
        neuralSync: 0
      })),

      clearLevelUp: () => set({ levelUpData: null }),

      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const newDailyXP = state.dailyXP + amount;
        const oldLevel = state.level;
        const newLevel = Math.min(100, Math.floor(newXP / 1000) + 1);
        
        let newLeague = state.league;
        if (newXP >= 10000) newLeague = 'Diamante';
        else if (newXP >= 5000) newLeague = 'Ouro';
        else if (newXP >= 2000) newLeague = 'Prata';

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
        flashcards: [{ ...card, easeFactor: 2.5, repetitions: 0 }, ...state.flashcards] 
      })),

      deleteFlashcard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(f => f.id !== id)
      })),

      updateFlashcard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(f => f.id === id ? { ...f, ...updates } : f)
      })),

      reviewFlashcard: (id, rating) => set((state) => {
        const flashcards = state.flashcards.map(f => {
          if (f.id !== id) return f;

          let { easeFactor = 2.5, repetitions = 0, interval = 0 } = f;
          
          if (rating === 'again') {
            repetitions = 0;
            interval = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
          } else if (rating === 'hard') {
            repetitions = Math.max(1, repetitions);
            interval = Math.max(1, interval * 1.2);
            easeFactor = Math.max(1.3, easeFactor - 0.15);
          } else if (rating === 'good') {
            repetitions += 1;
            interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : interval * easeFactor;
          } else if (rating === 'easy') {
            repetitions += 1;
            interval = repetitions === 1 ? 4 : interval * easeFactor * 1.3;
            easeFactor += 0.15;
          }

          // Round interval to nearest day
          interval = Math.round(interval);
          
          // Calculate next review date
          const nextReviewDate = new Date();
          nextReviewDate.setDate(nextReviewDate.getDate() + interval);

          // Determine level based on interval
          let level: Flashcard['level'] = 'Novo';
          if (interval > 21) level = 'Dominado';
          else if (interval > 7) level = 'Revisando';
          else if (interval > 0) level = 'Aprendendo';

          return {
            ...f,
            easeFactor,
            repetitions,
            interval,
            level,
            nextReview: nextReviewDate.toISOString(),
            lastReviewed: new Date().toISOString()
          };
        });

        return { flashcards };
      }),

      addDeck: (deck) => set((state) => ({
        decks: [deck, ...state.decks]
      })),

      deleteDeck: (id) => set((state) => ({
        decks: state.decks.filter(d => d.id !== id),
        flashcards: state.flashcards.filter(f => f.deckId !== id)
      })),

      addNote: (note) => set((state) => ({ 
        notes: [note, ...state.notes] 
      })),

      updateNote: (id, content) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)
      })),

      checkStreak: () => {
        const { lastStudyDate, streak, streakProtectorActive } = get();
        if (!lastStudyDate) return;
        
        const lastDate = new Date(lastStudyDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          if (streakProtectorActive) {
            set({ streakProtectorActive: false, lastStudyDate: today.toISOString().split('T')[0] });
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
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fid => fid !== id)
          : [...state.favorites, id]
      })),

      toggleReviewLater: (id) => set((state) => ({
        reviewLater: state.reviewLater.includes(id)
          ? state.reviewLater.filter(fid => fid !== id)
          : [...state.reviewLater, id]
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
          xp,
          medals: {
            gold: Math.floor(level / 10),
            silver: Math.floor(level / 5),
            bronze: Math.floor(level / 2)
          }
        };

        const filteredLeaderboard = leaderboard.filter(e => e.id !== 'me');
        const newLeaderboard = [...filteredLeaderboard, userEntry].sort((a, b) => b.xp - a.xp);
        
        set({ leaderboard: newLeaderboard });
      },

      addEssay: (essay) => set((state) => ({ essays: [essay, ...state.essays] })),
      updateEssay: (id, updates) => set((state) => ({
        essays: state.essays.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      toggleSavedTopic: (id) => set((state) => ({
        savedTopics: state.savedTopics.includes(id)
          ? state.savedTopics.filter(t => t !== id)
          : [...state.savedTopics, id]
      })),
      setUserId: (userId) => set({ userId }),
      setAuthReady: (isAuthReady) => set({ isAuthReady }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setDailyChallenge: (dailyChallenge) => set({ dailyChallenge }),
      setSmartRecommendation: (smartRecommendation) => set({ smartRecommendation }),
      updateMastery: (subject, score) => set((state) => {
        const currentMastery = state.mastery[subject] || 0;
        const newMastery = Math.min(100, Math.max(0, (currentMastery * 0.7) + (score * 0.3)));
        return { mastery: { ...state.mastery, [subject]: newMastery } };
      }),
      toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      setLearningPath: (subject, path) => set((state) => ({
        learningPaths: { ...state.learningPaths, [subject]: path }
      })),
      completeMilestone: (subject, milestoneId) => set((state) => {
        const path = state.learningPaths[subject];
        if (!path) return state;
        const newMilestones = path.milestones.map(m => 
          m.id === milestoneId ? { ...m, isCompleted: true } : m
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
        const masteryBonus = score * 2; // Boss battle gives more mastery
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
        memoryRooms: state.memoryRooms.map(r => r.id === roomId ? { ...r, items: [...r.items, item] } : r)
      })),
      
      updateNeuralSync: (val) => set({ neuralSync: val }),

      setPlan: (plan) => set({ plan }),
      
      incrementFlashcardsAdded: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          flashcardsAddedToday: state.lastFlashcardAddedDate === today ? state.flashcardsAddedToday + 1 : 1,
          lastFlashcardAddedDate: today
        }));
      },
      
      incrementAiTutorQueries: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          aiTutorQueriesToday: state.lastAiTutorQueryDate === today ? state.aiTutorQueriesToday + 1 : 1,
          lastAiTutorQueryDate: today
        }));
      },
      
      incrementEssaysThisWeek: () => {
        const today = new Date();
        set((state) => {
          let count = state.essaysThisWeek;
          const last = state.lastEssayDate ? new Date(state.lastEssayDate) : null;
          
          if (!last) {
            count = 1;
          } else {
            // Check if same week
            const diffTime = Math.abs(today.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        const today = new Date().toISOString().split('T')[0];
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
      
      setOnboardingData: (data) => set({ onboardingData: data }),
    }),
    {
      name: 'studyflow-storage-v10',
    }
  )
);

export const usePlan = () => {
  const store = useStore();
  const isPremium = store.plan === 'premium';
  
  const checkLimit = (feature: 'flashcards' | 'aiTutor' | 'essay' | 'exams' | 'streakProtector') => {
    if (isPremium) return true;
    
    const today = new Date().toISOString().split('T')[0];
    
    switch(feature) {
      case 'flashcards':
        // Max 10 per day
        return store.dailyFlashcardsUsed < 10;
      case 'aiTutor':
        // Max 3 queries per day
        return store.lastAiTutorQueryDate !== today || store.aiTutorQueriesToday < 3;
      case 'essay':
        // Max 1 per week (approximate check, relies on increment logic)
        return store.essaysThisWeek < 1;
      case 'exams':
        // Premium only
        return false;
      case 'streakProtector':
        // Premium only
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
