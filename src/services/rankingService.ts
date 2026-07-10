import type { LeaderboardUserRow, QuestionHistory } from '../store/types';

export type RankingPeriod = 'today' | 'weekly' | 'monthly' | 'global' | 'friends' | 'school';
export type RankingLeague = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';

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
  league: RankingLeague;
  previousPosition?: number;
  isSelf?: boolean;
}

export const LEAGUES: Array<{
  id: RankingLeague;
  label: string;
  minXp: number;
  maxXp: number | null;
  color: string;
}> = [
  { id: 'bronze', label: 'Bronze', minXp: 0, maxXp: 999, color: '#CD7F32' },
  { id: 'silver', label: 'Prata', minXp: 1_000, maxXp: 2_999, color: '#C0C0C0' },
  { id: 'gold', label: 'Ouro', minXp: 3_000, maxXp: 6_999, color: '#FFD700' },
  { id: 'diamond', label: 'Diamante', minXp: 7_000, maxXp: 14_999, color: '#5FE7F2' },
  { id: 'master', label: 'Mestre', minXp: 15_000, maxXp: null, color: '#B38CFF' },
];

const DAY_MS = 86_400_000;

function inLastDays(timestamp: string, days: number) {
  const time = new Date(timestamp).getTime();
  if (!Number.isFinite(time)) return false;
  return Date.now() - time <= days * DAY_MS && Date.now() >= time;
}

function scopeHistory(history: QuestionHistory[], period: RankingPeriod) {
  if (period === 'today') return history.filter((entry) => inLastDays(entry.timestamp, 1));
  if (period === 'weekly') return history.filter((entry) => inLastDays(entry.timestamp, 7));
  if (period === 'monthly') return history.filter((entry) => inLastDays(entry.timestamp, 30));
  return history;
}

export function getLeague(xp: number): RankingLeague {
  const safeXp = Math.max(0, xp);
  if (safeXp >= 15_000) return 'master';
  if (safeXp >= 7_000) return 'diamond';
  if (safeXp >= 3_000) return 'gold';
  if (safeXp >= 1_000) return 'silver';
  return 'bronze';
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
  if (period === 'friends' || period === 'school') return null;

  const scopedHistory = scopeHistory(history, period);
  const questionsSolved = scopedHistory.length;
  const correct = scopedHistory.filter((entry) => entry.isCorrect).length;
  const periodXp = period === 'global' ? Math.max(0, xp) : questionsSolved * 5 + correct * 10;

  if (questionsSolved === 0 && periodXp === 0) return null;

  return {
    id: id ?? 'self',
    name: name || 'Voce',
    avatar: profilePic || undefined,
    questionsSolved,
    correct,
    xp: periodXp,
    level: Math.max(1, level),
    streak: Math.max(0, streak),
    accuracy: questionsSolved === 0 ? 0 : Math.round((correct / questionsSolved) * 100),
    league: getLeague(period === 'global' ? xp : periodXp),
    isSelf: true,
  };
}

export function mapRemoteLeaderboardRows(rows: LeaderboardUserRow[], selfId: string | null): RankingRow[] {
  return rows
    .filter((row): row is LeaderboardUserRow & { id: string } => Boolean(row?.id))
    .map((row) => {
      const xp = Math.max(0, row.xp ?? 0);
      const questionsSolved = Math.max(0, Math.round(xp / 15));
      const correct = Math.min(questionsSolved, Math.max(0, Math.round(questionsSolved * 0.72)));
      return {
        id: row.id,
        name: row.name || 'Estudante',
        avatar: row.profile_pic || undefined,
        questionsSolved,
        correct,
        xp,
        level: Math.max(1, row.level ?? Math.floor(xp / 1_000) + 1),
        streak: Math.max(0, row.streak ?? 0),
        accuracy: questionsSolved === 0 ? 0 : Math.round((correct / questionsSolved) * 100),
        league: getLeague(xp),
        isSelf: selfId !== null && row.id === selfId,
      } satisfies RankingRow;
    })
    .filter((row) => row.xp > 0 || row.questionsSolved > 0);
}

export function sortRankingRows(rows: RankingRow[]): RankingRow[] {
  return [...rows].sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return b.questionsSolved - a.questionsSolved;
  });
}
