import { useUserStore } from '../store/useUserStore';

export function useStreak() {
  const streak = useUserStore((s) => s.streak);
  const longestStreak = useUserStore((s) => s.longestStreak);
  const lastStudyDate = useUserStore((s) => s.lastStudyDate);

  return { streak, longestStreak, lastStudyDate };
}
