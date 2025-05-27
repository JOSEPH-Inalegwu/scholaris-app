import { useState } from 'react';

const STORAGE_FIRST_SEMESTER_RESULT_KEY = 'firstSemesterGPAResult';
const STORAGE_SECOND_SEMESTER_RESULT_KEY = 'secondSemesterGPAResult';
const STORAGE_COMBINED_GPA_RESULT_KEY = 'combinedGPAResult';
const STORAGE_FIRST_SEMESTER_KEY = 'firstSemesterCourses';
const STORAGE_SECOND_SEMESTER_KEY = 'secondSemesterCourses';

export const useGPA = () => {
  // Load saved result from localStorage for a specific key
  const loadSavedResult = (key) => {
    try {
      const savedResult = JSON.parse(localStorage.getItem(key));
      return savedResult || null;
    } catch (error) {
      console.error(`Error loading saved result for ${key}:`, error);
      return null;
    }
  };

  // Load saved semesters from localStorage
  const loadSavedSemesters = (key, defaultValue) => {
    try {
      const savedData = JSON.parse(localStorage.getItem(key));
      return savedData && Array.isArray(savedData) && savedData.length > 0
        ? savedData
        : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  };

  const [firstSemester, setFirstSemester] = useState(
    loadSavedSemesters(STORAGE_FIRST_SEMESTER_KEY, [{ code: '', unit: '', grade: '' }])
  );
  const [secondSemester, setSecondSemester] = useState(
    loadSavedSemesters(STORAGE_SECOND_SEMESTER_KEY, [{ code: '', unit: '', grade: '' }])
  );
  const [result, setResult] = useState({
    firstSemester: loadSavedResult(STORAGE_FIRST_SEMESTER_RESULT_KEY),
    secondSemester: loadSavedResult(STORAGE_SECOND_SEMESTER_RESULT_KEY),
    combined: loadSavedResult(STORAGE_COMBINED_GPA_RESULT_KEY),
  });

  const handleCourseChange = (semesterKey, index, field, value) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const updated = [...semester];
    updated[index][field] = value;
    setter(updated);
    localStorage.setItem(
      semesterKey === 'firstSemester' ? STORAGE_FIRST_SEMESTER_KEY : STORAGE_SECOND_SEMESTER_KEY,
      JSON.stringify(updated)
    );
  };

  const addCourse = (semesterKey) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const updated = [...semester, { code: '', unit: '', grade: '' }];
    setter(updated);
    localStorage.setItem(
      semesterKey === 'firstSemester' ? STORAGE_FIRST_SEMESTER_KEY : STORAGE_SECOND_SEMESTER_KEY,
      JSON.stringify(updated)
    );
  };

  const removeCourse = (semesterKey, index) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const updated = [...semester];
    updated.splice(index, 1);
    setter(updated);
    localStorage.setItem(
      semesterKey === 'firstSemester' ? STORAGE_FIRST_SEMESTER_KEY : STORAGE_SECOND_SEMESTER_KEY,
      JSON.stringify(updated)
    );
  };

  const calculateSemesterGPA = (semesterKey) => {
    const semesterCourses = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const calcResult = calculateGPA(semesterCourses);
    if (calcResult) {
      setResult((prev) => ({ ...prev, [semesterKey]: calcResult }));
      localStorage.setItem(
        semesterKey === 'firstSemester'
          ? STORAGE_FIRST_SEMESTER_RESULT_KEY
          : STORAGE_SECOND_SEMESTER_RESULT_KEY,
        JSON.stringify(calcResult)
      );
    }
    return calcResult;
  };

  const calculateCombinedGPA = () => {
    const allCourses = [...firstSemester, ...secondSemester];
    const calcResult = calculateGPA(allCourses);
    if (calcResult) {
      setResult((prev) => ({ ...prev, combined: calcResult }));
      localStorage.setItem(STORAGE_COMBINED_GPA_RESULT_KEY, JSON.stringify(calcResult));
    }
    return calcResult;
  };

  const calculateGPA = (courses) => {
    const filteredCourses = courses.filter(
      (course) =>
        course.code.trim() !== '' &&
        course.unit &&
        course.grade &&
        !isNaN(course.unit)
    );

    if (filteredCourses.length === 0) return null;

    const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

    let totalPoints = 0;
    let totalUnits = 0;

    filteredCourses.forEach((course) => {
      const point = gradePoints[course.grade.toUpperCase()];
      const unit = parseInt(course.unit);
      if (!isNaN(point) && !isNaN(unit)) {
        totalPoints += point * unit;
        totalUnits += unit;
      }
    });

    if (totalUnits === 0) return null;

    const gpa = totalPoints / totalUnits;

    let classification = '';
    if (gpa >= 4.5) classification = 'First Class';
    else if (gpa >= 3.5) classification = 'Second Class Upper';
    else if (gpa >= 2.4) classification = 'Second Class Lower';
    else if (gpa >= 1.5) classification = 'Third Class';
    else if (gpa >= 1.0) classification = 'Pass Degree';
    else classification = 'Fail';

    return {
      gpa,
      classification,
    };
  };

  const clearResult = (semesterKey) => {
    setResult((prev) => ({ ...prev, [semesterKey]: null }));
    localStorage.removeItem(
      semesterKey === 'firstSemester'
        ? STORAGE_FIRST_SEMESTER_RESULT_KEY
        : semesterKey === 'secondSemester'
        ? STORAGE_SECOND_SEMESTER_RESULT_KEY
        : STORAGE_COMBINED_GPA_RESULT_KEY
    );
  };

  const clearAllData = () => {
    setResult({ firstSemester: null, secondSemester: null, combined: null });
    setFirstSemester([{ code: '', unit: '', grade: '' }]);
    setSecondSemester([{ code: '', unit: '', grade: '' }]);
    localStorage.removeItem(STORAGE_FIRST_SEMESTER_RESULT_KEY);
    localStorage.removeItem(STORAGE_SECOND_SEMESTER_RESULT_KEY);
    localStorage.removeItem(STORAGE_COMBINED_GPA_RESULT_KEY);
    localStorage.removeItem(STORAGE_FIRST_SEMESTER_KEY);
    localStorage.removeItem(STORAGE_SECOND_SEMESTER_KEY);
  };

  return {
    firstSemester,
    secondSemester,
    result,
    setResult,
    handleCourseChange,
    addCourse,
    removeCourse,
    calculateSemesterGPA,
    calculateCombinedGPA,
    calculateGPA,
    clearResult,
    clearAllData,
  };
};