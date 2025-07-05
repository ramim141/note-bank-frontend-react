import axios from "axios";
import { toast } from 'react-toastify';

// --- Get Base URL from environment variable ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 1 minute timeout
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
  // Ensure this code only runs in the browser
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
    const response = await api.post("/api/users/token/refresh/", { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem("authToken", access);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
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
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      const { status, data } = error.response;
      const detail = data?.detail;

      if (status === 401 && detail === "Authentication credentials were not provided." && !originalRequest._retry) {
        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 