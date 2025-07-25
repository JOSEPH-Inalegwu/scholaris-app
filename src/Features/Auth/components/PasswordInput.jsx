import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, placeholder, id, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShow = () => setShowPassword(prev => !prev);

  return (
    <div className={`flex items-center border rounded-lg ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus-within:border-[#948979] focus-within:ring-1 focus-within:ring-[#222831]'}`}>
      <img src="/icons/lock.svg" alt="" className='w-5 h-5 mx-3' />
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        className="block form-input w-full px-4 py-3 border-0 focus:outline-none"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="px-3 text-gray-800 focus:outline-none cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        <img
          src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
          alt=""
          className='w-6 h-6'
        />
      </button>
    </div>
  );
};

export default PasswordInput;
