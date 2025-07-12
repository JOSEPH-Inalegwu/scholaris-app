import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFolder = path.resolve(__dirname, '../Features/QuizCBT/json');

const cleanQuestionText = (text) =>
  text.replace(/\s*\(Variant\s*\d+\)\s*$/i, '').trim();

async function uploadAllJsonFiles() {
  const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('⚠️  No JSON files found in:', jsonFolder);
    return;
  }

  for (const file of files) {
    try {
      const filePath = path.join(jsonFolder, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(raw);
      const questions = Array.isArray(jsonData) ? jsonData : jsonData.questions;

      if (!Array.isArray(questions)) {
        console.warn(`⚠️ Skipping ${file}: No valid question array found`);
        continue;
      }

      // 🔥 Clean each question text before uploading
      const cleanedQuestions = questions.map(q => ({
        ...q,
        question: cleanQuestionText(q.question),
      }));

      const { error, count } = await supabase
        .from('questions')
        .insert(cleanedQuestions, { count: 'exact' });

      if (error) {
        console.error(`❌ Error uploading ${file}:`, error.message);
      } else {
        const courseCodes = [...new Set(cleanedQuestions.map(q => q.course_code))];
        console.log(`✅ Uploaded ${count ?? cleanedQuestions.length} question(s) from ${file}`);
        console.log(`📘 Courses inserted from ${file}: ${courseCodes.join(', ')}`);
      }
    } catch (err) {
      console.error(`❌ Failed processing ${file}:`, err.message);
    }
  }
}

uploadAllJsonFiles();
