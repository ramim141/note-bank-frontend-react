// src/routes/PublicRoutes.jsx

import React from 'react';
import { Route } from 'react-router-dom'; // Route কম্পোনেন্ট ইম্পোর্ট করুন

// পাবলিক পেজ কম্পোনেন্টগুলো ইম্পোর্ট করুন
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordConfirmPage from '../pages/Auth/ResetPasswordConfirmPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage'; // 404 পেজ

// এই কম্পোনেন্টটি শুধুমাত্র Route অবজেক্টগুলো রিটার্ন করবে যা AppRoutes ব্যবহার করবে।
// এটি নিজে কোনো Routes বা Router ব্যবহার করবে না।
const PublicRoutes = () => {
    return (
        <>
            {/* পাবলিক রুটস */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* URL এ থাকা টোকেন এবং আইডি সহ রিসেট কনফার্মেশন রুট */}
            <Route path="/reset-password-confirm/:uidb64/:token" element={<ResetPasswordConfirmPage />} />
            
            {/* অন্যান্য পাবলিক পেজ যদি থাকে, এখানে যোগ করুন */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            
            {/* 404 Not Found Route - এটিকে শেষে রাখা উচিত। এটি PublicRoute-এর অংশ হিসেবে থাকবে। */}
            <Route path="*" element={<NotFoundPage />} />
        </>
    );
};

export default PublicRoutes;