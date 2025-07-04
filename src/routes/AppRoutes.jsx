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

import PasswordResetConfirmPage from "../pages/Password/PasswordResetConfirmPage";
import PasswordResetPages from "../pages/Password/PasswordResetPages";

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
import PassrowdChangePages from '../pages/Password/PassrowdChangePages';
import BookmarksPages from '../pages/Bookmarks/BookmarksPages';
import FacultyPage from '../pages/Faculty/FacultyPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<PasswordResetPages />} />
            <Route path="/reset-password/:uidb64/:token" element={<PasswordResetConfirmPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Notes related public pages */}
            <Route path="/notes" element={<AllNotesPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            
            {/* Contributors page */}
            <Route path="/contributors" element={<ContributorsPage />} />

            {/* --- Protected Routes --- */}
            <Route path="/upload-note" element={<ProtectedRoute><UploadNotePage /></ProtectedRoute>} />
            <Route path="/my-notes" element={<ProtectedRoute><MyNotesPage /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><ProfilePage  /></ProtectedRoute>} />
            {/* Edit Profile is a separate page, not nested under /profile */}
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><PassrowdChangePages /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPages /></ProtectedRoute>} />

            {/* Dashboard protected route */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* 404 Not Found Route - should be last */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;