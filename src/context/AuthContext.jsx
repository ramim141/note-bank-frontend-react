import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { loginUser, registerUser, getUserProfile } from '../api/apiService/userService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const currentUserIdRef = useRef(null);

  const VITE_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://127.0.0.1:8000";

  useEffect(() => {
    currentUserIdRef.current = user?.id ?? null;
  }, [user]);

  const logout = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]); 
    setUnreadCount(0);
    toast.info("You have been logged out.");
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!token || socketRef.current) {
      return;
    }

    const ws_path = `${VITE_WS_BASE_URL}/ws/notifications/`;
    const socket = new WebSocket(ws_path);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected successfully.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_notification') {
          const newNotification = data.payload;
          // If user-targeted, ensure it is for the current user id from ref
          const recipientId = newNotification.recipient_user_id;
          const currentUserId = currentUserIdRef.current;
          if (recipientId && currentUserId && Number(recipientId) !== Number(currentUserId)) {
            return; // not for this user
          }
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(<div><strong>{newNotification.actor}</strong> {newNotification.verb}</div>);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected.");
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    };
  }, [VITE_WS_BASE_URL, token]);


  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        connectWebSocket();
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout();
      }
    }
    setLoading(false);
  }, [logout, connectWebSocket]);

  const fetchUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getUserProfile();
      setUser(response.data);
      localStorage.setItem('authUser', JSON.stringify(response.data));
      setIsAuthenticated(true);
      connectWebSocket(); 
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  }, [token, logout, connectWebSocket]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem("authToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("authUser", JSON.stringify(userData));

      setToken(access);
      setUser(userData);
      setIsAuthenticated(true);
      connectWebSocket(); 
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      const errorMessage = error.response?.data?.detail || "Login failed.";
      toast.error(errorMessage);
      throw error;
    }
  }, [connectWebSocket]);

  const register = useCallback(async (userData) => {
    try {
       const response = await registerUser(userData);
       toast.success("Registration successful! Please log in.");
       return response;
    } catch (error) {
       console.error("AuthContext: Registration error:", error);
       const errorMessage = error.response?.data?.detail || "Registration failed.";
       toast.error(errorMessage);
       throw error;
    }
  }, []);
  
  const markNotificationsAsRead = () => {
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    fetchUserProfile,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    clearNotifications,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};