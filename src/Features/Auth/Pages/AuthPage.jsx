import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';  // Make sure Signup imports the updated SignupForm

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitchForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <>
      <div className="bg-white md:min-h-screen flex justify-center">
        {/* Image Section */}
        <div className="hidden bg-cover lg:block lg:w-2/4 h-screen">
          <div className="relative flex items-center h-full px-20 overflow-hidden">
            {/* Left section background image */}
            <div className="absolute inset-0 bg-[url('src/assets/images/gown5.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[#000000] opacity-50" />
            <div className="space-y-14 relative z-10">
              <div className="max-w-2xl px-8 py-7 rounded-lg shadow-md bg-[#222831]">
                <div className="mt-2 space-y-3">
                  <img src="src/assets/icons/graduation-cap.svg" alt="" className="w-15 h-15 mx-auto" />
                  <h4 className="text-2xl font-bold text-white">Welcome to the Scholaris Portal</h4>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Empowering students at <b>Nasarawa State University</b> to excel in their studies.
                    Access a comprehensive collection of past questions to enhance your learning experience.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl px-8 py-6 rounded-lg shadow-md bg-[#222831]">
                <div className="mt-2">
                  <img src="src/assets/icons/quote-open-editor-svgrepo-com.svg" alt="" className="w-5 h-5 mx-auto text-white" />
                  <h2 className="font-semibold italic text-center text-white">Practice, Progress, Succeed.</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login or Signup Form */}
        <div className="w-full lg:w-2/4 flex items-center justify-center px-4">
          {isSignup ? (
            <Signup onSwitchToLogin={handleSwitchForm} />
          ) : (
            <Login onSwitchToSignup={handleSwitchForm} />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
