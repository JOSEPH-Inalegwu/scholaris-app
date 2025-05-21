import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, placeholder, id }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword(prev => !prev);

  return (
    <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        className="block form-input w-full px-4 py-3 border-0 focus:outline-none"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="px-3 text-gray-500 focus:outline-none cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Eye Icon */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
          
        ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Eye Off Icon */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4-9-9a8.96 8.96 0 011.363-4.757m1.237-1.237a9.96 9.96 0 0113.647 13.647M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
