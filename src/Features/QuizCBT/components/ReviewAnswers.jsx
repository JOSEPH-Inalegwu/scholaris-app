import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ReviewAnswers = ({ graded = [], onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Review Answers
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm sm:text-base hover:bg-gray-800 transition"
          >
            ← Back to Results
          </button>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {graded.map((q, idx) => {
            const isCorrect = q.isCorrect;
            return (
              <div
                key={q.question_id || idx}
                className={`p-4 sm:p-5 rounded-xl border-2 transition ${
                  isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                {/* Question */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {idx + 1}. {q.question}
                  </h2>
                  {isCorrect ? (
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-600 w-6 h-6" />
                  )}
                </div>

                {/* Options */}
                <ul className="space-y-2">
                  {q.options.map((opt, i) => {
                    const isUserAnswer = q.userAnswer === opt;
                    const isCorrectAnswer = q.correctAnswer === opt;
                    return (
                      <li
                        key={i}
                        className={`p-3 rounded-lg border transition ${
                          isCorrectAnswer
                            ? 'border-green-400 bg-green-100 font-semibold'
                            : isUserAnswer
                            ? 'border-red-400 bg-red-100'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {opt}
                        {isCorrectAnswer && (
                          <span className="ml-2 text-green-700 font-medium">
                            (Correct)
                          </span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="ml-2 text-red-700 font-medium">
                            (Your Answer)
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewAnswers;
