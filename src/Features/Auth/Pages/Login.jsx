import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [userID, setUserID] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example login logic: replace with actual auth API call
    if (!userID || !password) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Logging in with:', { userID, password });

    // TODO: call login API, handle errors, redirect, etc.
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
}

export default Login;
