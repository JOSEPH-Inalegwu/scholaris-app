import React from 'react';

export const Features = [
  {
    id: 'past-questions',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0017.5 2h-11A2.5 2.5 0 004 4.5v15z" />
        <path d="M4 6h16" />
      </svg>
    ),
    title: 'Past Questions',
    description: "Access NSUK's authentic past questions organized by department, course, and level for effective exam preparation.",
    gradient: 'from-indigo-500 to-purple-600',
    hoverColor: 'group-hover:text-indigo-600',
    badge: null,
    route: '/past-questions',
    isActive: true,
  },
  {
    id: 'quiz-mode',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Quiz Mode',
    description: 'Engage in randomized or topic-specific quizzes to enhance retention and test your knowledge with instant AI feedback.',
    gradient: 'from-amber-500 to-orange-600',
    hoverColor: 'group-hover:text-amber-600',
    badge: 'AI Enhanced',
    route: '/quiz',
    isActive: true,
  },
  {
    id: 'cbt-simulations',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9.75 17L8.25 17C7.00736 17 6 15.9926 6 14.75V7.25C6 6.00736 7.00736 5 8.25 5h7.5C16.9926 5 18 6.00736 18 7.25v7.5C18 15.9926 16.9926 17 15.75 17L14.25 17M9.75 17v2M14.25 17v2M9.75 19h4.5" />
      </svg>
    ),
    title: 'CBT Simulations',
    description: 'Practice in realistic CBT-style exam environments with AI-powered performance analysis and personalized recommendations.',
    gradient: 'from-purple-500 to-pink-600',
    hoverColor: 'group-hover:text-purple-600',
    badge: 'Smart Analysis',
    route: '/cbt-simulation',
    isActive: true,
  },
  {
    id: 'gpa-calculator',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-600 transition-all duration-500 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'GPA Calculator',
    description: "Accurately calculate your GPA using NSUK's official grading system with semester-by-semester tracking.",
    gradient: 'from-cyan-500 to-teal-600',
    hoverColor: 'group-hover:text-cyan-600',
    badge: null,
    route: '/gpa-calculator',
    isActive: true,
  },
  {
    id: 'ai-study-assistant',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'AI Study Assistant',
    description: 'Get personalized study recommendations, instant doubt clarification, and smart insights from your AI companion.',
    gradient: 'from-emerald-500 to-green-600',
    hoverColor: 'group-hover:text-emerald-600',
    badge: 'Live',
    route: '/ai-assistant',
    isActive: true,
  },
  {
    id: 'performance-analytics',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-rose-600 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Performance Analytics',
    description: 'Track your progress with detailed analytics, performance trends, and AI-generated study recommendations.',
    gradient: 'from-rose-500 to-red-600',
    hoverColor: 'group-hover:text-rose-600',
    badge: 'Advanced',
    route: '/analytics',
    isActive: true,
  },
];

// Feature categories for better organization
export const featureCategories = {
  study: {
    title: 'Study Tools',
    features: ['past-questions', 'quiz-mode', 'ai-study-assistant']
  },
  assessment: {
    title: 'Assessment & Testing',
    features: ['cbt-simulations', 'performance-analytics']
  },
  utilities: {
    title: 'Academic Utilities',
    features: ['gpa-calculator']
  }
};

// Helper function to get features by category
export const getFeaturesByCategory = (categoryKey) => {
  const category = featureCategories[categoryKey];
  if (!category) return [];
  
  return Features.filter(feature => category.features.includes(feature.id));
};

// Helper function to get active features only
export const getActiveFeatures = () => {
  return Features.filter(feature => feature.isActive);
};

// Helper function to get feature by ID
export const getFeatureById = (id) => {
  return Features.find(feature => feature.id === id);
};

export default Features;