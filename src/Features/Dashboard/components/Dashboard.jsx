import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../Utils/ProfileUtils';

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-indigo-600"
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
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14M5 6h14M5 18h14" />
      </svg>
    ),
    title: 'Quiz Mode',
    description: 'Engage in randomized or topic-specific quizzes to enhance retention and test your knowledge.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-purple-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9.75 17L8.25 17C7.00736 17 6 15.9926 6 14.75V7.25C6 6.00736 7.00736 5 8.25 5h7.5C16.9926 5 18 6.00736 18 7.25v7.5C18 15.9926 16.9926 17 15.75 17L14.25 17M9.75 17v2M14.25 17v2M9.75 19h4.5" />
      </svg>
    ),
    title: 'CBT Simulations',
    description: 'Practice in realistic CBT-style exam environments to build confidence and familiarity.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3v18h18M9 17V9M15 17v-5" />
      </svg>
    ),
    title: 'GPA Calculator',
    description: "Accurately calculate your GPA using NSUK's official grading system.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-red-600 animate-spin-slow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 4v1M12 19v1M4.93 4.93l.707.707M18.364 18.364l.707.707M4 12H3M21 12h-1M4.93 19.07l.707-.707M18.364 5.636l.707-.707" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
      </svg>
    ),
    title: 'AI Predictions',
    description: 'Coming soon: Leverage machine learning to predict likely exam questions.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 4v16l6-3 6 3V4z" />
      </svg>
    ),
    title: 'PDF Generator',
    description: 'Coming soon: Export your quiz results as professional, printable PDF reports.',
  },
];

const FeatureCard = ({ feature, index }) => {
  const handleClick = () => {
    console.log(`Clicked on ${feature.title}`);
  };

  return (
    <div
      className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-md transform hover:-translate-y-2 transition-all cursor-pointer duration-300 ease-out"
      style={{ animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards` }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Feature: ${feature.title}`}
    >
      <div className="flex items-center gap-4 mb-4">
        {feature.icon}
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
          {feature.title}
        </h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the same profile utility as Sidebar
  const { fetchUserProfile } = useUserProfile();

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      const { 
        username: fetchedUsername, 
        profilePicture: fetchedProfilePicture, 
        loading: profileLoading,
        error 
      } = await fetchUserProfile();
      
      if (error) {
        console.error('Dashboard profile error:', error);
      }
      
      setUserName(fetchedUsername);
      setProfilePicture(fetchedProfilePicture);
      setLoading(profileLoading);
    };

    loadUserProfile();
  }, []);

  return (
    <div className="min-h-screen mt-10 md:mt-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {loading
            ? 'Loading...'
            : userName
              ? `Welcome, ${userName}!`
              : 'Welcome to Scholaris!'}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl">
          Your AI-powered academic companion for smarter studying and exam preparation at NSUK.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;