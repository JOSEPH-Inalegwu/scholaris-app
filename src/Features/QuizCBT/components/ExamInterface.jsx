import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const ExamInterface = ({ examData, onSubmit, onGoBack }) => {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData.time_limit * 60); // Convert minutes to seconds
  const [isExamActive, setIsExamActive] = useState(true);

  // Destructure exam data
  const { questions, time_limit } = examData;
  const currentQuestion = questions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    if (!isExamActive) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isExamActive]);

  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle exam submission
  const handleSubmit = () => {
    setIsExamActive(false);
    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] || null,
    }));
    onSubmit(formattedAnswers);
  };

  // Get answered questions count
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen py-15 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 ">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Left: Exam Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {questions[0].course_code} Exam
            </h1>
          </div>

          {/* Right: Time + Submit Button */}
          <div className="flex items-center space-x-6">
            <div className="text-lg font-medium text-gray-700">
              Time Left: <span className="text-red-500">{formatTime(timeLeft)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!isExamActive}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Display Question */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Display Options in 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <div
                  key={index}
                  onClick={() => isExamActive && handleAnswer(option)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}
                    ${!isExamActive ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    {/* bullet */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>

                    {/* option text */}
                    <span className="text-gray-800 text-lg">{option}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 px-6 py-2">
        <div className="max-w-md mx-auto flex justify-between items-center rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-4">
          
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="px-5 py-2 rounded-md text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentQuestionIndex === 0 || !isExamActive}
          >
            Previous
          </button>

          {/* Question Counter */}
          <span className="text-sm text-gray-600 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>

            <button
              onClick={handleNext}
              className="px-8 py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!isExamActive}
            >
              Next
            </button>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Answered: {answeredCount}/{questions.length}
            </span>
          </div>
          
          {/* Question tracker dots */}
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : answers[questions[index].id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={!isExamActive}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;