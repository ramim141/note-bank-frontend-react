import React, { useState, useRef, useCallback } from "react";
import { CheckCircle, AlertCircle, Shield, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import passwordResetService from "../../api/apiService/passwordResetService";

const PasswordResetConfirmForm = React.memo(({ uidb64, token }) => {
  const [form, setForm] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    new_password1: false,
    new_password2: false,
  });

  const inputRefs = {
    new_password1: useRef(null),
    new_password2: useRef(null),
  };

  // Memoized handleChange with debouncing
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

  // Memoized toggleShow
  const toggleShow = useCallback((field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    inputRefs[field].current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const res = await passwordResetService.confirmReset(uidb64, token, form.new_password1, form.new_password2);
      setSuccess(res.detail || "Your password has been reset successfully.");
      setForm({ new_password1: "", new_password2: "" });
    } catch (err) {
      if (err && (err.new_password1 || err.new_password2)) {
        setErrors({
          new_password1: err.new_password1 ? err.new_password1[0] : undefined,
          new_password2: err.new_password2 ? err.new_password2[0] : undefined,
        });
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
    <div className="px-4 pt-32 pb-32 mx-auto w-full max-w-md sm:px-0">
      <div className="mb-8 text-center">
        <div className="inline-flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full ring-4 ring-blue-100 shadow-2xl transition-transform duration-300 transform hover:scale-105">
          <Shield className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 sm:text-4xl">
          Create New Password
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-600 sm:text-base">
          Your password reset link is valid. Please create a strong, secure password for your account.
        </p>
        <div className="mx-auto mt-4 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden relative p-6 rounded-3xl border shadow-2xl backdrop-blur-lg transition-shadow duration-500 sm:p-8 bg-white/90 border-white/30 hover:shadow-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br via-transparent rounded-3xl from-blue-50/50 to-indigo-50/50"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br rounded-full blur-xl transition-transform duration-500 from-blue-200/20 to-indigo-200/20 group-hover:scale-110"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr rounded-full blur-xl transition-transform duration-500 from-purple-200/20 to-blue-200/20 group-hover:scale-110"></div>

        <div className="relative z-10">
          {success && (
            <div className="flex items-start p-5 mb-8 space-x-4 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl border shadow-lg transition-all duration-300 border-emerald-200/60 animate-in slide-in-from-top-2">
              <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-emerald-800">Success!</h3>
                <p className="text-sm leading-relaxed text-emerald-700">{success}</p>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="flex items-start p-5 mb-8 space-x-4 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 rounded-2xl border shadow-lg transition-all duration-300 border-red-200/60 animate-in slide-in-from-top-2">
              <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm leading-relaxed text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block mb-4 text-sm font-bold tracking-wide text-gray-800">New Password</label>
            <div className="relative group">
              <div className="flex absolute inset-y-0 left-0 z-10 items-center pl-4 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
              </div>
              <input
                ref={inputRefs.new_password1}
                type={show.new_password1 ? "text" : "password"}
                name="new_password1"
                value={form.new_password1}
                onChange={handleChange}
                className="py-5 pr-14 pl-12 w-full placeholder-gray-400 text-gray-900 rounded-2xl border-2 shadow-inner transition duration-300 border-gray-200/60 focus:ring-4 focus:ring-blue-100/80 focus:border-blue-400 bg-white/70 hover:bg-white/80 focus:bg-white/90"
                placeholder="Enter your new password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="flex absolute inset-y-0 right-0 z-10 items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
                onClick={() => toggleShow("new_password1")}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {show.new_password1 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="min-h-[28px]">
              {errors.new_password1 && (
                <div className="flex items-center mt-3 space-x-2 animate-in slide-in-from-left-2">
                  <AlertCircle className="flex-shrink-0 w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{errors.new_password1}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-4 text-sm font-bold tracking-wide text-gray-800">Confirm New Password</label>
            <div className="relative group">
              <div className="flex absolute inset-y-0 left-0 z-10 items-center pl-4 pointer-events-none">
                <KeyRound className="w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
              </div>
              <input
                ref={inputRefs.new_password2}
                type={show.new_password2 ? "text" : "password"}
                name="new_password2"
                value={form.new_password2}
                onChange={handleChange}
                className="py-5 pr-14 pl-12 w-full placeholder-gray-400 text-gray-900 rounded-2xl border-2 shadow-inner transition duration-300 border-gray-200/60 focus:ring-4 focus:ring-blue-100/80 focus:border-blue-400 bg-white/70 hover:bg-white/80 focus:bg-white/90"
                placeholder="Confirm your new password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="flex absolute inset-y-0 right-0 z-10 items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
                onClick={() => toggleShow("new_password2")}
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {show.new_password2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="min-h-[28px]">
              {errors.new_password2 && (
                <div className="flex items-center mt-3 space-x-2 animate-in slide-in-from-left-2">
                  <AlertCircle className="flex-shrink-0 w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{errors.new_password2}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r transition-transform duration-1000 -translate-x-full -skew-x-12 from-white/0 via-white/20 to-white/0 group-hover:translate-x-full"></div>
            <div className="flex relative z-10 items-center space-x-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 rounded-full animate-spin border-3 border-white/30 border-t-white"></div>
                  <span className="text-lg">Resetting Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6 drop-shadow-sm" />
                  <span className="text-lg">Set New Password</span>
                </>
              )}
            </div>
          </button>

          <div className="p-4 mt-8 bg-gradient-to-r rounded-xl border from-blue-50/80 to-indigo-50/80 border-blue-100/60">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-blue-800">Security Tip</h4>
                <p className="text-xs leading-relaxed text-blue-700">
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special
                  characters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

export default PasswordResetConfirmForm;