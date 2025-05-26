import React, { useState } from 'react';
import { useGPA } from '../../Hooks/useGPA';
import plus from '../../assets/icons/plus.svg';

const GPACalculator = () => {
  const {
    firstSemester,
    secondSemester,
    handleCourseChange,
    addCourse,
    removeCourse,
    calculateGPA,
  } = useGPA();

  // Local states to hold GPA results and loading/errors for each semester
  const [loading, setLoading] = useState({ firstSemester: false, secondSemester: false });
  const [error, setError] = useState({ firstSemester: '', secondSemester: '' });
  const [gpaResult, setGpaResult] = useState({ firstSemester: null, secondSemester: null });

  // Function to handle GPA calculation for a specific semester
  const handleCalculateSemesterGPA = (semesterKey) => {
    setError((prev) => ({ ...prev, [semesterKey]: '' }));
    setLoading((prev) => ({ ...prev, [semesterKey]: true }));
  
    setTimeout(() => {
      const semesterCourses = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
      if (semesterCourses.length === 0) {
        setError((prev) => ({ ...prev, [semesterKey]: 'Please add at least one course before calculating GPA.' }));
        setLoading((prev) => ({ ...prev, [semesterKey]: false }));
        setGpaResult((prev) => ({ ...prev, [semesterKey]: null }));
        return;
      }
  
      try {
        const result = calculateGPA(semesterCourses);
        console.log(`GPA calculated for ${semesterKey}:`, result);
        
        if (!result || typeof result.gpa !== 'number' || isNaN(result.gpa)) {
          throw new Error('GPA calculation did not return a valid number.');
        }
        
        setGpaResult((prev) => ({ ...prev, [semesterKey]: result }));
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, [semesterKey]: 'Error calculating GPA. Please check your inputs.' }));
        setGpaResult((prev) => ({ ...prev, [semesterKey]: null }));
      } finally {
        setLoading((prev) => ({ ...prev, [semesterKey]: false }));
      }
    }, 800); // simulate loading
  };
  

  const renderTable = (semester, semesterKey, label) => (
    <div className="w-full lg:w-1/2 p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{label}</h2>
      <table className="w-full table-auto rounded-xl overflow-hidden shadow-md">
        <thead className="bg-[#222831] text-white">
          <tr>
            <th className="p-3 border border-gray-500">Course Code</th>
            <th className="p-3 border border-gray-500">Credit Unit</th>
            <th className="p-3 border border-gray-500">Grade</th>
            <th className="p-3 border border-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {semester.map((course, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="p-3 border border-gray-200">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 uppercase"
                  value={course.code}
                  onChange={(e) => handleCourseChange(semesterKey, index, 'code', e.target.value)}
                  placeholder="e.g. CSC101"
                />
              </td>
              <td className="p-3 border border-gray-200">
                <select
                  className="w-full border rounded px-2 py-1"
                  value={course.unit}
                  onChange={(e) => handleCourseChange(semesterKey, index, 'unit', parseInt(e.target.value))}
                >
                  <option value="">--</option>
                  {[1, 2, 3].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 border border-gray-200">
                <select
                  className="w-full border rounded px-2 py-1"
                  value={course.grade}
                  onChange={(e) => handleCourseChange(semesterKey, index, 'grade', e.target.value)}
                >
                  <option value="">--</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 text-center border border-gray-200">
                <button
                  onClick={() => removeCourse(semesterKey, index)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label="Remove course"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center gap-3">
        <button
          onClick={() => addCourse(semesterKey)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-600 transition"
          aria-label={`Add course to ${label}`}
        >
          <img src={plus} className="w-4 h-4" alt="add-icon" />
          Add Course
        </button>

        <button
          onClick={() => handleCalculateSemesterGPA(semesterKey)}
          className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
          disabled={loading[semesterKey]}
          aria-label={`Calculate GPA for ${label}`}
        >
          {loading[semesterKey] ? 'Calculating...' : 'Calculate GPA'}
        </button>
      </div>

      {/* Error message */}
      {error[semesterKey] && (
        <p className="mt-2 text-red-600 font-semibold">{error[semesterKey]}</p>
      )}

      {/* GPA Result */}
      {gpaResult[semesterKey] !== null && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded shadow">
          <strong>{label} GPA:</strong> {gpaResult[semesterKey].gpa.toFixed(2)} <br />
          <strong>Classification:</strong> {gpaResult[semesterKey].classification}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative max-w-full mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10">
        📘 Scholaris CGPA Calculator
      </h1>

      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {renderTable(firstSemester, 'firstSemester', 'First Semester')}
        {renderTable(secondSemester, 'secondSemester', 'Second Semester')}
      </div>
    </div>
  );
};

export default GPACalculator;
