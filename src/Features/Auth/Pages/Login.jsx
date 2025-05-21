import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [userID, setUserID] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userID || !password) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Logging in with:', { userID, password });

    // 🔐 TODO: Replace this mock check with actual API logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      // ✅ Redirect to dashboard after successful login
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
      />
    </div>
  );
};

export default Login;
