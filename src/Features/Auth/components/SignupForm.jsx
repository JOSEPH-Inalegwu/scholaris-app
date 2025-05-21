import React, { useState } from 'react'

const SignupForm = () => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [studentID, setStudentID] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const isStep1Valid = fullName && email && studentID;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions.');
      return;
    }

  };

  return (
    <>
    <div className="h-screen container justify-center flex items-center px-6 w-full py-12 md:py-0 mt-5 md:mt-0 mx-4 md:mx-auto lg:w-3/8">
      <div className="w-full max-w-lg">
        <h2 className="text-4xl font-semibold text-center mb-10 text-[#066649]">Create a new account</h2>
        <form onSubmit={handleSignup}>
          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <div className='border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]'>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input block w-full px-4 py-3 border-0 focus:outline-none"
                    placeholder="James Brown"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <div className='border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]'>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input block w-full px-4 py-3 border-0 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Student ID *</label>
                <div className='border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]'>
                  <input
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    className="fform-input block w-full px-4 py-3 border-0 focus:outline-none uppercase"
                    placeholder="FT23CMP0000"
                    required
                  />
                </div>
              </div>

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
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Department *</label>
                <div className='border border-gray-300 rounded-lg focus-within:border-[#066649] focus-within:ring-1 focus-within:ring-[#066649]'>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="form-input block w-full px-4 py-3 border-0 focus:outline-none"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password *</label>

                <PasswordInput 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                />
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

              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-[#066649] rounded-lg hover:bg-[#386155] font-semibold"
              >
                Register
              </button>
              <p className="text-sm text-center mt-4 text-gray-600">
                Already have an account?{' '}
                <button className="text-blue-500 hover:underline">Login</button>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
    </>
  )
}

export default SignupForm