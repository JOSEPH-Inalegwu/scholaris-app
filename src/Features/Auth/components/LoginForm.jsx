import React from 'react';
import PasswordInput from './PasswordInput';

const LoginForm = ({
  onSwitchToSignup,
  userID,
  password,
  onUserIDChange,
  onPasswordChange,
  onSubmit,
  errors = {},
  shakeUserID = false,
  shakePassword = false
}) => {
  return (
    <div className="h-screen container justify-center flex items-center px-2 md:px-8 w-full py-20 my-2 md:my-0 md:py-0">
      <div className="flex-1">
        <div className="text-center md:text-left">
          <h3 className="mt-0 text-3xl md:text-4xl font-semibold md:font-bold text-[#222831]">Welcome Back!</h3>
          <p className='text-[#213448] mt-2'>Please login to continue</p>
        </div>

        <div className="mt-6">
          <form onSubmit={onSubmit}>
            {/* User ID Field */}
            <div className="relative mb-6">
              <label htmlFor="email" className="block mb-2 text-sm text-gray-800 text-end mx-3">User ID</label>
              <div
                className={`flex items-center border rounded-lg transition-all duration-300 ${
                  errors.userID
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300 focus-within:border-[#948979] focus-within:ring-1 focus-within:ring-[#222831]'
                } ${shakeUserID ? 'shake' : ''}`}
              >
                <img src="src/assets/icons/user.svg" alt="" className='w-5 h-5 mx-3' />
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="userID"
                  value={userID}
                  onChange={(e) => onUserIDChange(e.target.value)}
                  className="block form-input w-full px-4 py-3 border-0 focus:outline-none"
                />
              </div>
              {errors.userID && (
                <p className="text-sm text-red-500 mt-1 ml-2">{errors.userID}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-10">
              <label htmlFor="password" className="block mb-2 text-sm text-gray-800 text-end mx-3">Password</label>
              <div className={`${shakePassword ? 'shake' : ''}`}>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Password"
                  error={errors.password}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 ml-2">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full rounded-sm px-4 font-semibold py-3 tracking-wide text-[#ECEFCA] bg-[#222831] cursor-pointer"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-sm md:text-md mt-10 text-center text-gray-500">
            Don&#x27;t have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-500 font-medium focus:outline-none focus:underline hover:underline"
            >
              Sign up
            </button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
