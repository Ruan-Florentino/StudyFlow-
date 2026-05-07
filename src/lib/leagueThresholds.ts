/**
 * Cortes de XP para ligas — mesma regra que `addXP` em `useUserStore`.
 * Bronze: 0 até antes de Prata.
 */
export const LEAGUE_XP_TIERS = {
  prata: 2000,
  ouro: 5000,
  diamante: 10_000,
} as const;

/** Progresso visual até a próxima faixa (0–100). Último patamar cheio em Diamante. */
export function leagueTierProgressPercent(xp: number): number {
  const safeXp = Math.max(0, xp);
  const { prata, ouro, diamante } = LEAGUE_XP_TIERS;
  if (safeXp >= diamante) return 100;
  if (safeXp >= ouro) {
    return Math.min(100, Math.round(((safeXp - ouro) / (diamante - ouro)) * 100));
  }
  if (safeXp >= prata) {
    return Math.min(100, Math.round(((safeXp - prata) / (ouro - prata)) * 100));
  }
  return Math.min(100, Math.round((safeXp / prata) * 100));
}
