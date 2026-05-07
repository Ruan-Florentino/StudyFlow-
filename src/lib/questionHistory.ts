import type { QuestionHistory } from '../store/types';

export type QuestionLearningStatus =
  | 'new'
  | 'seen'
  | 'correct'
  | 'wrong'
  | 'recovered'
  | 'review';

export type QuestionHistorySummary = {
  status: QuestionLearningStatus;
  lastAttempt: Date | null;
  totalAttempts: number;
  correctAttempts: number;
  wrongAttempts: number;
};

/**
 * Agrega tentativas + “vista sem responder” para badge e filtros.
 */
export function computeQuestionHistorySummary(
  questionId: string,
  history: QuestionHistory[],
  viewedAtByQuestionId: Record<string, string>
): QuestionHistorySummary {
  const entries = history
    .filter((h) => h.questionId === questionId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  const totalAttempts = entries.length;
  const correctAttempts = entries.filter((e) => e.isCorrect).length;
  const wrongAttempts = entries.filter((e) => !e.isCorrect).length;

  if (totalAttempts === 0) {
    const viewedAt = viewedAtByQuestionId[questionId];
    if (viewedAt) {
      return {
        status: 'seen',
        lastAttempt: null,
        totalAttempts: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
      };
    }
    return {
      status: 'new',
      lastAttempt: null,
      totalAttempts: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
    };
  }

  const latest = entries[entries.length - 1]!;
  const lastAttempt = new Date(latest.timestamp);

  if (wrongAttempts >= 3) {
    return {
      status: 'review',
      lastAttempt,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
    };
  }

  const hadWrong = wrongAttempts > 0;
  if (latest.isCorrect && hadWrong) {
    return {
      status: 'recovered',
      lastAttempt,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
    };
  }
  if (latest.isCorrect) {
    return {
      status: 'correct',
      lastAttempt,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
    };
  }
  return {
    status: 'wrong',
    lastAttempt,
    totalAttempts,
    correctAttempts,
    wrongAttempts,
  };
}

/** Texto curto tipo “há 3 dias” para badges (pt-BR). */
export function formatRelativeDaysPt(date: Date): string {
  const now = new Date();
  const t0 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const t1 = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  const diffDays = Math.round((t0 - t1) / 86400000);
  if (diffDays <= 0) return 'hoje';
  if (diffDays === 1) return 'há 1 dia';
  if (diffDays < 30) return `há ${diffDays} dias`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return 'há 1 mês';
  return `há ${months} meses`;
}
