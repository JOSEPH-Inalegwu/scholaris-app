import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usePersistentState } from '../../Hooks/usePersistentState'; 

const StudyPlanContext = createContext();

const initialState = {
  subjects: [],
  goals: [],
  preferences: {
    dailyHours: 4,
    preferredTimes: ['morning'],
    breakIntervals: 25,
    learningStyle: 'visual'
  },
  currentPlan: null,
  savedPlans: []
};

function studyPlanReducer(state, action) {
  switch (action.type) {
    case 'SET_SUBJECTS':
      return { ...state, subjects: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case 'SET_CURRENT_PLAN':
      return { ...state, currentPlan: action.payload };
    case 'SAVE_PLAN':
      return { 
        ...state, 
        savedPlans: [...state.savedPlans, action.payload],
        currentPlan: action.payload
      };
    case 'LOAD_PLAN':
      return { ...state, currentPlan: action.payload };
    case 'DELETE_PLAN':
      return {
        ...state,
        savedPlans: state.savedPlans.filter(plan => plan.id !== action.payload),
        currentPlan: state.currentPlan?.id === action.payload ? null : state.currentPlan
      };
    default:
      return state;
  }
}


export const StudyPlanProvider = ({ children }) => {
  // Persisted state hook to hold full reducer state
  const [persistedState, setPersistedState] = usePersistentState('studyPlanState', initialState);

  // Use persistedState as initial state for reducer
  const [state, dispatch] = useReducer(studyPlanReducer, persistedState);

  // Sync reducer state to persisted state on every change
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  return (
    <StudyPlanContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyPlanContext.Provider>
  );
};

export const useStudyPlan = () => {
  const context = useContext(StudyPlanContext);
  if (!context) {
    throw new Error('useStudyPlan must be used within StudyPlanProvider');
  }
  return context;
};
