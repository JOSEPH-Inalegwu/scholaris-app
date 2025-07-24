import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordInput from './PasswordInput';
import { supabase } from '../../../supabaseClient';

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  const navigate = useNavigate();

  /* ------------------- LOGIN ------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setShakeEmail(false);
    setShakePassword(false);

    /* Quick client‑side checks */
    if (!email || !password) {
      const newErr = {};
      if (!email) {
        newErr.email = 'Email is required';
        setShakeEmail(true);
      }
      if (!password) {
        newErr.password = 'Password is required';
        setShakePassword(true);
      }
      setErrors(newErr);
      return;
    }

    setLoading(true);

    try {
      /* Sign‑in with password */
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      setLoading(false);

      if (error) {
        /* Check if it's an email not confirmed error using the correct error code */
        if (error.code === 'email_not_confirmed') {
          
          toast.error('Please confirm your email before logging in.');
          
          /* Show inline resend helper */
          setErrors({
            supabase: (
              <div className="text-center">
                <p className="text-red-600">Email not confirmed.</p>
                <button
                  className="mt-2 underline text-blue-600 hover:text-blue-800"
                  onClick={async () => {
                    const { error } = await supabase.auth.resend({ type: 'signup', email });
                    if (error) toast.error('❌ Failed to resend confirmation email.');
                    else toast.success('✅ Confirmation email resent!');
                  }}
                >
                  Resend confirmation email
                </button>
              </div>
            ),
          });
          return;
        }
        
        /* For all other errors (invalid credentials, user doesn't exist, etc.) */
        console.error('Login error:', error.message);
        toast.error('Invalid credentials. Please check your email and password.');
        setShakeEmail(true);
        setShakePassword(true);
        return;
      }

      const user = data?.user;

      /* Double check if email is verified (fallback) */
      if (!user?.email_confirmed_at && !user?.confirmed_at) {
        toast.error('Please confirm your email before logging in.');
        
        /* Show inline resend helper */
        setErrors({
          supabase: (
            <div className="text-center">
              <p className="text-red-600">Email not confirmed.</p>
              <button
                className="mt-2 underline text-blue-600 hover:text-blue-800"
                onClick={async () => {
                  const { error } = await supabase.auth.resend({ type: 'signup', email });
                  if (error) toast.error('❌ Failed to resend confirmation email.');
                  else toast.success('✅ Confirmation email resent!');
                }}
              >
                Resend confirmation email
              </button>
            </div>
          ),
        });
        
        /* Sign out the user since email is not confirmed */
        await supabase.auth.signOut();
        return;
      }

      /* 🎉 Email verified → proceed */
      toast.success('✅ Login successful!');
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen container flex items-center justify-center px-2 md:px-8 w-full py-20 my-2 md:my-0 md:py-0">
      <div className="w-full max-w-lg">
        <div className="text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-semibold text-[#222831]">Welcome Back!</h3>
          <p className="text-[#213448] mt-2">Please login to continue</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6">
          {/* Email Field */}
          <div className="relative mb-6">
            <label className="block mb-2 text-sm text-gray-800 mx-3">Email</label>
            <div
              className={`flex items-center border rounded-lg transition-all duration-300 ${
                errors.email
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300 focus-within:border-[#948979] focus-within:ring-1 focus-within:ring-[#222831]'
              } ${shakeEmail ? 'shake' : ''}`}
            >
              <img src="/icons/user.svg" alt="" className="w-5 h-5 mx-3" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full px-4 py-3 border-0 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1 ml-2">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-10">
            <label className="block mb-2 text-sm text-gray-800 mx-3">Password</label>
            <div className={shakePassword ? 'shake' : ''}>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                error={errors.password}
              />
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1 ml-2">{errors.password}</p>}
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm px-4 py-3 font-semibold tracking-wide text-[#ECEFCA] bg-[#222831]"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-10 text-gray-500">
          Don&#x27;t have an account?{' '}
          <button className="text-blue-500 font-medium hover:underline" onClick={onSwitchToSignup}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;