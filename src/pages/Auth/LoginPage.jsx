// src/pages/Auth/LoginPage.jsx
import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gray-100">
      <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;