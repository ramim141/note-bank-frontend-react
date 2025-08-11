// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); 


  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
            Processing...
        </div>
    );
  }


  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;