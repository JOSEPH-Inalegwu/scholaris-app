import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY; 
export const supabase = createClient(supabaseUrl, supabaseKey);

// Normalizes "SEN 211" to "SEN211"
const normalize = str => str.replace(/\s+/g, '').toUpperCase();

export const fetchQuestions = async (courseCode, level) => {

  const normalizedCode = normalize(courseCode);

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', level); 

  if (error) {
    console.error('❌ Error fetching questions:', error.message);
    return [];
  }

  const filtered = data.filter(q =>
    normalize(q.course_code) === normalizedCode
  );

  return filtered;
};
