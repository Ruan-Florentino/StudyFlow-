import { calculateDaysLeft } from '../../../lib/studyUtils';

/**
 * Calculates the score percentage based on correct answers and total questions.
 */
export const calculateScore = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return (correct / total) * 100;
};

/**
 * Formats time in seconds to MM:SS format.
 */
export const formatExamTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export { calculateDaysLeft };
