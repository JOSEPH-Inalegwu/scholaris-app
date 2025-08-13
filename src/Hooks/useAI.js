import { useState } from 'react';
import { AIService } from '../Features/Services/AIService';

export const useAI = (apiKey, baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiService] = useState(() => new AIService(apiKey, baseUrl));

  const generatePlan = async (subjects, goals, preferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await aiService.generateStudyPlan(subjects, goals, preferences);
      return plan;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generatePlan, loading, error };
};
