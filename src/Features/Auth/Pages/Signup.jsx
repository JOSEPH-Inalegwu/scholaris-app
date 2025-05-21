import React, { useState } from 'react';
import SignupForm from '../components/SignupForm';

const Signup = () => {
  const [step, setStep] = useState(1);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentID, setStudentID] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Error states
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    // Reset errors first
    setPasswordMatchError(false);
    setTermsError(false);

    let hasError = false;

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      hasError = true;
    }

    if (!acceptedTerms) {
      setTermsError(true);
      hasError = true;
    }

    if (hasError) return;

    // All validations passed
    const userData = {
      fullName,
      email,
      studentID,
      department,
      password,
    };

    // Proceed with signup logic (e.g., API call or Supabase)
    console.log('Creating user with data:', userData);
    // Example: supabase.auth.signUp({...})

    // Reset form (optional)
    setFullName('');
    setEmail('');
    setStudentID('');
    setDepartment('');
    setPassword('');
    setConfirmPassword('');
    setAcceptedTerms(false);
    setStep(1);
  };

  return (
    <SignupForm
      step={step}
      setStep={setStep}
      fullName={fullName}
      setFullName={setFullName}
      email={email}
      setEmail={setEmail}
      studentID={studentID}
      setStudentID={setStudentID}
      department={department}
      setDepartment={setDepartment}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      acceptedTerms={acceptedTerms}
      setAcceptedTerms={setAcceptedTerms}
      passwordMatchError={passwordMatchError}
      termsError={termsError}
      handleSignup={handleSignup}
    />
  );
};

export default Signup;
