import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10; // Show 10 questions per page

export const useReviewAnswers = (graded = []) => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case 'correct':
        return graded.filter(q => q.isCorrect);
      case 'incorrect':
        return graded.filter(q => q.userAnswer && !q.isCorrect);
      case 'unanswered':
        return graded.filter(q => !q.userAnswer);
      default:
        return graded;
    }
  }, [graded, filter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, page]);

  const handleFilterChange = (type) => {
    setFilter(type);
    setPage(1); // Reset page when filter changes
  };

  return {
    filter,
    page,
    totalPages,
    paginatedQuestions,
    setPage,
    handleFilterChange,
  };
};
