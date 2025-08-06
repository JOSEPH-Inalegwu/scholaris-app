import React, { useState, useRef } from 'react';
import PasswordInput from './PasswordInput';
import { supabase } from '../../../supabaseClient';
import { toast } from 'react-toastify';

const SignupForm = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);

  // const departmentRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const termsRef = useRef(null);

  const isStep1Valid = fullName && email && username;

  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const pwdRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    // if (!department) newErrors.department = 'Department is required';
    if (!password) newErrors.passwordEmpty = 'Password cannot be empty';
    else if (!pwdRegex.test(password)) newErrors.passwordInvalid = 'Must contain 1 uppercase, 1 number, 8+ characters';
    if (!confirmPassword) newErrors.confirmPasswordEmpty = 'Please confirm your password';
    if (password && confirmPassword && password !== confirmPassword) newErrors.passwordMatch = 'Passwords do not match';
    if (!acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms and conditions';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      // if (newErrors.department) departmentRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (newErrors.passwordEmpty || newErrors.passwordInvalid) passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (newErrors.confirmPasswordEmpty || newErrors.passwordMatch) confirmRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (newErrors.acceptedTerms) termsRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullName, username, department }
        }
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const { user } = data;
      toast.success('🎉 Account created! Check your email to confirm.');
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        setSuccess(false);
        onSwitchToLogin();
      }, 6000);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
      setLoading(false);
    }
  }; 

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      toast.error('❌ Failed to resend confirmation email.');
    } else {
      setResent(true);
      toast.success('✅ Confirmation email resent!');
    }
  };

  return (
    <div className="h-screen container flex items-center justify-center px-2 md:px-8 w-full py-20">
      <div className="w-full max-w-lg">
        {success ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Account Created!</h2>
            <p className="text-gray-800 mb-2">Please confirm your email before logging in.</p>
            <p className="text-sm text-gray-600 mb-4">
              A confirmation link was sent to <strong>{email}</strong>.
            </p>

            {!resent ? (
              <button className="text-blue-600 underline hover:text-blue-800" onClick={handleResend}>
                Resend confirmation email
              </button>
            ) : (
              <p className="text-sm text-green-600">Confirmation email resent ✅</p>
            )}

            <p className="mt-6 text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-semibold text-center mb-10 text-[#222831]">
              Create a new account
            </h2>

            <form onSubmit={handleSignup}>
              {step === 1 && (
                <>
                  <InputField label="Full Name *" value={fullName} onChange={setFullName} placeholder="James Brown" />
                  <InputField label="Username *" value={username} onChange={setUsername} placeholder="e.g james123" />
                  <InputField label="Email Address *" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    onClick={() => setStep(2)}
                    className={`w-full px-4 py-3 mt-4 text-white rounded-lg font-semibold transition ${
                      isStep1Valid ? 'bg-[#222831] hover:bg-[#393E46]' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>

                  <p className="text-sm text-center mt-5 text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} type="button" className="text-blue-500 hover:underline">
                      Login
                    </button>
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  {/* <div ref={departmentRef}>
                    <InputField label="Department *" value={department} onChange={setDepartment} placeholder="Computer Science" />
                    {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
                  </div> */}

                  <div className="mb-6" ref={passwordRef}>
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      className={(errors.passwordEmpty || errors.passwordInvalid || errors.passwordMatch) ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must contain 1 uppercase, 1 number, 8+ characters.</p>
                    {errors.passwordEmpty && <p className="text-sm text-red-600 mt-1">{errors.passwordEmpty}</p>}
                    {errors.passwordInvalid && <p className="text-sm text-red-600 mt-1">{errors.passwordInvalid}</p>}
                  </div>

                  <div className="mb-6" ref={confirmRef}>
                    <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      className={(errors.confirmPasswordEmpty || errors.passwordMatch) ? 'border-red-500' : ''}
                    />
                    {errors.confirmPasswordEmpty && <p className="text-sm text-red-600 mt-1">{errors.confirmPasswordEmpty}</p>}
                    {errors.passwordMatch && <p className="text-sm text-red-600 mt-1">{errors.passwordMatch}</p>}
                  </div>

                  <div className="mb-4 flex items-center" ref={termsRef}>
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mr-2" />
                    <span className="text-sm text-gray-600">
                      I agree to Scholari's{' '}
                      <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a>.
                    </span>
                  </div>
                  {errors.acceptedTerms && <p className="text-sm text-red-600 mt-1">{errors.acceptedTerms}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 text-white bg-[#222831] rounded-lg hover:bg-[#393E46] font-semibold flex justify-center items-center"
                  >
                    {loading
                      ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      : 'Register'}
                  </button>

                  <p className="text-sm text-center mt-5 text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} type="button" className="text-blue-500 hover:underline">Login</button>
                  </p>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

/* ---- Reusable Input ------- */
const InputField = ({ label, value, onChange, type = "text", placeholder, className = "" }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="border border-gray-300 rounded-lg focus-within:border-[#948979] focus-within:ring-1 focus-within:ring-[#222831]">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input w-full px-4 py-3 border-0 focus:outline-none ${className}`}
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

export default SignupForm;