"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import passwordResetService from "../../api/apiService/passwordResetService";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Clear specific field error and general error on typing
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.email; 
      delete newErrors.general; 
      return newErrors;
    });
    if (success) setSuccess(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const res = await passwordResetService.requestReset(email);
      setSuccess(res.detail || "Password reset email has been sent. Please check your inbox.");
      setEmail("");
    } catch (err) {
      if (err && err.email) {
        // Assuming err.email is an array of strings like ["Enter a valid email address."]
        setErrors({ email: err.email[0] });
      } else if (err && err.detail) {
        setErrors({ general: err.detail });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Title Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-600">Enter your email to receive a reset link</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl border shadow-xl backdrop-blur-sm transition-all duration-300 bg-white/80 border-white/20 hover:shadow-2xl"
      >
        {/* Success Message */}
        {success && (
          <div className="flex items-start p-4 mb-6 space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 transition-all duration-300">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="flex items-start p-4 mb-6 space-x-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 transition-all duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold text-gray-700">Email Address</label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
              <Mail className="w-5 h-5 text-violet-600" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="py-4 pr-4 pl-12 w-full placeholder-gray-500 text-gray-900 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-violet-100 focus:border-violet-400 bg-white/50"
              placeholder="Enter your email address"
              required
            />
          </div>
          {errors.email && (
            <div className="flex items-center mt-2 space-x-2 text-red-600">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span className="text-sm font-medium">{errors.email}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          disabled={loading}
          aria-label="Send Password Reset Link" // Added aria-label for accessibility
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 animate-spin border-white/30 border-t-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold text-violet-600 transition-colors duration-200 hover:text-violet-700"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;