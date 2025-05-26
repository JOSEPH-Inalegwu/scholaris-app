export const gradeToPoint = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  };
  
  export function calculateSemesterGPA(courses) {
    let tcp = 0; // Total Credit Points
    let tcr = 0; // Total Credit Registered
  
    courses.forEach(({ creditUnit, grade }) => {
      const point = gradeToPoint[grade.toUpperCase()] || 0;
      tcp += creditUnit * point;
      tcr += creditUnit;
    });
  
    const gpa = tcr === 0 ? 0 : parseFloat((tcp / tcr).toFixed(2));
    return { gpa, tcp, tcr };
  }
  
  export function calculateCGPA(semesters) {
    let totalTCP = 0;
    let totalTCR = 0;
  
    semesters.forEach(({ tcp, tcr }) => {
      totalTCP += tcp;
      totalTCR += tcr;
    });
  
    const cgpa = totalTCR === 0 ? 0 : parseFloat((totalTCP / totalTCR).toFixed(2));
    return cgpa;
  }
  
  export function getClassDegree(cgpa) {
    if (cgpa >= 4.5) return 'First Class';
    if (cgpa >= 3.5) return 'Second Class Upper';
    if (cgpa >= 2.4) return 'Second Class Lower';
    if (cgpa >= 1.5) return 'Third Class';
    if (cgpa >= 1.0) return 'Pass Degree';
    return 'Fail';
  }
  