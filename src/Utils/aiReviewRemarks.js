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
        You will always respond ONLY with a valid JSON object — no explanations, no extra text.
        The JSON must have exactly these two keys:
        "remark": short exam performance label (max 10 words, can include emoji)
        "message": 1–4 motivational sentences. Each time you respond, vary the wording and style so no two messages are identical, even for the same score.
        Example:
        {"remark": "Excellent 🎉", "message": "Great work, Alex! Keep practicing to stay on top."}`
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.9,
        max_tokens: 200
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const aiText = response.data.choices[0].message.content.trim();
    console.log("🔍 Scholaris AI Raw Output:", aiText);
    return aiText;
  } catch (error) {
    console.error('Scholaris AI (Groq) Error:', error?.response?.data || error.message);
    return null;
  }
};
