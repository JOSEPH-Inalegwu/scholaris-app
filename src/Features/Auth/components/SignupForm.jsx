import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput'; 


const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentID, setStudentID] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const isStep1Valid = fullName && email && studentID;

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (password !== confirmPassword) {
      newErrors.passwordMatch = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    }, 400);
  };

  return (
    <div className="h-screen container justify-center flex items-center px-6 w-full py-12 md:py-0 mt-5 md:mt-0 mx-4 md:mx-auto lg:w-3/8">
      <div className="w-full max-w-lg">
        {success ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Account Created!</h2>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-semibold text-center mb-10 text-[#066649]">Create a new account</h2>
            <form onSubmit={handleSignup}>
              {step === 1 && (
                <>
                  <InputField label="Full Name *" value={fullName} onChange={setFullName} placeholder="James Brown" />
                  <InputField label="Email Address *" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                  <InputField label="Student ID *" value={studentID} onChange={setStudentID} placeholder="FT23CMP0000" className="uppercase" />
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`w-full px-4 py-3 mt-4 text-white rounded-lg font-semibold transition ${
                      isStep1Valid ? 'bg-[#066649] hover:bg-[#386155]' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                  <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{' '}
                    <a href="/"
                      className="text-[#0b9b70] hover:underline focus:outline-none"
                    >
                      Login
                    </a>
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <InputField label="Department *" value={department} onChange={setDepartment} placeholder="Computer Science" />

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className={errors.passwordMatch ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must contain 1 uppercase, 1 number, 8+ characters.</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                      className={errors.passwordMatch ? 'border-red-500' : ''}
                    />
                    {errors.passwordMatch && <p className="text-sm text-red-600 mt-1">{errors.passwordMatch}</p>}
                  </div>

                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to Scholari's <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a>.
                    </span>
                  </div>
                  {errors.acceptedTerms && <p className="text-sm text-red-600 mt-1">{errors.acceptedTerms}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 text-white bg-[#066649] rounded-lg hover:bg-[#386155] font-semibold flex justify-center items-center"
                  >
                    {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Register'}
                  </button>

                  <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/')} type="button" className="text-[#0b9b70] hover:underline focus:outline-none">Login</button>
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

const InputField = ({ label, value, onChange, type = "text", placeholder, className = "" }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input block w-full px-4 py-3 border-0 focus:outline-none ${className}`}
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

export default SignupForm;
