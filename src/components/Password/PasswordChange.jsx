"use client";

import { useState, useRef, useCallback } from "react"; // Removed useEffect
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Key } from "lucide-react";
import passwordChangeService from "../../api/apiService/passwordChangeService";

const PasswordChange = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    old_password: false,
    new_password: false,
    new_password2: false,
  });

  const inputRefs = {
    old_password: useRef(null),
    new_password: useRef(null),
    new_password2: useRef(null),
  };

  // Memoized handleChange
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
    if (success) setSuccess("");
  }, [success]);

  // Memoized toggleShow with immediate focus
  const toggleShow = useCallback((field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    inputRefs[field].current?.focus(); // Removed setTimeout for immediate focus
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const res = await passwordChangeService.changePassword(form);
      setSuccess(res.detail || "Password updated successfully");
      setForm({ old_password: "", new_password: "", new_password2: "" });
    } catch (err) {
      if (err && err.errors) {
        setErrors(err.errors);
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
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 transition-shadow duration-300 border shadow-xl rounded-2xl backdrop-blur-sm bg-white/80 border-white/20 hover:shadow-2xl"
      >
        {success && (
          <div className="flex items-start p-4 mb-6 space-x-3 transition-all duration-300 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        {errors.general && (
          <div className="flex items-start p-4 mb-6 space-x-3 transition-all duration-300 border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold text-gray-700">Current Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={inputRefs.old_password}
              type={show.old_password ? "text" : "password"}
              name="old_password"
              value={form.old_password}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-12 text-gray-900 placeholder-gray-500 transition border border-gray-200 rounded-xl focus:ring-emerald-100 focus:border-emerald-400 bg-white/50 focus:outline-none"
              placeholder="Enter your current password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:outline-none"
              onClick={() => toggleShow("old_password")}
              tabIndex={-1}
            >
              {show.old_password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.old_password && (
            <div className="flex items-center mt-2 space-x-2 text-red-600">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span className="text-sm font-medium">{errors.old_password[0]}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold text-gray-700">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={inputRefs.new_password}
              type={show.new_password ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-12 text-gray-900 placeholder-gray-500 transition border border-gray-200 rounded-xl focus:ring-emerald-100 focus:border-emerald-400 bg-white/50 focus:outline-none"
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:outline-none"
              onClick={() => toggleShow("new_password")}
              tabIndex={-1}
            >
              {show.new_password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.new_password && (
            <div className="flex items-center mt-2 space-x-2 text-red-600">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span className="text-sm font-medium">{errors.new_password[0]}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold text-gray-700">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={inputRefs.new_password2}
              type={show.new_password2 ? "text" : "password"}
              name="new_password2"
              value={form.new_password2}
              onChange={handleChange}
              className="w-full py-4 pl-12 pr-12 text-gray-900 placeholder-gray-500 transition border border-gray-200 rounded-xl focus:ring-emerald-100 focus:border-emerald-400 bg-white/50 focus:outline-none"
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600 focus:outline-none"
              onClick={() => toggleShow("new_password2")}
              tabIndex={-1}
            >
              {show.new_password2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.new_password2 && (
            <div className="flex items-center mt-2 space-x-2 text-red-600">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span className="text-sm font-medium">{errors.new_password2[0]}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 rounded-full animate-spin border-white/30 border-t-white"></div>
              <span>Changing...</span>
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              <span>Change Password</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="/support"
              className="font-semibold transition-colors duration-200 text-emerald-600 hover:text-emerald-700"
            >
              Contact Support
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;