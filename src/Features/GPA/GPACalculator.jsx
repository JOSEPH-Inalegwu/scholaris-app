import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { MdCalculate } from 'react-icons/md';
import { toast } from 'react-toastify';

const GPACalculator = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: '', unit: '', grade: '' }
  ]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses([...courses, { id: newId, code: '', unit: '', grade: '' }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const clearAll = () => {
    setCourses([{ id: 1, code: '', unit: '', grade: '' }]);
    setResult(null);
  };

  const getGradePoints = (grade) => {
    const gradeMap = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    return gradeMap[grade] || 0;
  };

  const getClassification = (gpa) => {
    if (gpa >= 4.5) return 'First Class';
    if (gpa >= 3.5) return 'Second Class Upper';
    if (gpa >= 2.5) return 'Second Class Lower';
    if (gpa >= 1.5) return 'Third Class';
    return 'Pass';
  };

  const calculateGPA = () => {
    // Validation
    const validCourses = courses.filter(course => 
      course.code.trim() && course.unit && course.grade
    );

    if (validCourses.length === 0) {
      toast.error('⚠️ Please add at least one valid course with code, unit, and grade.');
      return;
    }

    if (validCourses.length !== courses.length) {
      toast.error('⚠️ Please complete all course entries or remove incomplete ones.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      try {
        let totalPoints = 0;
        let totalUnits = 0;

        validCourses.forEach(course => {
          const gradePoints = getGradePoints(course.grade);
          const units = parseInt(course.unit);
          totalPoints += gradePoints * units;
          totalUnits += units;
        });

        const gpa = totalPoints / totalUnits;
        const classification = getClassification(gpa);

        setResult({
          gpa: gpa.toFixed(2),
          classification,
          totalCourses: validCourses.length,
          totalUnits
        });
      } catch {
        toast.error('❌  Error calculating GPA. Please check your inputs.');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-18 px-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            <MdCalculate className="inline-block mr-3 text-gray-600" size={40} />
            GPA Calculator
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Calculate your Grade Point Average quickly and accurately
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Course Input Section */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Course Information
            </h2>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Course Code</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Credit Unit</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Grade</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => updateCourse(course.id, 'code', e.target.value.toUpperCase())}
                          placeholder="e.g., CSC101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={course.unit}
                          onChange={(e) => updateCourse(course.id, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length === 1}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Course {course.id}</h3>
                    <button
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length === 1}
                      className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) => updateCourse(course.id, 'code', e.target.value.toUpperCase())}
                        placeholder="e.g., CSC101"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Credit Unit
                        </label>
                        <select
                          value={course.unit}
                          onChange={(e) => updateCourse(course.id, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Grade
                        </label>
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select</option>
                          {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={addCourse}
              className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FiPlus size={18} className="mr-2" />
              Add Course
            </button>
          </div>

          {/* Action Buttons */}
          <div className="p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={calculateGPA}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 font-medium"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  <>
                    <MdCalculate className="mr-2" size={20} />
                    Calculate GPA
                  </>
                )}
              </button>
              
              <button
                onClick={clearAll}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <FiRotateCcw className="mr-2" size={20} />
                Clear All
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Your Results
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                    {result.gpa}
                  </div>
                  <div className="text-sm text-gray-600">Grade Point Average</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-lg font-semibold text-blue-600 mb-1">
                    {result.classification}
                  </div>
                  <div className="text-sm text-gray-600">Classification</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-lg font-semibold text-purple-600 mb-1">
                    {result.totalCourses}
                  </div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-lg font-semibold text-orange-600 mb-1">
                    {result.totalUnits}
                  </div>
                  <div className="text-sm text-gray-600">Total Units</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;