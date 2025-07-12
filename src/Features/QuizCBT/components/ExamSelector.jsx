import React, { useState, useEffect } from 'react';
import { fetchQuestions } from '../../../Hooks/supabaseQuestionsService';

// Normalize course code by removing spaces and converting to uppercase
const normalize = str => str.replace(/\s+/g, '').toUpperCase();

// Mock data for course metadata
const mockData = {
  courses: [
    { department: 'Computer Science', course_code: 'CS101', level: 100, question_count: 50, default_time: 35 },
    { department: 'Computer Science', course_code: 'CS201', level: 200, question_count: 40, default_time: 25 },
    { department: 'Computer Science', course_code: 'MTH211', level: 200, question_count: 40, default_time: 35 },
    { department: 'Computer Science', course_code: 'SEN211', level: 200, question_count: 50, default_time: 35 },
  ]
};

const ExamSelector = ({ onStartExam = () => {} }) => {
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questionCount, setQuestionCount] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = [...new Set(mockData.courses.map(c => c.department))];
  const levels = [...new Set(mockData.courses.map(c => c.level))];
  const filteredCourses = mockData.courses.filter(c => c.department === department);

  useEffect(() => {
    const validate = async () => {
      if (!course || !level) {
        setQuestionCount(null);
        setAvailableQuestions(0);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      const selectedCourse = mockData.courses.find(
        (c) => normalize(c.course_code) === normalize(course) && c.level === Number(level)
      );

      if (!selectedCourse) {
        setError('Course not found in mock metadata');
        setLoading(false);
        return;
      }

      setQuestionCount(selectedCourse.question_count);
      setTimeLimit(String(selectedCourse.default_time));

      const allQs = await fetchQuestions(normalize(course), Number(level));
      setAvailableQuestions(allQs.length);

      if (allQs.length < selectedCourse.question_count) {
        setError(
          `Not enough questions for ${course} (${allQs.length}/${selectedCourse.question_count})`
        );
      }

      setLoading(false);
    };

    validate();
  }, [course, level]);

  const handleStartExam = async () => {
    if (!department || !course || !level || !timeLimit || error) {
      setError('Please complete all fields and resolve any errors.');
      return;
    }

    const allQuestions = await fetchQuestions(normalize(course), Number(level));
    const examQuestions = allQuestions.slice(0, questionCount);

    onStartExam({
      course_code: course,
      level: Number(level),
      time_limit: Number(timeLimit),
      questions: examQuestions,
    });
  };

  const handleQuickStart = () => {
    const firstCourse = mockData.courses[0];
    setDepartment(firstCourse.department);
    setCourse(firstCourse.course_code);
    setLevel(firstCourse.level.toString());
    setTimeLimit(firstCourse.default_time.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 mt-12">
      <div className="w-full max-w-md">
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
                  setCourse('');
                  setLevel('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={!department}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Course</option>
                {filteredCourses.map((c) => (
                  <option key={c.course_code} value={c.course_code}>{c.course_code}</option>
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
                  <option key={lvl} value={lvl}>Level {lvl}</option>
                ))}
              </select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                disabled={!course}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Duration</option>
                <option value="25">25 minutes</option>
                <option value="35">35 minutes</option>
              </select>
            </div>

            {/* Info Box */}
            {questionCount && (
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
                <p className="text-sm text-yellow-800">Validating questions...</p>
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
                disabled={!department || !course || !level || !timeLimit || error || loading}
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
