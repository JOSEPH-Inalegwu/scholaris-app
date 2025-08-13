import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col space-y-6">
      {/* Marquee */}
      <div className="bg-amber-400 text-black py-10 overflow-hidden whitespace-nowrap relative">
        <div
          className="absolute will-change-transform animate-marquee"
          style={{ whiteSpace: 'nowrap' }}
        >
          🚧 This page is still in development — Please check back soon! 🚧&nbsp;&nbsp;&nbsp;
          🚧 This page is still in development — Please check back soon! 🚧&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          {/* Illustration */}
          <img
            src="/pageNotFound.png"
            alt="Page Not Found Illustration"
            className="mx-auto mb-0 w-64 md:w-96 animate-fadeIn"
            style={{ animationDuration: '1.5s' }}
          />
          <a href="https://www.flaticon.com/free-icons/page-not-found" title="page-not-found icons" className='text-sm  text-gray-400'>Page-not-found icons created by Roundicons Premium - Flaticon</a>

          <h1 className="text-7xl md:text-9xl font-bold text-black my-4 opacity-0 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6 opacity-0 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto opacity-0 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            It looks like you're lost in the digital wilderness. Let's get you back on track!
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors duration-300 animate-pulse"
          >
            <FiArrowLeft className="mr-2 animate-bounce" size={20} />
            Back to Home
          </a>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
