import { supabase } from "../supabaseClient";

export const fetchQuestions = async (courseCode, level) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('course_code', courseCode)
    .eq('level', level);

  if (error) {
    console.error('Error fetching questions:', error.message);
    return [];
  }

  return data;
};