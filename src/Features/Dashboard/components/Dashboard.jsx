import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../../../Utils/ProfileUtils';
import { Features, getActiveFeatures } from '../Features';

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log(`Clicked on ${feature.title}`);
    // You can add navigation logic here
    // Example: navigate(feature.route);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-2xl transform hover:-translate-y-3 transition-all cursor-pointer duration-500 ease-out overflow-hidden"
      style={{ 
        animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`,
        opacity: 0,
        transform: 'translateY(30px)'
      }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Feature: ${feature.title}`}
    >
      {/* Animated background gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
      />
      
      {/* Floating particles effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-300 group-hover:shadow-md">
              {feature.icon}
            </div>
            <h3 className={`text-xl font-semibold text-gray-900 ${feature.hoverColor} transition-all duration-300`}>
              {feature.title}
            </h3>
          </div>
          
          {feature.badge && (
            <span className={`px-3 py-1 text-xs font-medium bg-gradient-to-r ${feature.gradient} text-white rounded-full animate-pulse group-hover:animate-none transition-all duration-300`}>
              {feature.badge}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {feature.description}
        </p>
        
        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use the same profile utility as Sidebar
  const { fetchUserProfile } = useUserProfile();

  // Get active features
  const activeFeatures = getActiveFeatures();

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

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen mt-10 md:mt-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-12 text-left">
          <div className="flex items-center gap-4 mb-4">
            {/* {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile"
                className="hidden w-16 h-16 rounded-full border-4 border-white shadow-lg transition-transform duration-300 transform hover:scale-110"
              />
            )} */}
            <div>
              <p className="text-sm text-gray-500 font-medium">
                {getGreeting()}, it's {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight animate-fade-in-up">
                {loading
                  ? (
                    <span className="inline-flex items-center gap-3">
                      Loading
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </span>
                  )
                  : userName
                    ? `Welcome back, ${userName}! 👋`
                    : 'Welcome to Scholaris! 🚀'}
              </h1>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl animate-fade-in-up animation-delay-300">
            Your AI-powered academic companion for smarter studying and exam preparation at NSUK.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activeFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;