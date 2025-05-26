import { useState } from 'react';

export const useGPA = () => {
  const [firstSemester, setFirstSemester] = useState([{ code: '', unit: '', grade: '' }]);
  const [secondSemester, setSecondSemester] = useState([{ code: '', unit: '', grade: '' }]);
  const [result, setResult] = useState(null);

  const handleCourseChange = (semesterKey, index, field, value) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const updated = [...semester];
    updated[index][field] = value;
    setter(updated);
  };

  const addCourse = (semesterKey) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    setter([...semester, { code: '', unit: '', grade: '' }]);
  };

  const removeCourse = (semesterKey, index) => {
    const setter = semesterKey === 'firstSemester' ? setFirstSemester : setSecondSemester;
    const semester = semesterKey === 'firstSemester' ? firstSemester : secondSemester;
    const updated = [...semester];
    updated.splice(index, 1);
    setter(updated);
  };

  // Calculate CGPA for both semesters combined
  const calculate = () => {
    const allCourses = [...firstSemester, ...secondSemester].filter(
      (course) =>
        course.code.trim() !== '' &&
        course.unit &&
        course.grade &&
        !isNaN(course.unit)
    );
    if (allCourses.length === 0) return null;

    return calculateGPA(allCourses);
  };

  // Calculate GPA for a single semester
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

  return {
    firstSemester,
    secondSemester,
    result,
    setResult,
    handleCourseChange,
    addCourse,
    removeCourse,
    calculate,
    calculateGPA, // export new function
  };
};
