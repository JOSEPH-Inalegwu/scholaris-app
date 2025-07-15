import React, { useState, useContext, useEffect } from 'react';
import ExamSelector from './components/ExamSelector';
import ExamInterface from './components/ExamInterface';
import { NavigationContext } from '../../Context/NavigationContext';

const STORAGE_KEY = 'quizCBTState';

const generateRandomId = () =>
  'exam_' + Math.random().toString(36).substring(2, 10);

const ExamSubmissionStub = ({ answers, onComplete }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Submitting Exam</h1>
      <p className="mb-4">Processing {answers.length} answers…</p>
      <button
        onClick={() => onComplete({ score: 0, total: 40 })}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        View Results
      </button>
    </div>
  </div>
);

const ExamResultsStub = ({ results }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Exam Results</h1>
      <p className="mb-4">
        Score: {results.score}/{results.total} (
        {((results.score / results.total) * 100).toFixed(2)}%)
      </p>
      <button
        onClick={() => {
          localStorage.removeItem('quizCBTState');
          window.location.reload();
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Restart Exam
      </button>
    </div>
  </div>
);

const QuizCBT = () => {
  const { setIsNavigationDisabled } = useContext(NavigationContext);

  const [stage, setStage] = useState('selection');
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [results, setResults] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Load quizCBTState (contains examData + stage info)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setStage(saved.stage);
      setExamData(saved.examData);
      setAnswers(saved.answers);
      setResults(saved.results);
      if (saved.stage === 'exam') {
        setIsNavigationDisabled(true);
      }
    }
    setIsRestoring(false);
  }, [setIsNavigationDisabled]);

  // Save state anytime stage, data, or results change
  useEffect(() => {
    if (isRestoring) return;
    const save = { stage, examData, answers, results };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }, [stage, examData, answers, results, isRestoring]);

  const handleStartExam = (data) => {
    // Generate exam_id only when starting a new exam (not on restore)
    const exam_id = data.exam_id || generateRandomId();
    const newData = { ...data, exam_id };
    setExamData(newData);
    setStage('exam');
    setIsNavigationDisabled(true);
  };

  const handleGoBack = () => {
    setStage('selection');
    setExamData(null);
    setIsNavigationDisabled(false);
  };

  const handleSubmitExam = (submittedAnswers) => {
    setAnswers(submittedAnswers);
    setStage('submission');
  };

  const handleSubmissionComplete = (examResults) => {
    setResults(examResults);
    setStage('results');
    setIsNavigationDisabled(false);
  };

  if (isRestoring) return null;

  return (
    <div className="min-h-screen bg-white">
      {stage === 'selection' && (
        <ExamSelector onStartExam={handleStartExam} />
      )}

      {stage === 'exam' && examData && (
        <ExamInterface
          examData={examData}
          storageKey={`examState-${examData.exam_id}`}
          onSubmit={handleSubmitExam}
          onGoBack={handleGoBack}
        />
      )}

      {stage === 'submission' && answers && (
        <ExamSubmissionStub
          answers={answers}
          onComplete={handleSubmissionComplete}
        />
      )}

      {stage === 'results' && results && (
        <ExamResultsStub results={results} />
      )}
    </div>
  );
};

export default QuizCBT;