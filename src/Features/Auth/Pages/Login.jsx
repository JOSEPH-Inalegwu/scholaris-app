import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [userID, setUserID] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [shakeUserID, setShakeUserID] = React.useState(false);
  const [shakePassword, setShakePassword] = React.useState(false);

  const navigate = useNavigate();

  const triggerShake = (field) => {
    if (field === 'userID') {
      setShakeUserID(true);
      setTimeout(() => setShakeUserID(false), 500);
    }
    if (field === 'password') {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!userID.trim()) {
      newErrors.userID = 'User ID is required';
      triggerShake('userID');
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      triggerShake('password');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    console.log('Logging in with:', { userID, password });

    const isAuthenticated = true;

    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <LoginForm 
        userID={userID}
        password={password}
        onUserIDChange={setUserID}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        errors={errors}
        shakeUserID={shakeUserID}
        shakePassword={shakePassword}
      />
    </div>
  );
};

export default Login;
