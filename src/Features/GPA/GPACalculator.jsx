import React, { useState } from 'react';
import { useGPA } from '../../Hooks/useGPA';
import Spinner from '../../Components/Spinner';

import plus from '../../assets/icons/plus.svg';
import deleteIcon from '../../assets/icons/delete.svg';

const GPACalculator = () => {
  const {
    firstSemester,
    secondSemester,
    result,
    handleCourseChange,
    addCourse,
    removeCourse,
    calculateSemesterGPA,
    calculateCombinedGPA,
    clearResult,
    clearAllData,
  } = useGPA();

  // Local states for loading, errors, and modal visibility
  const [loading, setLoading] = useState({ firstSemester: false, secondSemester: false, combined: false });
  const [error, setError] = useState({ firstSemester: '', secondSemester: '', combined: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle GPA calculation for a specific semester
  const handleCalculateSemesterGPA = (semesterKey) => {
    setError((prev) => ({ ...prev, [semesterKey]: '' }));
    setLoading((prev) => ({ ...prev, [semesterKey]: true }));

    setTimeout(() => {
      const semesterCourses = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
      if (semesterCourses.length === 0 || semesterCourses.every(course => !course.code.trim() || !course.unit || !course.grade)) {
        setError((prev) => ({
          ...prev,
          [semesterKey]: 'Please add at least one valid course with code, unit, and grade.',
        }));
        setLoading((prev) => ({ ...prev, [semesterKey]: false }));
        return;
      }

      try {
        const calcResult = calculateSemesterGPA(semesterKey);
        if (!calcResult || typeof calcResult.gpa !== 'number' || isNaN(calcResult.gpa)) {
          throw new Error('GPA calculation did not return a valid number.');
        }
      } catch (err) {
        console.error(err);
        setError((prev) => ({
          ...prev,
          [semesterKey]: 'Error calculating GPA. Please check your inputs.',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [semesterKey]: false }));
      }
    }, 800); // Simulate loading
  };

  // Function to handle combined GPA calculation and open modal
  const handleCalculateCombinedGPA = () => {
    setError((prev) => ({ ...prev, combined: '' }));
    setLoading((prev) => ({ ...prev, combined: true }));

    setTimeout(() => {
      const allCourses = [...firstSemester, ...secondSemester];
      if (allCourses.length === 0 || allCourses.every(course => !course.code.trim() || !course.unit || !course.grade)) {
        setError((prev) => ({
          ...prev,
          combined: 'Please add at least one valid course with code, unit, and grade in either semester.',
        }));
        setLoading((prev) => ({ ...prev, combined: false }));
        return;
      }

      try {
        const calcResult = calculateCombinedGPA();
        if (!calcResult || typeof calcResult.gpa !== 'number' || isNaN(calcResult.gpa)) {
          throw new Error('Combined GPA calculation did not return a valid number.');
        }
        setIsModalOpen(true); // Open modal on successful calculation
      } catch (err) {
        console.error(err);
        setError((prev) => ({
          ...prev,
          combined: 'Error calculating combined GPA. Please check your inputs.',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, combined: false }));
      }
    }, 800); // Simulate loading
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderTable = (semester, semesterKey, label) => (
    <div className="w-full lg:w-1/2 md:p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{label}</h2>
      <table className="w-full table-auto rounded-xl overflow-hidden shadow-md">
        <thead className="bg-dark text-white">
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
                  onChange={(e) => handleCourseChange(semesterKey, index, 'unit', e.target.value)}
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
                  <img src={deleteIcon} className='w-5 h-5' alt="delete-icon" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center gap-3">
        <button
          onClick={() => addCourse(semesterKey)}
          className="flex items-center gap-2 px-4 py-2 bg-amber  text-white rounded hover:bg-amber-dark transition"
          aria-label={`Add course to ${label}`}
        >
          <img src={plus} className="w-4 h-4" alt="add-icon" />
          Add Course
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => handleCalculateSemesterGPA(semesterKey)}
            className="px-4 py-2 bg-dark text-white rounded transition"
            disabled={loading[semesterKey]}
            aria-label={`Calculate GPA for ${label}`}
          >
            {loading[semesterKey] ? (
              <div className="flex items-center gap-2">
              Calculating <Spinner size={20} color="white" />
              </div>
            )  : (
              'Calculate GPA'
            )}
          </button>
          {/* <button
            onClick={() => clearResult(semesterKey)}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
            aria-label={`Clear GPA result for ${label}`}
          >
            Clear Result
          </button> */}
        </div>
      </div>

      {/* Error message */}
      {error[semesterKey] && (
        <p className="mt-2 text-red-600 font-semibold">{error[semesterKey]}</p>
      )}

      {/* GPA Result */}
      {result[semesterKey] && (
        <div className="mt-5 p-5 bg-green-200 text-green-800 rounded shadow md:mt-7 md:text-xl">
          <strong>{label} GPA:</strong> {result[semesterKey].gpa.toFixed(2)} <br />
          <strong>Classification:</strong> {result[semesterKey].classification}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative max-w-full mx-auto mt-10 py-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-left text-gray-700 mb-10">
        <span className="inline-block rotate-slow mt-3">⏳</span> Save your time, calculate on time!
      </h1>

      <div className="flex justify-end mb-4 gap-3 md:mx-4">
        <button
          onClick={handleCalculateCombinedGPA}
          className="px-4 py-2 bg-success  text-white rounded transition"
          disabled={loading.combined}
          aria-label="Generate Combined CGPA"
        >
          {loading.combined ? (
            <div className="flex items-center gap-2">
               Generating <Spinner size={20} color="white" />
            </div>
            ) : 
            ('Generate CGPA')}
        </button>
        <button
          onClick={clearAllData}
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
          aria-label="Clear all data"
        >
          Clear All Data
        </button>
      </div>

      {/* Error message for combined GPA */}
      {error.combined && (
        <p className="mt-2 text-red-600 font-semibold text-center">{error.combined}</p>
      )}

      {/* Modal for Combined CGPA */}
      {isModalOpen && result.combined && (
        <div
          className="fixed inset-0 bg-black/90 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-sm p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 id="modal-title" className="text-2xl font-semibold text-gray-800 mb-4">
              Combined CGPA
            </h2>
            <div className="p-4 bg-green-100 text-green-800 rounded shadow">
              <strong>Combined CGPA:</strong> {result.combined.gpa.toFixed(2)} <br />
              <strong>Classification:</strong> {result.combined.classification}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => clearResult('combined')}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
                aria-label="Clear Combined CGPA"
              >
                Clear CGPA
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {renderTable(firstSemester, 'firstSemester', 'First Semester')}
        {renderTable(secondSemester, 'secondSemester', 'Second Semester')}
      </div>
    </div>
  );
};

export default GPACalculator;