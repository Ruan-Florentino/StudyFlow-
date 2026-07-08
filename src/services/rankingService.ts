import type { LeaderboardUserRow, QuestionHistory } from '../store/types';

export type RankingPeriod = 'global' | 'weekly' | 'monthly';

export interface RankingRow {
  id: string;
  name: string;
  avatar?: string;
  questionsSolved: number;
  correct: number;
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  isSelf?: boolean;
}

const DAY_MS = 86400000;

function inLastDays(timestamp: string, days: number) {
  const time = new Date(timestamp).getTime();
  if (!Number.isFinite(time)) return false;
  return Date.now() - time <= days * DAY_MS;
}

export function buildSelfRankingRow(params: {
  id: string | null;
  name: string;
  xp: number;
  level: number;
  streak: number;
  profilePic?: string;
  history: QuestionHistory[];
  period: RankingPeriod;
}): RankingRow | null {
  const { id, name, xp, level, streak, profilePic, history, period } = params;
  const scopedHistory = period === 'weekly'
    ? history.filter((entry) => inLastDays(entry.timestamp, 7))
    : period === 'monthly'
      ? history.filter((entry) => inLastDays(entry.timestamp, 30))
      : history;

  const questionsSolved = scopedHistory.length;
  const correct = scopedHistory.filter((entry) => entry.isCorrect).length;
  const periodXp = period === 'global' ? xp : correct * 20;

  if (period !== 'global' && questionsSolved === 0 && periodXp === 0) return null;
  if (period === 'global' && questionsSolved === 0 && periodXp === 0) return null;

  return {
    id: id ?? 'self',
    name: name || 'Voce',
    avatar: profilePic,
    questionsSolved,
    correct,
    xp: periodXp,
    level,
    streak,
    accuracy: questionsSolved === 0 ? 0 : Math.round((correct / questionsSolved) * 100),
    isSelf: true,
  };
}

export function mapRemoteLeaderboardRows(rows: LeaderboardUserRow[], selfId: string | null): RankingRow[] {
  return rows
    .filter((row) => row?.id)
    .map((row) => ({
      id: row.id,
      name: row.name || 'Estudante',
      avatar: row.profile_pic || undefined,
      questionsSolved: Math.max(0, Math.round((row.xp ?? 0) / 20)),
      correct: Math.max(0, Math.round((row.xp ?? 0) / 25)),
      xp: row.xp ?? 0,
      level: row.level ?? 1,
      streak: row.streak ?? 0,
      accuracy: 0,
      isSelf: selfId !== null && row.id === selfId,
    }))
    .filter((row) => row.xp > 0 || row.questionsSolved > 0)
    .sort((a, b) => b.xp - a.xp);
}

export function sortRankingRows(rows: RankingRow[]): RankingRow[] {
  return [...rows].sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return b.questionsSolved - a.questionsSolved;
  });
}