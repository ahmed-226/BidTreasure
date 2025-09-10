import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleLogin = (loginData) => {
    console.log('Login successful:', loginData);
    if (onAuthSuccess) {
      onAuthSuccess({ type: 'login', data: loginData });
    }
  };

  const handleRegister = (registerData) => {
    console.log('Registration successful:', registerData);
    if (onAuthSuccess) {
      onAuthSuccess({ type: 'register', data: registerData });
    }
  };

  return (
    <>
      {isLoginMode ? (
        <Login 
          onToggleMode={handleToggleMode}
          onLogin={handleLogin}
        />
      ) : (
        <Register 
          onToggleMode={handleToggleMode}
          onRegister={handleRegister}
        />
      )}
    </>
  );
};

export default AuthContainer;
