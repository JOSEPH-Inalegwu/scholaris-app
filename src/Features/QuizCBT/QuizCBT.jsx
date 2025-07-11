import React, { useState, useContext } from 'react';
import ExamSelector from './components/ExamSelector';
import ExamInterface from './components/ExamInterface';
import { NavigationContext } from '../../Context/NavigationContext';

// Stub component for ExamSubmission
const ExamSubmissionStub = ({ answers, onComplete }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Submitting Exam</h1>
      <p className="text-gray-700 mb-4">Processing {answers.length} answers...</p>
      <p className="text-gray-700 mb-4">Placeholder: Submission logic would be here.</p>
      <button
        onClick={() => onComplete({ score: 0, total: 40 })} // Simulate completion
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        View Results
      </button>
    </div>
  </div>
);

// Stub component for ExamResults
const ExamResultsStub = ({ results }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Exam Results</h1>
      <p className="text-gray-700 mb-4">
        Score: {results.score}/{results.total} ({((results.score / results.total) * 100).toFixed(2)}%)
      </p>
      <p className="text-gray-700 mb-4">Placeholder: Detailed results would be here.</p>
      <button
        onClick={() => window.location.reload()} // Simulate restart
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Restart Exam
      </button>
    </div>
  </div>
);

const QuizCBT = () => {
  // ✅ Access navigation context
  const { setIsNavigationDisabled } = useContext(NavigationContext);

  // State for managing flow
  const [stage, setStage] = useState('selection');
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [results, setResults] = useState(null);

  // Handlers for stage transitions
  const handleStartExam = (data) => {
    setExamData(data);
    setStage('exam');
    setIsNavigationDisabled(true); // ✅ Disable navigation
  };

  const handleGoBack = () => {
    setStage('selection');
    setExamData(null);
    setIsNavigationDisabled(false); // ✅ Re-enable navigation if going back before submitting
  };

  const handleSubmitExam = (submittedAnswers) => {
    setAnswers(submittedAnswers);
    setStage('submission');
  };

  const handleSubmissionComplete = (examResults) => {
    setResults(examResults);
    setStage('results');
    setIsNavigationDisabled(false); // ✅ Re-enable navigation after submission
  };

  return (
    <div className="min-h-screen bg-white">
      {stage === 'selection' && (
        <ExamSelector onStartExam={handleStartExam} />
      )}
      {stage === 'exam' && (
        <ExamInterface 
          examData={examData} 
          onSubmit={handleSubmitExam}
          onGoBack={handleGoBack}
        />
      )}
      {stage === 'submission' && (
        <ExamSubmissionStub 
          answers={answers} 
          onComplete={handleSubmissionComplete} 
        />
      )}
      {stage === 'results' && (
        <ExamResultsStub results={results} />
      )}
    </div>
  );
};

export default QuizCBT;
