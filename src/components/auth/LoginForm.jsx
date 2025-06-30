// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!formData.username || !formData.password) {
      setErrors({ non_field_errors: 'Please enter both username and password.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(data.detail || 'Invalid credentials.');
          setErrors({ non_field_errors: data.detail || 'Invalid credentials.' });
        } else {
          toast.error('Login failed. Please check your input.');
          setErrors(data);
        }
      } else {
        login(data.user, data.access, data.refresh);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setErrors({ non_field_errors: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto w-full max-w-sm bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Welcome Back!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username or Email */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username or Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="username-error"
          />
          {/* Error display for username specific errors if any from backend */}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="password-error"
          />
          {/* Error display for password specific errors if any from backend */}
        </div>

        {/* General Error Message */}
        {errors.non_field_errors && (
          <div className="p-2 text-sm text-center text-red-500 bg-red-100 rounded-md border border-red-300">
            {errors.non_field_errors}
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?
        <a href="/register" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
          Register here
        </a>
      </p>
      <p className="mt-2 text-sm text-center text-gray-600">
        Forgot Password?
        <a href="/forgot-password" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
          Reset Password
        </a>
      </p>
    </div>
  );
};

export default LoginForm;