import React, { useState } from 'react';
import { FiArrowLeft, FiHome, FiTarget, FiBook, FiCpu, FiCalendar } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';
import SubjectSelector from './SubjectSelector';
import GoalSetter from './GoalSetter';
import AIGenerator from './AIGenerator';
import ScheduleView from './ScheduleView';
import PlansList from './PlansList';

const steps = {
  dashboard: { title: "📊 Dashboard", icon: <FiHome size={22} /> },
  landing: { title: "🧠 Smart Study Planner", icon: <FiHome size={22} /> },
  viewPlans: { title: "My Plans", icon: <FiCalendar size={22} /> },
  planDetail: { title: "Plan Details", icon: <FiCalendar size={22} /> },
  selectSubjects: { title: "Step 1: Select Your Subjects", icon: <FiBook size={22} /> },
  setGoals: { title: "Step 2: Set Your Study Goals", icon: <FiTarget size={22} /> },
  aiGenerate: { title: "Step 3: AI Study Plan Generation", icon: <FiCpu size={22} /> },
  scheduleView: { title: "Step 4: Your Schedule Table", icon: <FiCalendar size={22} className='text-green-500' /> },
};

const SmartStudyPlanner = () => {
  const [currentStep, setCurrentStep] = useState("landing");
  const { dispatch } = useStudyPlan();

  const goTo = (step) => setCurrentStep(step);

  const handleSavePlan = (plan) => {
    dispatch({ type: 'SAVE_PLAN', payload: plan });
    goTo('viewPlans');
  };

  const handleViewPlan = (plan) => {
    dispatch({ type: 'LOAD_PLAN', payload: plan });
    goTo('planDetail');
  };

  return (
    <div className="min-h-screen mt-10 md:mt-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="w-full max-w-none mb-12">
          <div className="flex items-center gap-4 mb-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in-down">
            {currentStep !== "landing" && currentStep !== "dashboard" && (
              <button
                onClick={() => goTo("landing")}
                className="p-2 text-gray-500 hover:text-white hover:bg-amber-500 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
                aria-label="Go back to landing"
              >
                <FiArrowLeft size={22} />
              </button>
            )}
            <span className="text-amber-500 transform transition-transform duration-300 hover:scale-110">
              {steps[currentStep]?.icon}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {steps[currentStep]?.title}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full animate-fade-in-up">
          {currentStep === "landing" && (
            <div className="w-full text-left space-y-8">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 animate-fade-in-up">
                  Welcome to Smart Study Planner 🧠
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl animate-fade-in-up animation-delay-300">
                  Create personalized study plans with AI assistance for smarter studying and exam preparation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div
                  className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition-all cursor-pointer duration-500 ease-out overflow-hidden"
                  style={{ 
                    animation: `fadeInUp 0.6s ease-out 0ms forwards`,
                    opacity: 0,
                    transform: 'translateY(30px)'
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => goTo("viewPlans")}
                  onKeyDown={(e) => e.key === 'Enter' && goTo("viewPlans")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-300 group-hover:shadow-md">
                          📋
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-all duration-300">
                          View My Study Plans
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      Access and manage your existing study plans, track progress, and review schedules.
                    </p>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  </div>
                </div>
                
                <div
                  className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition-all cursor-pointer duration-500 ease-out overflow-hidden"
                  style={{ 
                    animation: `fadeInUp 0.6s ease-out 150ms forwards`,
                    opacity: 0,
                    transform: 'translateY(30px)'
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => goTo("selectSubjects")}
                  onKeyDown={(e) => e.key === 'Enter' && goTo("selectSubjects")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-300 group-hover:shadow-md">
                          ➕
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-all duration-300">
                          Create New Study Plan
                        </h3>
                      </div>
                      
                      <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full animate-pulse group-hover:animate-none transition-all duration-300">
                        NEW
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      Start from scratch with AI-powered plan generation tailored to your subjects and goals.
                    </p>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "viewPlans" && (
            <div className="w-full animate-slide-in-left">
              <PlansList
                onViewPlan={handleViewPlan}
                onCreateNew={() => goTo("selectSubjects")}
              />
            </div>
          )}

          {currentStep === "selectSubjects" && (
            <div className="w-full animate-slide-in-right">
              <SubjectSelector onNext={() => goTo("setGoals")} />
            </div>
          )}

          {currentStep === "setGoals" && (
            <div className="w-full animate-slide-in-left">
              <GoalSetter
                onNext={() => goTo("aiGenerate")}
                onBack={() => goTo("selectSubjects")}
              />
            </div>
          )}

          {currentStep === "aiGenerate" && (
            <div className="w-full animate-slide-in-right">
              <AIGenerator
                onNext={() => goTo("scheduleView")}
                onBack={() => goTo("setGoals")}
              />
            </div>
          )}

          {currentStep === "scheduleView" && (
            <div className="w-full animate-slide-in-left">
              <ScheduleView
                onSave={handleSavePlan}
                onBack={() => goTo("aiGenerate")}
              />
            </div>
          )}

          {currentStep === "planDetail" && (
            <div className="w-full animate-fade-in-up">
              <div className="group relative bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-md hover:shadow-2xl transform transition-all duration-500 ease-out">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-6">
                     Your Study Plan Overview 📚
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    View your study plan progress, schedule, and resources.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => goTo("scheduleView")}
                      className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-semibold text-lg border border-transparent hover:border-gray-200 shadow-md hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1"
                    >
                      📝 Edit Schedule
                    </button>
                    <button
                      onClick={() => goTo("viewPlans")}
                      className="w-full py-4 px-6 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-semibold text-lg hover:border-amber-500 hover:text-amber-600 shadow-md hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1"
                    >
                      ← Back to Plans
                    </button>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SmartStudyPlanner;