import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamDetail, Question, QuestionHistory } from './types';

export interface ExamStore {
  favorites: string[];
  reviewLater: string[];
  favoriteExams: string[];
  exams: ExamDetail[];
  dailyChallenge: Question | null;
  smartRecommendation: any | null;
  learningPaths: Record<string, { subject: string, milestones: any[] }>;
  currentBossBattle: { subject: string, questions: any[], score: number, isActive: boolean } | null;
  history: QuestionHistory[];
  showOnlyReviewLater: boolean;

  toggleFavorite: (id: string) => void;
  toggleReviewLater: (id: string) => void;
  toggleFavoriteExam: (id: string) => void;
  setDailyChallenge: (q: Question | null) => void;
  setSmartRecommendation: (rec: any) => void;
  setLearningPath: (subject: string, path: any) => void;
  completeMilestone: (subject: string, milestoneId: string) => void;
  startBossBattle: (subject: string, questions?: any[]) => void;
  endBossBattle: (finalScore?: number) => void;
  addToHistory: (entry: QuestionHistory) => void;
  setShowOnlyReviewLater: (val: boolean) => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      // ... (keeping previous state)
      favorites: [],
      reviewLater: [],
      favoriteExams: [],
      exams: [
        { id: "enem_2026", nome: "ENEM 2026", tipo: "vestibular", data: "2026-11-08", diasRestantes: 0, materias: ["Matemática","Português","Humanas","Natureza"], nivel: "Médio", descricao: "Exame Nacional do Ensino Médio" },
        { id: "fuvest_2026", nome: "Fuvest 2026", tipo: "vestibular", data: "2026-11-22", diasRestantes: 0, materias: ["Geral"], nivel: "Difícil", descricao: "Vestibular da USP" },
        { id: "ita_2026", nome: "ITA 2026", tipo: "vestibular", data: "2026-10-10", diasRestantes: 0, materias: ["Matemática", "Física", "Química"], nivel: "Muito Difícil", descricao: "Vestibular do ITA" },
        { id: "policia_federal", nome: "Polícia Federal", tipo: "concurso", data: "2026-06-19", diasRestantes: 0, materias: ["Direito","Informática","Raciocínio Lógico"], nivel: "Difícil", descricao: "Concurso Agente PF" },
      ],
      dailyChallenge: null,
      smartRecommendation: null,
      learningPaths: {},
      currentBossBattle: null,
      history: [],
      showOnlyReviewLater: false,

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id) ? state.favorites.filter(fid => fid !== id) : [...state.favorites, id]
      })),
      toggleReviewLater: (id) => set((state) => ({
        reviewLater: state.reviewLater.includes(id) ? state.reviewLater.filter(fid => fid !== id) : [...state.reviewLater, id]
      })),
      toggleFavoriteExam: (id) => set((state) => ({
        favoriteExams: state.favoriteExams.includes(id) ? state.favoriteExams.filter(fid => fid !== id) : [...state.favoriteExams, id]
      })),
      setDailyChallenge: (dailyChallenge) => set({ dailyChallenge }),
      setSmartRecommendation: (smartRecommendation) => set({ smartRecommendation }),
      setLearningPath: (subject, path) => set((state) => ({
        learningPaths: { ...state.learningPaths, [subject]: path }
      })),
      completeMilestone: (subject, milestoneId) => set(state => {
        const path = state.learningPaths[subject];
        if (!path) return state;
        return {
          learningPaths: {
            ...state.learningPaths,
            [subject]: { ...path, milestones: path.milestones.map(m => m.id === milestoneId ? { ...m, completed: true } : m) }
          }
        };
      }),
      startBossBattle: (subject, questions = []) => set({ currentBossBattle: { subject, questions, score: 0, isActive: true } }),
      endBossBattle: () => set({ currentBossBattle: null }),
      addToHistory: (entry) => set(state => ({ history: [entry, ...state.history] })),
      setShowOnlyReviewLater: (showOnlyReviewLater) => set({ showOnlyReviewLater }),
    }),
    { name: 'studyflow-exams' }
  )
);
