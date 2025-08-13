import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { FiZap, FiSettings } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';
import { useAI } from '../../Hooks/useAI';

const AIGenerator = ({ onNext, onBack }) => {
  const { state, dispatch } = useStudyPlan();

  // Initialize preferences from context or defaults
  const [preferences, setPreferences] = useState(() => ({
    dailyHours: state.preferences.dailyHours || 4,
    preferredTimes: state.preferences.preferredTimes || ['morning'],
    breakIntervals: state.preferences.breakIntervals || 25,
    learningStyle: state.preferences.learningStyle || 'visual',
    studyEnvironment: state.preferences.studyEnvironment || 'quiet',
  }));

  // Sync local preferences state with context preferences on mount & when context changes
  useEffect(() => {
    setPreferences({
      dailyHours: state.preferences.dailyHours || 4,
      preferredTimes: state.preferences.preferredTimes || ['morning'],
      breakIntervals: state.preferences.breakIntervals || 25,
      learningStyle: state.preferences.learningStyle || 'visual',
      studyEnvironment: state.preferences.studyEnvironment || 'quiet',
    });
  }, [state.preferences]);

  const { generatePlan, loading, error } = useAI(
    import.meta.env.VITE_GROQ_API_KEY,
    'https://api.groq.com/openai/v1'
  );

  const handlePreferenceChange = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    dispatch({ type: 'SET_PREFERENCES', payload: { [key]: value } });
  };

  const handleTimeChange = (time, checked) => {
    let newTimes;
    if (checked) {
      newTimes = [...preferences.preferredTimes, time];
    } else {
      newTimes = preferences.preferredTimes.filter(t => t !== time);
    }
    setPreferences(prev => ({ ...prev, preferredTimes: newTimes }));
    dispatch({ type: 'SET_PREFERENCES', payload: { preferredTimes: newTimes } });
  };

  const generateWithAI = async () => {
    try {
      console.log('Generating AI plan with:', { 
        subjects: state.subjects, 
        goals: state.goals, 
        preferences 
      });
      
      const plan = await generatePlan(state.subjects, state.goals, preferences);
      if (plan) {
        dispatch({ type: 'SET_CURRENT_PLAN', payload: plan });
        onNext();
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    }
  };

  const skipAI = () => {
    // Preferences already updated by handlers
    const basicPlan = generateBasicPlan();
    dispatch({ type: 'SET_CURRENT_PLAN', payload: basicPlan });
    onNext();
  };

  const generateBasicPlan = () => {
    return {
      schedule: state.subjects.map((subject, index) => ({
        day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5],
        subject: subject.name,
        time: '09:00-11:00',
        type: 'study'
      })),
      dailyTasks: {
        general: ['Review notes', 'Practice exercises', 'Read materials']
      },
      milestones: [
        { week: 1, goal: 'Complete basic concepts' },
        { week: 2, goal: 'Practice intermediate topics' }
      ],
      recommendations: ['Stay consistent', 'Take regular breaks', 'Review regularly']
    };
  };

  return (
    <div className="w-full md:max-w-4xl mx-auto">
      {/* Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiSettings size={20} />
          Study Preferences
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Study Hours
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={preferences.dailyHours}
              onChange={(e) => handlePreferenceChange('dailyHours', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{preferences.dailyHours} hours</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Intervals (minutes)
            </label>
            <select
              value={preferences.breakIntervals}
              onChange={(e) => handlePreferenceChange('breakIntervals', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={25}>25 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Style
            </label>
            <select
              value={preferences.learningStyle}
              onChange={(e) => handlePreferenceChange('learningStyle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
              <option value="reading">Reading/Writing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Environment
            </label>
            <select
              value={preferences.studyEnvironment}
              onChange={(e) => handlePreferenceChange('studyEnvironment', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="quiet">Quiet</option>
              <option value="background-music">Background Music</option>
              <option value="social">Group Study</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Study Times
          </label>
          <div className="flex flex-wrap gap-3">
            {['morning', 'afternoon', 'evening', 'night'].map(time => (
              <label key={time} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.preferredTimes.includes(time)}
                  onChange={(e) => handleTimeChange(time, e.target.checked)}
                  className="mr-2"
                />
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">AI Error: {error}</p>
          <p className="text-red-500 text-sm mt-1">You can still create a basic plan below.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
      <button
        onClick={generateWithAI}
        disabled={loading}
        className="p-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <SkeletonTheme baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)">
            <div className="space-y-2">
              <Skeleton height={24} width="60%" />
              <Skeleton height={16} width="80%" />
            </div>
          </SkeletonTheme>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiZap size={24} />
              Generate AI Plan
            </div>
            <p className="text-sm opacity-90">
              Let AI create a personalized study schedule based on your preferences
            </p>
          </>
        )}
      </button>

<button
  onClick={() => toast.error("🚧 This feature is still in development!")}
  className="p-8 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border-2 border-dashed border-gray-300 transition-all"
>
  <div className="flex items-center justify-center gap-2 mb-2">
    <FiSettings size={24} />
    Create Basic Plan
  </div>
  <p className="text-sm">
    Skip AI and create a simple schedule manually
  </p>
</button>


      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AIGenerator;
