import React from 'react';
import { FiCalendar, FiClock, FiTrash2, FiEye } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';

const PlansList = ({ onViewPlan, onCreateNew }) => {
  const { state, dispatch } = useStudyPlan();

  const deletePlan = (planId) => {
    dispatch({ type: 'DELETE_PLAN', payload: planId });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Study Plans</h2>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold"
        >
          Create New Plan
        </button>
      </div>

      {state.savedPlans.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <FiCalendar size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Study Plans Yet</h3>
          <p className="text-gray-500 mb-6">Create your first personalized study plan to get started</p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.savedPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} />
                  Created: {formatDate(plan.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  {plan.schedule?.length || 0} study sessions/week
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Subjects:</div>
                <div className="flex flex-wrap gap-1">
                  {plan.subjects?.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                  {plan.subjects?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{plan.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onViewPlan(plan)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <FiEye size={16} />
                View Plan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansList;
