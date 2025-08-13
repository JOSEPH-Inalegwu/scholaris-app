import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';

const SubjectSelector = ({ onNext }) => {
  const { state, dispatch } = useStudyPlan();
  const [newSubject, setNewSubject] = useState({ name: '', difficulty: 'medium' });

  const addSubject = () => {
    const trimmedName = newSubject.name.trim();
    if (!trimmedName) return;

    if (state.subjects.some(sub => sub.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Subject already added.");
      return;
    }

    const updatedSubjects = [
      ...state.subjects,
      { ...newSubject, name: trimmedName, id: Date.now() }
    ];
    dispatch({ type: 'SET_SUBJECTS', payload: updatedSubjects });
    setNewSubject({ name: '', difficulty: 'medium' });
  };

  const removeSubject = (id) => {
    const updatedSubjects = state.subjects.filter(subject => subject.id !== id);
    dispatch({ type: 'SET_SUBJECTS', payload: updatedSubjects });
  };

  return (
    <div className="w-full md:max-w-4xl mx-auto lg:px-8">      
      {/* Add Subject Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Subject name (e.g., MTH221, COS212)"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            onKeyPress={(e) => e.key === 'Enter' && addSubject()}
          />
          <select
            value={newSubject.difficulty}
            onChange={(e) => setNewSubject({ ...newSubject, difficulty: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={addSubject}
            disabled={!newSubject.name.trim()}
            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto ${
              newSubject.name.trim()
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Add Subject"
          >
            <FiPlus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Selected Subjects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {state.subjects.map((subject) => (
          <div 
            key={subject.id} 
            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{subject.name}</h3>
              <span className={`text-sm px-2 py-1 rounded-full mt-1 inline-block ${
                subject.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                subject.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {subject.difficulty}
              </span>
            </div>
            <button
              onClick={() => removeSubject(subject.id)}
              aria-label={`Remove ${subject.name}`}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <FiX size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Next Button */}
      {state.subjects.length > 0 && (
        <button
          onClick={onNext}
          className="w-full py-4 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold transition-all duration-200"
        >
          Next: Set Goals ({state.subjects.length} subjects selected)
        </button>
      )}
    </div>
  );
};

export default SubjectSelector;
