// src/api/apiService/userService.js

import axios from "axios";
import { toast } from 'react-hot-toast';

// --- Get Base URL from environment variable ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com";

// --- Create Axios Instance ---
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// --- Token Refresh Logic ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Logout Function ---
const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  toast.error("Your session has expired. Please log in again.");
};

// --- Refresh Access Token Function ---
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available."));
  }

  try {
    const response = await api.post("/api/users/token/refresh/", {
      refresh: refreshToken,
    });
    const { access } = response.data;
    localStorage.setItem("authToken", access);
    return access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    logoutUser();
    return Promise.reject(error);
  }
};

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    const needsTokenRefresh = (
      status === 401 ||
      (status === 403 && detail === 'Authentication credentials were not provided.')
    );

    if (needsTokenRefresh && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Error handling for specific status codes and messages
    if (status === 400 && detail === "No active account found with the given credentials") {
      toast.error("Invalid credentials.");
    } else if (status === 400 && detail === "User with this email already exists.") {
      toast.error("User with this email already exists.");
    } else if (status === 400 && detail === "Passwords do not match.") {
      toast.error("Passwords do not match.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status === 500) {
      toast.error("Internal server error. Please try again later.");
    } else if (detail && !originalRequest._retry) {
       toast.error(detail);
    } else if (!originalRequest._retry) {
       toast.error("An unexpected error occurred.");
    }

    console.error("API Response Error:", error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// --- API Functions for User Service ---

export const loginUser = async (credentials) => api.post('/api/users/login/', credentials);
export const registerUser = async (userData) => {
  const formattedData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    username: userData.username,
    email: userData.email,
    student_id: userData.studentId,
    password: userData.password,
    password2: userData.confirmPassword,
    batch: userData.batch,
    section: userData.section,
  };
  return api.post('/api/users/register/', formattedData);
};

export const getUserProfile = () => api.get('/api/users/profile/');
export const updateUserProfile = (userData) => api.patch('/api/users/profile/', userData);

// Removed getDepartments from here as it's in departmentService.js

export const getCourses = async (departmentId = null) => {
  let url = '/api/notes/courses/';
  if (departmentId) {
    url += `?department=${departmentId}`;
  }
  return api.get(url);
};

export const getNoteCategories = async () => api.get('/api/notes/categories/');
export const getMyNotes = async (params = {}) => api.get('/api/notes/my-notes/', { params });
export const getBookmarkedNotes = async (params = {}) => api.get('/api/users/user-activity/bookmarked-notes/', { params });
export const getSiteStats = async () => api.get('/api/users/site-stats/');
export const createNoteRequest = async (requestData) => api.post('/api/notes/note-requests/', requestData);

export default api;