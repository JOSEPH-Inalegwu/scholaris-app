import React, { useState, useEffect } from 'react';

// Import your JSON files
import csc101Questions from '../json/cs101-questions.json';
import mth211Questions from '../json/mth211-questions.json'
// import cs201Questions from '../json/cs201-questions.json';
// import mth101Questions from '../json/mth101-questions.json';
// import phy101Questions from '../json/phy101-questions.json';

// Question files mapping
const questionFiles = {
  'CS101': csc101Questions,
  'MTH211': mth211Questions,
  // Add more courses as you import them
  // 'CS201': cs201Questions,
  // 'MTH101': mth101Questions,
  // 'PHY101': phy101Questions,
};

// Mock data for demonstration
const mockData = {
  courses: [
    { department: 'Computer Science', course_code: 'CS101', level: 100, question_count: 50, default_time: 35 },
    { department: 'Computer Science', course_code: 'CS201', level: 200, question_count: 40, default_time: 25 },
    { department: 'Computer Science', course_code: 'MTH211', level: 200, question_count: 40, default_time: 35 },
    { department: 'Physics', course_code: 'PHY101', level: 100, question_count: 30, default_time: 25 },
  ]
};

const ExamSelector = ({ onStartExam = () => {} }) => {
  // State for form selections
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questionCount, setQuestionCount] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to load questions from the imported JSON files
  const loadQuestions = (courseCode) => {
    const questionsData = questionFiles[courseCode];
    if (!questionsData) {
      console.warn(`No questions found for course: ${courseCode}`);
      return { questions: [] };
    }
    return questionsData;
  };

  // Extract unique departments and levels from JSON
  const departments = [...new Set(mockData.courses.map(c => c.department))];
  const levels = [...new Set(mockData.courses.map(c => c.level))];

  // Filter courses based on department
  const filteredCourses = mockData.courses.filter(c => c.department === department);

  // Handle course selection and set question count/time
  useEffect(() => {
    const validateQuestions = () => {
      if (course && level) {
        setLoading(true);
        setError('');
        
        const selectedCourse = mockData.courses.find(c => c.course_code === course && c.level === Number(level));
        if (selectedCourse) {
          setQuestionCount(selectedCourse.question_count);
          setTimeLimit(selectedCourse.default_time.toString());
          
          // Load questions for validation
          const questionsData = loadQuestions(course);
          const courseQuestions = questionsData.questions || [];
          
          // Filter questions by course and level if needed
          const availableQuestions = courseQuestions.filter(
            q => q.course_code === course && q.level === Number(level)
          );
          
          setAvailableQuestions(availableQuestions.length);
          
          // Validate question count
          if (availableQuestions.length < selectedCourse.question_count) {
            setError(`Not enough questions for ${course} (${availableQuestions.length}/${selectedCourse.question_count})`);
          } else {
            setError('');
          }
        }
        setLoading(false);
      } else {
        setQuestionCount(null);
        setTimeLimit('');
        setAvailableQuestions(0);
        setError('');
      }
    };

    validateQuestions();
  }, [course, level]);

  // Handle form submission
  const handleStartExam = () => {
    if (!department || !course || !level || !timeLimit || error) {
      setError('Please complete all fields and resolve any errors.');
      return;
    }
    
    // Load questions for the exam
    const questionsData = loadQuestions(course);
    const examQuestions = (questionsData.questions || [])
      .filter(q => q.course_code === course && q.level === Number(level))
      .slice(0, questionCount); // Take only the required number of questions
    
    onStartExam({ 
      course_code: course, 
      level: Number(level), 
      time_limit: Number(timeLimit),
      questions: examQuestions
    });
  };

  // Handle Quick Start
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CBT Exam</h1>
          <p className="text-gray-600">Configure your exam settings</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="space-y-5">
            
            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCourse('');
                  setLevel('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!department}
              >
                <option value="">Select Course</option>
                {filteredCourses.map((c) => (
                  <option key={c.course_code} value={c.course_code}>
                    {c.course_code}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!department}
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Limit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!course}
              >
                <option value="">Select Duration</option>
                <option value="25">25 minutes</option>
                <option value="35">35 minutes</option>
              </select>
            </div>

            {/* Question Count Display */}
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

            {/* Loading State */}
            {loading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">Validating questions...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col justify-between sm:flex-row gap-3 pt-4">
              <button
                onClick={handleQuickStart}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={mockData.courses.length === 0 || loading}
              >
                Quick Start
              </button>
              
              <button
                onClick={handleStartExam}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
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