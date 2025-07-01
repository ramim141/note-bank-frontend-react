// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// Assuming API functions are imported correctly from userService
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../api/apiService/userService'; // Adjust path if needed
import { toast } from 'react-hot-toast';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for logged-in user data
  const [token, setToken] = useState(null); // State for JWT access token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Boolean flag for authentication status
  const [loading, setLoading] = useState(true); // Initial loading state for auth check

  // --- Logout function ---
  const logout = useCallback(() => {
    // Clear all stored authentication data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    // Reset state variables
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out.");
    console.log("AuthContext: User logged out.");
    // Redirect to login page (if running in browser context)
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
  }, []); // No dependencies, this function is stable

  // --- Load initial auth state from localStorage ---
  // This effect runs once when the component mounts to check for existing auth data
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        // Try to parse stored user data
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Check if the token is still valid (optional, but good for UX)
        // For simplicity, we assume if token/user exist, user is authenticated for now.
        // More robust checks would involve token expiry.
        setIsAuthenticated(true); 
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout(); // If stored data is corrupted, log out
      }
    }
    // After checking localStorage, set loading to false
    setLoading(false);
  }, [logout]); // Dependency: logout function (stable, so runs once)

  // --- Fetch User Profile Function ---
  // Memoized function to fetch user profile data from the API
  const fetchUserProfile = useCallback(async () => {
    if (!token) { // Only fetch if a token exists
      console.log("AuthContext: No token found, cannot fetch profile.");
      return;
    }
    
    try {
      const response = await getUserProfile(); // API call to get profile
      setUser(response.data); // Update user state with fetched data
      // Update localStorage with the latest user data
      localStorage.setItem('authUser', JSON.stringify(response.data));
      setIsAuthenticated(true); // Ensure authenticated state is true
      console.log("AuthContext: User profile fetched successfully.");
    } catch (error) {
      console.error("AuthContext: Error fetching profile:", error);
      // If fetching profile fails (e.g., expired token, network error), log out
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout(); // Call the memoized logout function
      }
      // Clear state if profile fetch fails
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      toast.error("Session expired. Please log in again.");
    }
  }, [token, logout]); // Dependencies: token and logout function

  // --- Login Function ---
  const login = useCallback(async (credentials) => {
    try {
      const response = await loginUser(credentials); // API call for login
      const { access, refresh, user: userData } = response.data; // Adjust based on your API response structure

      // Store tokens and user data in localStorage and state
      localStorage.setItem("authToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("authUser", JSON.stringify(userData));

      setToken(access);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
      console.log("AuthContext: User logged in.");
      // Optionally fetch profile immediately after login if API response doesn't contain full profile
      // await fetchUserProfile(); // If needed
      // navigate('/profile'); // Navigation should ideally be handled by the component calling login
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      throw error; // Re-throw to allow component to handle it
    }
  }, []); // No dependencies for login, as it directly uses passed credentials

  // --- Register Function ---
   const register = useCallback(async (userData) => {
     try {
        const response = await registerUser(userData); // API call for registration
        toast.success("Registration successful! Please log in.");
        // Optionally redirect here, or let the caller handle navigation
        // navigate('/login');
        return response;
     } catch (error) {
        console.error("AuthContext: Registration error:", error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Registration failed.";
        toast.error(errorMessage);
        throw error;
     }
  }, []);

  // --- Context Value ---
  const value = {
    user,
    token,
    isAuthenticated,
    loading, // This loading state is for the initial auth check
    login,
    logout,
    register,
    fetchUserProfile, // Make fetchUserProfile available in context
  };

  // Provide the context value to children components
  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after the initial authentication check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook to use AuthContext ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Throw an error if useAuth is used outside of AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Return the context value
};