import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const askScholarisAI = async (userPrompt) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Scholaris, an academic assistant built by INALEGWU Joseph Jonah. 
Only answer academic-related questions like summarizing notes, explaining difficult topics, preparing for exams, or helping with assignments. 
NEVER provide help on non-academic, harmful, unethical, or illegal topics. If unsure, remind the user you're limited to academic assistance.`
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    // ✅ Correct way to access Groq response:
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Scholaris AI (Groq) Full Error:', error?.response?.data || error.message);
    return 'Scholaris AI is temporarily unavailable. Please try again later.';
  }
};
