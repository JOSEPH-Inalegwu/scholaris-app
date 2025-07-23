import React, { useState, useContext, useEffect } from 'react';
import ExamSelector from './components/ExamSelector';
import ExamInterface from './components/ExamInterface';
import ExamResults from './components/ExamResults';
import { NavigationContext } from '../../Context/NavigationContext';
import { useUser } from '../../Context/UserContext'; 

const STORAGE_KEY = 'quizCBTState';

const generateRandomId = () =>
  'exam_' + Math.random().toString(36).substring(2, 10);

const QuizCBT = () => {
  const { setIsNavigationDisabled } = useContext(NavigationContext);
  const { userName: studentName = 'Student' } = useUser(); 

  const [stage, setStage] = useState('selection');
  const [examData, setExamData] = useState(null);
  const [results, setResults] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setStage(saved.stage);
      setExamData(saved.examData);
      setResults(saved.results);
      if (saved.stage === 'exam') setIsNavigationDisabled(true);
    }
    setIsRestoring(false);
  }, [setIsNavigationDisabled]);

  useEffect(() => {
    if (isRestoring) return;
    const save = { stage, examData, results };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }, [stage, examData, results, isRestoring]);

  const handleStartExam = (data) => {
    const exam_id = data.exam_id || generateRandomId();
    setExamData({ ...data, exam_id });
    setStage('exam');
    setIsNavigationDisabled(true);
  };

  const handleSubmitExam = (gradedArray) => {
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

  if (isRestoring) return null;

  const handleGoBack = () => {
    localStorage.removeItem(STORAGE_KEY); 
    setStage('selection');
    setExamData(null);
    setResults(null);
    setIsNavigationDisabled(false);
  };
  

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
        />
      )}

      {stage === 'results' && results && (
        <ExamResults results={results} studentName={studentName} handleRestart={handleGoBack} />
      )}
    </div>
  );
};

export default QuizCBT;
