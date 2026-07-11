import { localBackend } from '../localBackend';
import { toast } from '../../store/useToastStore';
import { useExamStore } from '../../store/useExamStore';
import { useUserStore } from '../../store/useUserStore';
import { useSessionStore } from '../../store/useSessionStore';
import type { Question, QuestionHistory } from '../../store/types';

export type StudyActivityType =
  | 'questions'
  | 'flashcards'
  | 'mindmap'
  | 'reading'
  | 'focus'
  | 'other';

export type RecordQuestionAttemptParams = {
  userId: string | null | undefined;
  question: Pick<Question, 'id' | 'materia' | 'assunto' | 'prova'>;
  userAnswer: number;
  isCorrect: boolean;
  timeSpentSeconds?: number;
  /** XP local + remoto (0 = não altera XP nesta chamada) */
  xpAward?: number;
  /** Se true, não atualiza streak (ex.: lote; chame bumpStreakOnce depois) */
  skipStreak?: boolean;
  showToastOnError?: boolean;
};

function calendarDayUtc(isoDate: Date): string {
  return isoDate.toISOString().split('T')[0];
}

/** YYYY-MM-DD no fuso local (mesmo “dia de estudo” do usuário que o gráfico de perfil). */
export function calendarDayLocal(isoDate: Date): string {
  const y = isoDate.getFullYear();
  const m = String(isoDate.getMonth() + 1).padStart(2, '0');
  const day = String(isoDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * True se a sessão entra no bucket chartDayKey (YYYY-MM-DD no calendário local).
 * Aceita `date` gravado como dia local (novo) ou como dia UTC legado (toISOString().split).
 */
export function sessionMatchesLocalChartDay(storedDate: string, chartDayKey: string): boolean {
  if (!storedDate || !chartDayKey) return false;
  if (storedDate === chartDayKey) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(storedDate)) {
    return calendarDayLocal(new Date(storedDate)) === chartDayKey;
  }
  const [y, m, d] = storedDate.split('-').map(Number);
  const legacyUtcDay = calendarDayLocal(new Date(Date.UTC(y, m - 1, d)));
  return legacyUtcDay === chartDayKey;
}

function parseDay(d: string | null): string | null {
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return calendarDayUtc(new Date(d));
}

/**
 * Atualiza streak local e, se logado, espelha em public.users.
 */
export async function bumpStreakForActivity(
  userId: string | null | undefined,
  options?: { showToastOnError?: boolean }
): Promise<void> {
  const showToastOnError = options?.showToastOnError ?? true;
  const today = calendarDayUtc(new Date());
  const state = useUserStore.getState();
  const last = parseDay(state.lastStudyDate);
  let nextStreak = state.streak;
  if (!last) {
    nextStreak = Math.max(1, nextStreak || 1);
  } else if (last === today) {
    nextStreak = Math.max(1, state.streak || 1);
  } else {
    const lastTime = new Date(last + 'T12:00:00.000Z').getTime();
    const todayTime = new Date(today + 'T12:00:00.000Z').getTime();
    const diffDays = Math.round((todayTime - lastTime) / (86400 * 1000));
    if (diffDays === 1) {
      nextStreak = (state.streak || 0) + 1;
    } else if (diffDays > 1) {
      nextStreak = 1;
    } else {
      nextStreak = Math.max(1, state.streak || 1);
    }
  }

  const nextLongest = Math.max(state.longestStreak ?? 0, nextStreak);
  useUserStore.setState({
    streak: nextStreak,
    lastStudyDate: today,
    longestStreak: nextLongest,
  });

  if (!true || !userId) {
    console.log('[PERSIST] bumpStreak local', { today, nextStreak, nextLongest });
    return;
  }

  try {
    const { error } = await localBackend
      .from('users')
      .update({
        streak: nextStreak,
        last_study_date: today,
        longest_streak: nextLongest,
      })
      .eq('id', userId);
    if (error) throw error;
    console.log('[PERSIST] bumpStreak remote ok', { userId, nextStreak });
  } catch (e) {
    console.error('[PERSIST] bumpStreak remote failed', e);
    if (showToastOnError) {
      toast.error('Sincronização', 'Não foi possível atualizar seu streak no servidor.');
    }
  }
}

export async function addXpRemote(userId: string, amount: number): Promise<void> {
  if (!true || amount <= 0) return;
  try {
    const { data: userData, error: fetchError } = await localBackend
      .from('users')
      .select('xp, level')
      .eq('id', userId)
      .single();
    if (fetchError) throw fetchError;
    const currentXp = userData?.xp ?? 0;
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const { error: updateError } = await localBackend
      .from('users')
      .update({ xp: newXp, level: newLevel })
      .eq('id', userId);
    if (updateError) throw updateError;
    console.log('[PERSIST] addXpRemote ok', { amount, newXp });
  } catch (e) {
    console.error('[PERSIST] addXpRemote failed', e);
    toast.error('Sincronização', 'XP não foi salvo na nuvem. Continuamos no app.');
  }
}

export type RecordQuestionAttemptBatchItem = {
  question: Pick<Question, 'id' | 'materia' | 'assunto' | 'prova'>;
  userAnswer: number;
  isCorrect: boolean;
  timeSpentSeconds?: number;
};

/**
 * Grava várias tentativas em uma única chamada ao backend (simulados / provas).
 * Atualiza histórico local, mastery e XP uma vez no fim.
 */
export async function recordQuestionAttemptsBatch(
  userId: string | null | undefined,
  items: RecordQuestionAttemptBatchItem[],
  options?: {
    xpAwardTotal?: number;
    /** default false — chame bumpStreakForActivity depois se quiser um único bump */
    skipStreak?: boolean;
    showToastOnError?: boolean;
  }
): Promise<void> {
  if (items.length === 0) return;

  const ts = new Date().toISOString();
  const showToastOnError = options?.showToastOnError ?? true;
  const skipStreak = options?.skipStreak ?? false;
  const xpAwardTotal = options?.xpAwardTotal ?? 0;

  const examStore = useExamStore.getState();
  const userStore = useUserStore.getState();

  for (const it of items) {
    examStore.addToHistory({
      questionId: it.question.id,
      userAnswer: it.userAnswer,
      isCorrect: it.isCorrect,
      timestamp: ts,
      timeSpent: it.timeSpentSeconds ?? undefined,
    });
    userStore.updateMastery(it.question.materia, it.isCorrect ? 100 : 0);
  }

  if (xpAwardTotal > 0) {
    userStore.addXP(xpAwardTotal);
  }

  if (!skipStreak) {
    await bumpStreakForActivity(userId, { showToastOnError });
  }

  if (xpAwardTotal > 0 && userId) {
    await addXpRemote(userId, xpAwardTotal);
  }

  if (!true || !userId) {
    console.log('[PERSIST] recordQuestionAttemptsBatch local only', items.length);
    return;
  }

  try {
    const rows = items.map((it) => ({
      user_id: userId,
      question_id: it.question.id,
      answer_given: it.userAnswer,
      is_correct: it.isCorrect,
      time_spent_seconds: it.timeSpentSeconds ?? 0,
      attempted_at: ts,
      subject: it.question.materia,
      topic: it.question.assunto,
      exam_source: it.question.prova,
    }));
    const { error } = await localBackend.from('user_question_attempts').insert(rows);
    if (error) throw error;
    console.log('[PERSIST] recordQuestionAttemptsBatch remote ok', rows.length);
  } catch (e) {
    console.error('[PERSIST] recordQuestionAttemptsBatch remote failed', e);
    if (showToastOnError) {
      toast.error('Sincronização', 'As respostas ficaram no aparelho; a nuvem falhou em parte.');
    }
  }
}

export type RecordExamRunParams = {
  userId: string | null | undefined;
  examId: string;
  examName?: string;
  correctCount: number;
  totalCount: number;
  durationSeconds?: number;
  meta?: Record<string, unknown>;
};

/** Resumo de um simulado (requer migração `user_exam_runs`). Falha silenciosa se tabela não existir. */
export async function recordExamRun(params: RecordExamRunParams): Promise<void> {
  const {
    userId,
    examId,
    examName,
    correctCount,
    totalCount,
    durationSeconds,
    meta,
  } = params;

  if (!true || !userId) {
    console.log('[PERSIST] recordExamRun skip (offline or no user)', examId);
    return;
  }

  try {
    const { error } = await localBackend.from('user_exam_runs').insert({
      user_id: userId,
      exam_id: examId,
      exam_name: examName ?? null,
      correct_count: correctCount,
      total_count: totalCount,
      duration_seconds: durationSeconds ?? null,
      meta: meta ?? null,
    });
    if (error) throw error;
    console.log('[PERSIST] recordExamRun remote ok', examId);
  } catch (e) {
    console.error('[PERSIST] recordExamRun remote failed (aplique a migração se necessário)', e);
  }
}

export async function recordQuestionAttempt(
  params: RecordQuestionAttemptParams
): Promise<void> {
  const {
    userId,
    question,
    userAnswer,
    isCorrect,
    timeSpentSeconds = 0,
    xpAward = 0,
    skipStreak = false,
    showToastOnError = true,
  } = params;

  const entry: QuestionHistory = {
    questionId: question.id,
    userAnswer,
    isCorrect,
    timestamp: new Date().toISOString(),
    timeSpent: timeSpentSeconds || undefined,
  };

  useExamStore.getState().addToHistory(entry);
  useUserStore.getState().updateMastery(question.materia, isCorrect ? 100 : 0);
  if (xpAward > 0) {
    useUserStore.getState().addXP(xpAward);
  }

  if (!skipStreak) {
    await bumpStreakForActivity(userId, { showToastOnError });
  }

  if (xpAward > 0 && userId) {
    await addXpRemote(userId, xpAward);
  }

  if (!true || !userId) {
    console.log('[PERSIST] recordQuestionAttempt local only', { questionId: question.id });
    return;
  }

  try {
    const { error } = await localBackend.from('user_question_attempts').insert({
      user_id: userId,
      question_id: question.id,
      answer_given: userAnswer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
      attempted_at: entry.timestamp,
      subject: question.materia,
      topic: question.assunto,
      exam_source: question.prova,
    });
    if (error) throw error;
    console.log('[PERSIST] recordQuestionAttempt remote ok', question.id);
  } catch (e) {
    console.error('[PERSIST] recordQuestionAttempt remote failed', e);
    if (showToastOnError) {
      toast.error('Sincronização', 'Esta resposta ficou salva no aparelho; nuvem falhou.');
    }
  }
}

export type RecordStudySessionParams = {
  userId: string | null | undefined;
  startedAt: Date;
  endedAt: Date;
  activityType: StudyActivityType;
  subject?: string;
  topic?: string;
  showToastOnError?: boolean;
};

export async function recordStudySession(params: RecordStudySessionParams): Promise<void> {
  const {
    userId,
    startedAt,
    endedAt,
    activityType,
    subject,
    topic,
    showToastOnError = true,
  } = params;

  const durationSeconds = Math.max(
    0,
    Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
  );
  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60) || 1);

  const sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);

  useSessionStore.getState().addSession({
    id: sessionId,
    date: calendarDayLocal(endedAt),
    duration: durationMinutes,
    subject: subject ?? 'Sessão de estudo',
  });

  await bumpStreakForActivity(userId, { showToastOnError });

  if (!true || !userId) {
    console.log('[PERSIST] recordStudySession local only', { durationSeconds, activityType });
    return;
  }

  try {
    const { error } = await localBackend.from('user_study_sessions').insert({
      user_id: userId,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      duration_seconds: durationSeconds,
      activity_type: activityType,
      subject: subject ?? null,
      topic: topic ?? null,
    });
    if (error) throw error;
    console.log('[PERSIST] recordStudySession remote ok', { durationSeconds });
  } catch (e) {
    console.error('[PERSIST] recordStudySession remote failed', e);
    if (showToastOnError) {
      toast.error('Sincronização', 'Sessão de estudo salva só no aparelho.');
    }
  }
}

/** Mapeia linhas do backend para o formato da store (histórico). */
export function attemptsRowsToHistory(
  rows: Array<{
    question_id: string;
    answer_given: number;
    is_correct: boolean;
    attempted_at: string;
    time_spent_seconds?: number | null;
  }>
): QuestionHistory[] {
  return rows.map((row) => ({
    questionId: row.question_id,
    userAnswer: row.answer_given,
    isCorrect: row.is_correct,
    timestamp: row.attempted_at,
    timeSpent: row.time_spent_seconds ?? undefined,
  }));
}
