import React, { useState, useEffect } from 'react';
import {
  getDepartments,
  getLevels,
  getSemesters,
  getCourses,
  fetchQuestions as fetchQuestionsByCourse
} from '../../../Hooks/supabaseQuestionsService';
import ExamInterface from './ExamInterface';
import ExamResults from './ExamResults';

const ExamSelector = () => {
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [semester, setSemester] = useState('');
  const [courseId, setCourseId] = useState(null);
  const [timeLimit, setTimeLimit] = useState('');

  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);

  const [questionCount, setQuestionCount] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState(0);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Phase management
  const [phase, setPhase] = useState('select'); // 'select' | 'exam' | 'results'
  const [examData, setExamData] = useState(null);
  const [graded, setGraded] = useState([]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      const [deps, lvls, sems] = await Promise.all([
        getDepartments(),
        getLevels(),
        getSemesters()
      ]);
      setDepartments(deps);
      setLevels(lvls);
      setSemesters(sems);
      setLoading(false);
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const run = async () => {
      setCourses([]);
      setCourseId(null);
      setQuestionCount(null);
      setAvailableQuestions(0);
      setError('');
      if (!department || !level || !semester) return;

      setLoading(true);
      const foundCourses = await getCourses(Number(department), Number(level), Number(semester));
      setCourses(foundCourses);
      setLoading(false);
    };
    run();
  }, [department, level, semester]);

  useEffect(() => {
    const validate = async () => {
      setQuestionCount(null);
      setAvailableQuestions(0);
      setError('');

      if (!courseId) return;

      setLoading(true);
      const allQs = await fetchQuestionsByCourse(Number(courseId));
      setAvailableQuestions(allQs.length);

      const defaultCount = Math.min(allQs.length, 50);
      setQuestionCount(defaultCount);
      setLoading(false);
    };
    validate();
  }, [courseId]);

  const handleStartExam = async () => {
    if (!department || !level || !semester || !courseId || !timeLimit || error) {
      setError('Please complete all fields and resolve any errors.');
      return;
    }

    const allQuestions = await fetchQuestionsByCourse(Number(courseId), questionCount);
    const selectedCourse = courses.find(c => c.id === Number(courseId));

    const examPayload = {
      course_id: Number(courseId),
      course: selectedCourse,
      level: Number(level),
      semester: Number(semester),
      time_limit: Number(timeLimit),
      questions: allQuestions.slice(0, questionCount),
    };

    setExamData(examPayload);
    setPhase('exam');
  };

  const handleQuickStart = () => {
    if (!departments.length || !levels.length || !semesters.length) return;
    setDepartment(departments[0].id.toString());
    setLevel(levels[0].id.toString());
    setSemester(semesters[0].id.toString());
  };

  // ✅ PHASE: EXAM
  if (phase === 'exam' && examData) {
    return (
      <ExamInterface
        examData={examData}
        storageKey={`exam_${examData.course_id}`}
        onSubmit={(gradedArray) => {
          setGraded(gradedArray);
          setPhase('results');
        }}
      />
    );
  }

  // ✅ PHASE: RESULTS
  if (phase === 'results') {
    return (
      <ExamResults
        graded={graded}
        handleRestart={() => {
          setPhase('select');
          setExamData(null);
          setGraded([]);
        }}
        onReview={(g) => {
          console.log('Review clicked!', g);
          // setPhase('review') if you want a ReviewAnswers page next
        }}
      />
    );
  }

  // ✅ PHASE: SELECTION
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-12">
      <div className="w-full max-w-md py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CBT Exam</h1>
          <p className="text-gray-600">Configure your exam settings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="space-y-5">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCourseId(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={!department}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!department || !level}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>{sem.name}</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={courseId ?? ''}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!department || !level || !semester}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                disabled={!courseId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Duration</option>
                <option value="25">25 minutes</option>
                <option value="35">35 minutes</option>
              </select>
            </div>

            {/* Info */}
            {questionCount !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  This exam contains <span className="font-semibold">{questionCount}</span> questions
                  {availableQuestions > 0 && (
                    <span className="block mt-1 text-green-700">
                      ✓ {availableQuestions} questions available
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">Loading data...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col justify-between sm:flex-row gap-3 pt-4">
              <button
                onClick={handleQuickStart}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                disabled={loading}
              >
                Quick Start
              </button>
              <button
                onClick={handleStartExam}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1 sm:flex-initial"
                disabled={!department || !level || !semester || !courseId || !timeLimit || error || loading}
              >
                {loading ? 'Validating...' : 'Start Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSelector;
