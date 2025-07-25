import { useMemo } from 'react';

/**
 * Custom hook to calculate exam statistics
 * @param {Array} graded - Array of questions with {isCorrect, userAnswer}
 */
export function useExamStats(graded = []) {
  return useMemo(() => {
    const total = graded.length;
    let score = 0;
    let answered = 0;

    graded.forEach((q) => {
      if (q.userAnswer) answered++;
      if (q.isCorrect) score++;
    });

    const unanswered = total - answered;
    const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;

    return { score, total, answered, unanswered, percentage };
  }, [graded]);
}
