import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useReviewAnswers } from '../../../Hooks/useReviewAnswers';

const ReviewAnswers = ({ graded = [], onBack }) => {
  const {
    filter,
    page,
    totalPages,
    paginatedQuestions,
    setPage,
    handleFilterChange,
  } = useReviewAnswers(graded);

  if (!graded || graded.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Review Answers
          </h1>
          <p className="text-gray-600 mb-6">No exam data available to review.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm sm:text-base hover:bg-gray-800 transition"
          >
            ← Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Review Answers
          </h1>
          <button
            onClick={() => onBack?.()}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm sm:text-base hover:bg-gray-800 transition"
          >
            ← Back to Results
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['all', 'correct', 'incorrect', 'unanswered'].map(type => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filter === type
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {paginatedQuestions.map((q, idx) => {
            const globalIndex = (page - 1) * 10 + idx + 1;
            const isCorrect = q.isCorrect;
            const question = q.question || 'Question not available';
            const options = q.options || [];
            const userAnswer = q.userAnswer;
            const correctAnswer = q.correctAnswer;

            return (
              <div
                key={q.question_id || `question-${globalIndex}`}
                className={`p-4 sm:p-5 rounded-xl border-2 transition ${
                  isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                {/* Question */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 pr-4">
                    {globalIndex}. {question}
                  </h2>
                  {isCorrect ? (
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-600 w-6 h-6" />
                  )}
                </div>

                {/* Options */}
                {options.length > 0 ? (
                  <ul className="space-y-2">
                    {options.map((opt, i) => {
                      const isUserAnswer = userAnswer === opt;
                      const isCorrectAnswer = correctAnswer === opt;
                      
                      return (
                        <li
                          key={`option-${i}`}
                          className={`p-3 rounded-lg border transition ${
                            isCorrectAnswer
                              ? 'border-green-400 bg-green-100 font-semibold'
                              : isUserAnswer
                              ? 'border-red-400 bg-red-100'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <span className="block">{opt}</span>
                          <div className="mt-1">
                            {isCorrectAnswer && (
                              <span className="inline-block text-green-700 font-medium text-sm">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="inline-block text-red-700 font-medium text-sm">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <p className="text-gray-600">No options available.</p>
                    <div className="mt-2 text-sm">
                      <p><strong>Your Answer:</strong> {userAnswer || 'Not answered'}</p>
                      <p><strong>Correct Answer:</strong> {correctAnswer || 'Not available'}</p>
                    </div>
                  </div>
                )}

                {/* Unanswered note */}
                {!userAnswer && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ This question was not answered
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{graded.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {graded.filter(q => q.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {graded.filter(q => q.userAnswer && !q.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {graded.filter(q => !q.userAnswer).length}
              </div>
              <div className="text-sm text-gray-600">Unanswered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnswers;
