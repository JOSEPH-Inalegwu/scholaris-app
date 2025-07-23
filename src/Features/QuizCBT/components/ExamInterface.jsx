import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';

const ExamInterface = ({ examData, storageKey, onSubmit }) => {
  /* ---------- STATE ---------- */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData.time_limit * 60);
  const [isExamActive, setIsExamActive] = useState(true);

  /* 🔥 NEW (submit‑overlay state) */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3)

  const { questions } = examData;
  const currentQuestion = questions[currentQuestionIndex];

  /* ---------- LOAD SAVED STATE ON MOUNT ---------- */
  useEffect(() => {
    // Toast (only once per session)
    const toastShown = sessionStorage.getItem('examToastShown');
    if (!toastShown) {
      toast.info(
        '📝 You’ve started the exam. Navigation is now disabled until submission.',
        { position: 'top-center', autoClose: 6000 }
      );
      sessionStorage.setItem('examToastShown', 'true');
    }

    // Load saved data from localStorage
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) {
      setAnswers(saved.answers || {});
      setCurrentQuestionIndex(saved.currentQuestionIndex ?? 0);
      setTimeLeft(saved.timeLeft ?? examData.time_limit * 60);
    }
  }, [storageKey, examData.time_limit]);

  /* ----- SAVE STATE ON CHANGE ---- */
  useEffect(() => {
    if (!isExamActive) return; // Don't save after submission
    const stateToSave = { answers, currentQuestionIndex, timeLeft };
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
  }, [answers, currentQuestionIndex, timeLeft, isExamActive, storageKey]);

  /* ---- TIMER ---- */
  useEffect(() => {
    if (!isExamActive) return;
    if (timeLeft <= 0 && !isSubmitting) {
      handleSubmitClick();
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isExamActive, isSubmitting]);

  /* 🔥 NEW countdown side‑effect */
  useEffect(() => {
    if (!isSubmitting) return;
  
    if (countdown === 0) {
      // show "Submitted!" for 1s, then finalize
      const done = setTimeout(finalizeSubmission, 1000);
      return () => clearTimeout(done);
    }
  
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [isSubmitting, countdown]);

  /* --- HELPERS ---- */
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(
      2,
      '0'
    )}`;

  const handleAnswer = (opt) =>
    setAnswers((a) => ({ ...a, [currentQuestion.id]: opt }));

  const handlePrevious = () =>
    currentQuestionIndex > 0 && setCurrentQuestionIndex((i) => i - 1);

  const handleNext = () =>
    currentQuestionIndex < questions.length - 1 &&
    setCurrentQuestionIndex((i) => i + 1);

  /* 🔥 when user clicks Submit */
  const handleSubmitClick = () => {
    setIsExamActive(false);   // freeze UI
    setIsSubmitting(true);    // show overlay
    setCountdown(3);          // reset countdown each time
  };

  /* 🔥 NEW final submit once countdown hits 0 */
  const finalizeSubmission = () => {
    setIsSubmitting(false);
    localStorage.removeItem(storageKey);
  
    // Compare each user answer with the correct option index
    const graded = questions.map((q) => {
      const userAnswer = answers[q.id] || null;
      const correctAnswer = q.options[q.correct_answer]; // ✅ get correct option string
  
      return {
        question_id: q.id,
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
      };
    });
  
    // Give a second for the "Submitted!" to show before firing onSubmit
    setTimeout(() => onSubmit(graded), 1000);
  };
  

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-12 sm:pt-16 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            {questions[0].course_code} Exam
          </h1>

          <div className="flex items-center justify-between w-full">
            <p className="text-base sm:text-lg font-medium text-gray-700">
              Time&nbsp;Left:
              <span className="ml-1 text-red-500">{formatTime(timeLeft)}</span>
            </p>

            <button
              onClick={handleSubmitClick}
              disabled={!isExamActive}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-md transition disabled:opacity-40"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* Question */}
      <section className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, i) => {
              const selected = answers[currentQuestion.id] === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => isExamActive && handleAnswer(opt)}
                  disabled={!isExamActive}
                  className={`text-left p-4 rounded-lg border-2 transition
                    ${
                      selected
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                    ${!isExamActive && 'opacity-50 cursor-not-allowed'}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full border-2
                        ${
                          selected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-gray-800 text-base sm:text-lg">
                      {opt}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <footer className="bg-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center rounded-xl border border-gray-200 bg-white shadow-sm px-4 sm:px-6 py-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || !isExamActive}
            className="px-4 py-2 rounded-md text-white text-sm bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 transition disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {currentQuestionIndex + 1}/{questions.length}
          </span>

          <button
            onClick={handleNext}
            disabled={!isExamActive}
            className="px-6 py-2 rounded-md text-white text-sm bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </footer>

      {/* Progress tracker */}
      <div className="hidden sm:block bg-white px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-xs sm:text-sm text-gray-600">
              Answered&nbsp;{answeredCount}/{questions.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                disabled={!isExamActive}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-xs font-medium transition
                  ${
                    idx === currentQuestionIndex
                      ? 'bg-blue-500 text-white'
                      : answers[questions[idx].id]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 SUBMIT OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
          <div
            className="text-black text-5xl sm:text-6xl font-extrabold"
            style={{ animation: 'pop 0.4s ease-out' }}
          >
            {countdown === 0 ? 'Submitted!' : countdown}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
