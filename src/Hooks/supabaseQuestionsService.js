import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY; 
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch Departments
export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Error fetching departments:', error.message);
    return [];
  }
  return data;
};

// Fetch Levels
export const getLevels = async () => {
  const { data, error } = await supabase
    .from('levels')
    .select('id, name')
    .order('id');

  if (error) {
    console.error('❌ Error fetching levels:', error.message);
    return [];
  }
  return data;
};

// Fetch Semesters
export const getSemesters = async () => {
  const { data, error } = await supabase
    .from('semesters')
    .select('id, name')
    .order('id');

  if (error) {
    console.error('❌ Error fetching semesters:', error.message);
    return [];
  }
  return data;
};

// Fetch Courses by Department, Level & Semester
export const getCourses = async (departmentId, levelId, semesterId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name, code')
    .eq('department_id', departmentId)
    .eq('level_id', levelId)
    .eq('semester_id', semesterId)
    .order('name');

  if (error) {
    console.error('❌ Error fetching courses:', error.message);
    return [];
  }
  return data;
};

// Fetch Questions by Course
export const fetchQuestions = async (courseId, limit = 50) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('course_id', courseId)
    .order('id') // Or use .order('RANDOM()') in Postgres directly
    .limit(limit);

  if (error) {
    console.error('❌ Error fetching questions:', error.message);
    return [];
  }

  return data;
};
