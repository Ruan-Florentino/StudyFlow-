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