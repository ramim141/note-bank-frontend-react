// src/pages/Auth/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';


const RegisterPage = () => {
  return (
    <div className="auth-page-container">
      {/* Optional: You can add a header or banner here */}
      <div className="auth-page-content">
        <RegisterForm />
      </div>
      {/* Optional: You can add an image or illustration here */}
    </div>
  );
};

export default RegisterPage;