// src/api/apiService/departmentService.js

// Import axios and the main api instance from userService
import axios from 'axios'; // Axios is already imported in userService, but good to have here too for clarity
import api from './userService'; // Import the default export which is the axios instance
import { toast } from 'react-hot-toast'; // For error notifications

// --- Get Base URL from environment variable ---
// This might not be strictly necessary if api instance already has baseURL,
// but it's good for clarity if departmentService were to stand alone.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com";

export const departmentService = {
    getAllDepartments,
};

async function getAllDepartments() {
    try {
        // Use the imported 'api' instance (which is an Axios instance)
        // The endpoint is relative to the baseURL configured in the api instance
        const response = await api.get('/api/notes/departments/');
        return response.data; // Axios returns data in response.data

    } catch (error) {
        console.error("Error fetching departments:", error);
        // Handle specific errors if needed, or use generic error message
        // The interceptors in userService.js should already handle common errors like 401, 500 etc.
        // If you need specific error handling here, you can check error.response.status or error.message.
        
        // Fallback error message if interceptors don't catch it or you want a specific message here
        if (!error.response && !error.message.includes("API configuration error")) {
             toast.error("Failed to fetch departments. Please check your network connection.");
        } else if (error.response && error.response.status === 401) {
            // Interceptors should ideally handle logout, but for robustness:
            toast.error("Session expired. Please log in again.");
        } else if (error.response && error.response.data && error.response.data.detail) {
            // Show specific detail from the backend if available
             toast.error(error.response.data.detail);
        } else if (error.response && error.response.data && error.response.data.message) {
             toast.toast(error.response.data.message);
        } else {
             toast.error("An unexpected error occurred while fetching departments.");
        }
        
        // Re-throw the error to be caught by the caller (e.g., EditProfilePage)
        throw error;
    }
}