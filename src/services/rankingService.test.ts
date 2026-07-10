import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSelfRankingRow, getLeague, mapRemoteLeaderboardRows, sortRankingRows } from './rankingService';
import type { QuestionHistory } from '../store/types';

afterEach(() => vi.useRealTimers());

describe('rankingService', () => {
  it('calcula recortes temporais e XP sem misturar tentativas antigas', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-10T12:00:00.000Z'));
    const history: QuestionHistory[] = [
      { questionId: 'today', userAnswer: 0, isCorrect: true, timestamp: '2026-07-10T10:00:00.000Z' },
      { questionId: 'week', userAnswer: 1, isCorrect: false, timestamp: '2026-07-06T10:00:00.000Z' },
      { questionId: 'month', userAnswer: 2, isCorrect: true, timestamp: '2026-06-20T10:00:00.000Z' },
      { questionId: 'old', userAnswer: 3, isCorrect: true, timestamp: '2025-01-01T10:00:00.000Z' },
    ];
    const base = { id: 'me', name: 'Ruan', xp: 9000, level: 10, streak: 4, history };

    expect(buildSelfRankingRow({ ...base, period: 'today' })).toMatchObject({ questionsSolved: 1, correct: 1, xp: 15 });
    expect(buildSelfRankingRow({ ...base, period: 'weekly' })).toMatchObject({ questionsSolved: 2, correct: 1, xp: 20 });
    expect(buildSelfRankingRow({ ...base, period: 'monthly' })).toMatchObject({ questionsSolved: 3, correct: 2, xp: 35 });
    expect(buildSelfRankingRow({ ...base, period: 'global' })).toMatchObject({ questionsSolved: 4, xp: 9000 });
    expect(buildSelfRankingRow({ ...base, period: 'friends' })).toBeNull();
  });

  it('aplica ligas e fallbacks seguros a dados remotos', () => {
    expect([getLeague(0), getLeague(1000), getLeague(3000), getLeague(7000), getLeague(15000)])
      .toEqual(['bronze', 'silver', 'gold', 'diamond', 'master']);

    const rows = mapRemoteLeaderboardRows([
      { id: 'a', name: null, xp: 3000, level: null, streak: null, profile_pic: null },
      { id: 'b', name: 'Bia', xp: 6000, level: 7, streak: 5, profile_pic: null },
    ], null);
    const sorted = sortRankingRows(rows);
    expect(sorted.map((row) => row.id)).toEqual(['b', 'a']);
    expect(sorted.every((row) => Number.isFinite(row.accuracy))).toBe(true);
  });
});
