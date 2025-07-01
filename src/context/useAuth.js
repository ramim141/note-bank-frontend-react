// src/context/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import AuthContext

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Throw an error if useAuth is used outside of AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Return the context value
};