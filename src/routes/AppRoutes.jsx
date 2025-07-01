// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import existing components
import ProtectedRoute from './ProtectedRoute';

// Import existing pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

// Notes related pages
import AllNotesPage from '../pages/Notes/AllNotesPage';
import MyNotesPage from '../pages/Notes/MyNotesPage';
import UploadNotePage from '../pages/Notes/UploadNotePage';
import EditProfilePage from '../pages/Profile/EditProfilePage';
// Contributors page
import ContributorsPage from '../pages/Contributions/ContributorsPage';

// About page
import AboutPage from '../pages/About/AboutPage';
import ProfilePage from '../pages/Profile/ProfilePage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Notes related public pages */}
            <Route path="/notes" element={<AllNotesPage />} />
            
            {/* Contributors page */}
            <Route path="/contributors" element={<ContributorsPage />} />

            {/* --- Protected Routes --- */}
            <Route path="/upload-note" element={<ProtectedRoute><UploadNotePage /></ProtectedRoute>} />
            <Route path="/my-notes" element={<ProtectedRoute><MyNotesPage /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><ProfilePage  /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage   /></ProtectedRoute>} />

            {/* 404 Not Found Route - should be last */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;