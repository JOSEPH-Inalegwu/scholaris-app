import React, { useState } from 'react'

const LoginForm = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
  
  return (
    <>
<div className="flex items-center px-6 w-full py-12 md:py-0 mt-5 md:mt-0 mx-4 md:mx-auto lg:w-3/8">
        <div className="flex-1">
          <div className="text-center md:text-left">
            <h3 className="mt-0 text-4xl md:text-4xl font-semibold md:font-bold text-[#066649]">Welcome Back!</h3>
            <p className='text-gray-500 mt-2'>Please login to continue</p>
          </div>

          <div className="mt-6">
            <form>
              {/* User ID Field */}
              <div className="relative mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-400 text-end mx-3">User ID</label>
                <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]">
                  <img src="src/assets/user.svg" alt="User icon" className="w-5 h-5 mx-2" />
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="userID"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                    className="block form-input w-full px-4 py-3 border-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-10">
                <label htmlFor="password" className="block mb-2 text-sm text-gray-400 text-end mx-3">Password</label>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 font-semibold py-3 tracking-wide text-white bg-[#066649] rounded-lg hover:bg-[#386155]"
                >
                  Login
                </button>
              </div>
            </form>


            <p className="mt-10 font-medium text-center text-gray-400">
              Don&#x27;t have an account yet? <a href="#" 
              className="text-[#0b9b70] focus:outline-none focus:underline hover:underline">Sign up</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginForm