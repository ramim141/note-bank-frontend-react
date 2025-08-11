// src/routes/PublicRoutes.jsx

import React from 'react';
import { Route } from 'react-router-dom'; 


import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordConfirmPage from '../pages/Auth/ResetPasswordConfirmPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage'; // 404 পেজ


const PublicRoutes = () => {
    return (
        <>
   
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/reset-password-confirm/:uidb64/:token" element={<ResetPasswordConfirmPage />} />

            

            <Route path="*" element={<NotFoundPage />} />
        </>
    );
};

export default PublicRoutes;