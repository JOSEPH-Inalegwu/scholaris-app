import React, { useEffect } from 'react';
import { FiTarget } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';
import { usePersistentState } from '../../Hooks/usePersistentState';

const GoalSetter = ({ onNext, onBack }) => {
  const { state, dispatch } = useStudyPlan();
  const [goals, setGoals] = usePersistentState('goals', {});

  // Initialize local goals from context or subjects
  useEffect(() => {
    if (state.goals.length) {
      const savedGoals = {};
      state.goals.forEach(goal => {
        savedGoals[goal.subjectId] = {
          target: goal.target || '',
          deadline: goal.deadline || '',
          priority: goal.priority || 'medium',
          currentLevel: goal.currentLevel || 'beginner',
        };
      });
      setGoals(savedGoals);
    } else if (state.subjects.length) {
      const initialGoals = {};
      state.subjects.forEach(subject => {
        initialGoals[subject.id] = {
          target: '',
          deadline: '',
          priority: 'medium',
          currentLevel: 'beginner'
        };
      });
      setGoals(initialGoals);
    }
  }, [state.subjects, state.goals, setGoals]);

  const updateGoal = (subjectId, field, value) => {
    setGoals(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    const goalsArray = Object.entries(goals).map(([subjectId, goal]) => ({
      subjectId: parseInt(subjectId, 10),
      subject: state.subjects.find(s => s.id === parseInt(subjectId, 10))?.name || '',
      ...goal
    }));

    dispatch({ type: 'SET_GOALS', payload: goalsArray });
    onNext();
  };

  const isValid = Object.values(goals).every(goal => {
    const target = goal?.target ? goal.target.trim() : '';
    return target && goal.deadline;
  });

  return (
    <div className="w-full md:max-w-4xl mx-auto">
      {/* <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiTarget className="text-blue-500" />
        Set Your Study Goals
      </h2> */}

      <div className="space-y-6 mb-8">
        {state.subjects.map(subject => (
          <div key={subject.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{subject.name}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g., Pass final exam, Complete certification"
                  value={goals[subject.id]?.target || ''}
                  onChange={e => updateGoal(subject.id, 'target', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={goals[subject.id]?.deadline || ''}
                  onChange={e => updateGoal(subject.id, 'deadline', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={goals[subject.id]?.priority || 'medium'}
                  onChange={e => updateGoal(subject.id, 'priority', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Level
                </label>
                <select
                  value={goals[subject.id]?.currentLevel || 'beginner'}
                  onChange={e => updateGoal(subject.id, 'currentLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next: AI Generation
        </button>
      </div>
    </div>
  );
};

export default GoalSetter;
