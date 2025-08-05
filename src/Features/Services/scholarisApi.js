import axios from 'axios';

const API_URL = 'https://apifreellm.com/api/chat';
const API_KEY = import.meta.env.VITE_API_FREE_LLM_KEY; 


export const askScholarisAI = async (userPrompt) => {
  const prompt = `
  You are Scholaris, an academic assistant built by INALEGWU Joseph Jonah.
  You must ONLY answer academic-related questions like: summarizing notes, explaining difficult topics, preparing for exams, or helping with assignments.
  NEVER provide help on non-academic, harmful, unethical, or illegal topics. If unsure, remind the user you're limited to academic assistance.

  User: ${userPrompt}
  `;

  try {
    const response = await axios.post(
      API_URL,
      { message: prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    return response.data.response; // ✅ CORRECT: The key is "response", not "reply"
  } catch (error) {
    console.error('Scholaris AI Error:', error?.response?.data || error.message);
    return 'Sorry, something went wrong while trying to respond. Try again later.';
  }
};
