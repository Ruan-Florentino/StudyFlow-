import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeJsonStorage } from '../lib/safeJsonStorage';
import type { Question } from '../data/types';

export interface SimuladoConfig {
  timed: boolean;
  durationMinutes: number;
  showGabaritoDuring: boolean;
  allowSkip: boolean;
  shuffle: boolean;
  pauseOnBlur: boolean;
  antiCheat: boolean;
}

export const DEFAULT_SIMULADO_CONFIG: SimuladoConfig = {
  timed: false,
  durationMinutes: 50,
  showGabaritoDuring: false,
  allowSkip: true,
  shuffle: true,
  pauseOnBlur: false,
  antiCheat: false,
};

export interface SimuladoSessionState {
  examId: string | null;
  questions: Question[];
  answers: Record<number, number>;
  currentIndex: number;
  markedForReview: Record<number, boolean>;
  config: SimuladoConfig;
  strategicMentorNote: string | null;
  startedAt: number | null;
  /** Epoch ms quando timer foi pausado (blur), para ajustar remaining ao voltar */
  timerPausedAt: number | null;
  remainingSeconds: number | null;

  setExamId: (id: string | null) => void;
  setQuestions: (q: Question[]) => void;
  setAnswer: (index: number, option: number) => void;
  setCurrentIndex: (i: number) => void;
  toggleMarkReview: (index: number) => void;
  setConfig: (partial: Partial<SimuladoConfig>) => void;
  setStrategicNote: (note: string | null) => void;
  setStartedAt: (t: number | null) => void;
  setTimerPausedAt: (t: number | null) => void;
  setRemainingSeconds: (n: number | null) => void;
  /** Limpa respostas e marcadores antes de um novo runner (mantém examId/config se já setados). */
  prepareNewRun: () => void;
  reset: () => void;
}

const initial: Omit<
  SimuladoSessionState,
  | 'setExamId'
  | 'setQuestions'
  | 'setAnswer'
  | 'setCurrentIndex'
  | 'toggleMarkReview'
  | 'setConfig'
  | 'setStrategicNote'
  | 'setStartedAt'
  | 'setTimerPausedAt'
  | 'setRemainingSeconds'
  | 'prepareNewRun'
  | 'reset'
> = {
  examId: null,
  questions: [],
  answers: {},
  currentIndex: 0,
  markedForReview: {},
  config: { ...DEFAULT_SIMULADO_CONFIG },
  strategicMentorNote: null,
  startedAt: null,
  timerPausedAt: null,
  remainingSeconds: null,
};

export const useSimuladoSessionStore = create<SimuladoSessionState>()(
  persist(
    (set, get) => ({
      ...initial,

      setExamId: (examId) => set({ examId }),
      setQuestions: (questions) => set({ questions }),
      setAnswer: (index, option) =>
        set((s) => ({
          answers: { ...s.answers, [index]: option },
        })),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      toggleMarkReview: (index) =>
        set((s) => ({
          markedForReview: {
            ...s.markedForReview,
            [index]: !s.markedForReview[index],
          },
        })),
      setConfig: (partial) =>
        set((s) => ({
          config: { ...s.config, ...partial },
        })),
      setStrategicNote: (strategicMentorNote) => set({ strategicMentorNote }),
      setStartedAt: (startedAt) => set({ startedAt }),
      setTimerPausedAt: (timerPausedAt) => set({ timerPausedAt }),
      setRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),
      prepareNewRun: () =>
        set({
          answers: {},
          markedForReview: {},
          currentIndex: 0,
          startedAt: null,
          timerPausedAt: null,
          remainingSeconds: null,
        }),
      reset: () => set({ ...initial, config: { ...DEFAULT_SIMULADO_CONFIG } }),
    }),
    { name: 'studyflow-simulado-session', version: 1, storage: safeJsonStorage }
  )
);
