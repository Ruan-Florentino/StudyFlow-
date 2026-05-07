/**
 * Zera fatias client-side ligadas ao usuário ao sair da sessão ou quando não há sessão.
 * Evita nome/flashcards/notas/importações/trilhas/simulado de uma conta aparecerem antes do sync da próxima.
 * Zera `isAuthReady` aqui; o `SupabaseProvider` volta a `true` após limpar (ou após novo sync).
 */

import { useUserStore } from '../../store/useUserStore';
import { useFlashcardStore } from '../../store/useFlashcardStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useExamStore } from '../../store/useExamStore';
import { useUIStore } from '../../store/useUIStore';
import { useImportedQuestionsStore } from '../../store/useImportedQuestionsStore';
import { useAITrailsStore } from '../../store/useAITrailsStore';
import { useSimuladoSessionStore } from '../../store/useSimuladoSessionStore';

export function clearClientStoresForSignOut(): void {
  useUserStore.setState({
    isAuthReady: false,
    name: 'Estudante',
    bio: 'Focado na aprovação! 🚀',
    profilePic: '',
    coverPic: '',
    userId: null,
    accessRole: 'free',
    billingPlan: 'free',
    profileCreatedAtMs: null,
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    league: 'Bronze',
    dailyXP: 0,
    lastStudyDate: null,
    dailyGoalMinutes: 120,
    coins: 0,
    prestigeLevel: 0,
    mastery: {},
    achievements: [],
    leaderboard: [],
    levelUpData: null,
  });

  useFlashcardStore.setState({ decks: [], flashcards: [] });
  useSessionStore.setState({ sessions: [], notes: [], chatHistory: [] });
  useExamStore.setState({ history: [] });
  useUIStore.getState().setPlan('free');

  useImportedQuestionsStore.getState().clearImportedQuestions();
  useAITrailsStore.getState().clearAiTrails();
  useSimuladoSessionStore.getState().reset();
}
