import React, { useState, useContext, useEffect } from 'react';
import ExamSelector from './components/ExamSelector';
import ExamInterface from './components/ExamInterface';
import ExamResults from './components/ExamResults';
import ReviewAnswers from './components/ReviewAnswers';
import { NavigationContext } from '../../Context/NavigationContext';
import { useUser } from '../../Context/UserContext';

const STORAGE_KEY = 'quizCBTState';

const generateRandomId = () =>
  'exam_' + Math.random().toString(36).substring(2, 10);

const QuizCBT = () => {
  const { setIsNavigationDisabled } = useContext(NavigationContext);
  const { userName: studentName = 'Student' } = useUser();

  const [stage, setStage] = useState('selection'); // selection | exam | results | review
  const [examData, setExamData] = useState(null);
  const [results, setResults] = useState(null);
  const [reviewData, setReviewData] = useState([]); 
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setStage(saved.stage);
      setExamData(saved.examData);
      setResults(saved.results);
      setReviewData(saved.reviewData || []);
      if (saved.stage === 'exam') setIsNavigationDisabled(true);
    }
    setIsRestoring(false);
  }, [setIsNavigationDisabled]);

  // Persist to localStorage
  useEffect(() => {
    if (isRestoring) return;
    const save = { stage, examData, results, reviewData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }, [stage, examData, results, reviewData, isRestoring]);

  // Debug logs
  useEffect(() => {
    console.log('🔄 QuizCBT - stage changed ->', stage);
    console.log('📊 Current results:', results);
  }, [stage, results]);

  // Start exam
  const handleStartExam = (data) => {
    const exam_id = data.exam_id || generateRandomId();
    setExamData({ ...data, exam_id });
    setStage('exam');
    setIsNavigationDisabled(true);
  };

  // Submit exam
  const handleSubmitExam = (gradedArray) => {
    if (!Array.isArray(gradedArray)) {
      console.error('❌ gradedArray is not an array:', gradedArray);
      return;
    }

    const total = gradedArray.length;
    const correctCount = gradedArray.filter((g) => g.isCorrect).length;
    const answeredCount = gradedArray.filter(
      (g) => g.userAnswer !== null && g.userAnswer !== undefined
    ).length;
    const percent = ((correctCount / total) * 100).toFixed(2);

    setResults({
      score: correctCount,
      total,
      answeredCount,
      percent,
      breakdown: gradedArray,
    });

    setStage('results');
    setIsNavigationDisabled(false);
  };

  // Restart exam / Go back to selection
  const handleGoBack = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('examToastShown'); // reset toast flag
    setStage('selection');
    setExamData(null);
    setResults(null);
    setReviewData([]);
    setIsNavigationDisabled(false);
  };

  // Review answers
  const handleReviewAnswers = (gradedData) => {
    console.log('✅ QuizCBT - Review clicked!');
    const dataToReview = gradedData || results?.breakdown;

    if (!dataToReview || !Array.isArray(dataToReview) || dataToReview.length === 0) {
      console.error('❌ Invalid results data for review:', dataToReview);
      alert('Unable to review answers. No valid exam data found.');
      return;
    }

    setReviewData(dataToReview);
    setStage('review');
  };

  // Back to results from review
  const handleBackToResults = () => {
    console.log('🔙 Back to results clicked');
    setStage('results');
  };

  if (isRestoring) return null;

  // Stage Rendering
  switch (stage) {
    case 'selection':
      return (
        <div className="min-h-screen bg-white">
          <ExamSelector onStartExam={handleStartExam} />
        </div>
      );

    case 'exam':
      return (
        <div className="min-h-screen bg-white">
          {examData && (
            <ExamInterface
              examData={examData}
              storageKey={`examState-${examData.exam_id}`}
              onSubmit={handleSubmitExam}
            />
          )}
        </div>
      );

    case 'results':
      return (
        <div className="min-h-screen bg-white">
          {results && (
            <ExamResults
              graded={results.breakdown}
              handleRestart={handleGoBack}
              onReview={handleReviewAnswers}
            />
          )}
        </div>
      );

    case 'review':
      return (
        <div className="min-h-screen bg-white">
          {reviewData && reviewData.length > 0 && (
            <ReviewAnswers
              graded={reviewData}
              onBack={handleBackToResults}
            />
          )}
        </div>
      );

    default:
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Unknown State</h2>
            <p className="text-gray-600 mb-4">Current stage: {stage}</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back to Start
            </button>
          </div>
        </div>
      );
  }
};

export default QuizCBT;
