"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth"
import { toast } from "react-toastify"
import { User, Lock, Eye, EyeOff, Mail, Loader2, CheckCircle, AlertCircle, X } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (!formData.username || !formData.password) {
      setErrors({ non_field_errors: "Please enter both username and password." })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(data.detail || "Invalid credentials.")
          setErrors({ non_field_errors: data.detail || "Invalid credentials." })
        } else {
          toast.error("Login failed. Please check your input.")
          setErrors(data)
        }
      } else {
        login(data.user, data.access, data.refresh)
        toast.success("Login successful!")
        navigate("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      setErrors({ non_field_errors: "An unexpected error occurred. Please try again later." })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  function getInputClasses(field) {
    return `w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${
      focusedField === field
        ? "border-yellow-400 ring-4 ring-yellow-400/20"
        : errors[field]
          ? "border-red-400 ring-4 ring-red-400/20"
          : "border-gray-200 hover:border-gray-300"
    }`;
  }

  return (
    <div className="flex justify-center items-center py-32 pb-12 min-h-screen bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden overflow-hidden w-full max-w-4xl bg-white rounded-3xl shadow-2xl lg:flex">
        {/* Left Panel - Yellow Section */}
        <div className="flex relative flex-col flex-1 justify-center items-center p-12 text-center bg-gradient-to-br from-yellow-300 via-lime-300 to-yellow-400">
          {/* Close Button (example, not functional here without state management) */}
          <button className="flex absolute top-6 right-6 justify-center items-center w-8 h-8 rounded-full transition-colors bg-black/10 hover:bg-black/20">
            <X className="w-4 h-4 text-black/60" />
          </button>

          {/* Logo */}
          <div className="flex justify-center items-center mb-4 w-20 h-20 rounded-full">
          <div className="flex relative justify-center items-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl shadow-lg transition-all duration-300 transform group-hover:rotate-12">
                <span className="text-xl font-black text-white drop-shadow-lg">N</span>
              </div>
          </div>

          {/* Brand Name */}
          <h3 className="mb-8 text-lg font-semibold text-black">NOTEBANK</h3>

          {/* Welcome Text */}
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-black text-black">Welcome Back!</h1>
            <p className="text-base leading-relaxed text-black/70">
              To stay connected with us
              <br />
              please login with your personal info
            </p>
          </div>

          {/* Sign In Button (example, not functional here without linking to a different page or action) */}
          <button className="px-12 py-3 mb-8 font-semibold tracking-wider text-white bg-black rounded-lg transition-colors hover:bg-gray-800">
            SIGN IN
          </button>

          {/* Bottom Links */}
          <div className="space-x-4 text-sm text-black/70">
            <a href="/register" className="transition-colors hover:text-black">
              CREATE HERE
            </a>
            <span>|</span>
            <a href="/" className="transition-colors hover:text-black">
              HOME
            </a>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex flex-col flex-1 justify-center p-12">
          {/* Close Button (example, not functional here) */}
          <button className="flex absolute top-6 right-6 justify-center items-center w-8 h-8 bg-gray-100 rounded-full transition-colors hover:bg-gray-200">
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Welcome back!</h2>
              <p className="text-gray-600">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="off"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    className={getInputClasses("username")}
                    placeholder="Username/Email"
                  />
                  {/* Display checkmark if field has value and no error */}
                  {formData.username && !errors.username && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {/* Display error message for username */}
                {errors.username && (
                  <div className="flex gap-2 items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.username}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className={getInputClasses("password")}
                    placeholder="Password"
                  />
                  {/* Password visibility toggle button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="flex absolute inset-y-0 right-0 items-center pr-3 rounded-r-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {/* Display error message for password */}
                {errors.password && (
                  <div className="flex gap-2 items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="mr-2 text-yellow-500 rounded border-gray-300 focus:ring-yellow-400"
                  />
                  <label htmlFor="remember-me" className="text-gray-600">Remember me</label>
                </div>
                <a href="/forgot-password" className="text-gray-600 transition-colors hover:text-gray-800">
                  Forgot your password?
                </a>
              </div>

              {/* General Error Message (e.g., from non_field_errors) */}
              {errors.non_field_errors && (
                <div className="flex gap-3 items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-700">{errors.non_field_errors}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-3 w-full font-semibold text-black bg-gradient-to-r from-yellow-300 to-lime-300 rounded-lg shadow-lg transition-all duration-300 hover:from-yellow-400 hover:to-lime-400 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>LOGGING IN...</span>
                  </div>
                ) : (
                  <span className="font-bold tracking-wider">LOG IN</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                  sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="overflow-hidden w-full max-w-sm bg-white rounded-3xl shadow-2xl lg:hidden">
        {/* Top Panel - Yellow Section */}
        <div className="relative p-8 text-center bg-gradient-to-br from-yellow-300 via-lime-300 to-yellow-400">
          {/* Logo */}
          <div className="flex justify-center items-center mx-auto mb-3 w-16 h-16 bg-black rounded-full">
            <span className="text-xl font-bold text-white">N</span> {/* Changed 'X' to 'N' to match desktop logo */}
          </div>

          {/* Brand Name */}
          <h3 className="mb-6 text-base font-semibold text-black">NOTEBANK</h3> {/* Changed brand name */}

          {/* Divider Line */}
          <div className="mx-auto w-16 h-1 bg-black"></div>
        </div>

        {/* Bottom Panel - Form Section */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="mb-1 text-xl font-bold text-gray-800">Welcome back!</h2>
            <p className="text-sm text-gray-600">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  id="username-mobile" // Unique ID for mobile version if needed, though name attribute is key
                  name="username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  className={getInputClasses("username")}
                  placeholder="Username/Email"
                />
                {/* Display checkmark if field has value and no error */}
                {formData.username && !errors.username && (
                  <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {/* Display error message for username */}
              {errors.username && (
                <div className="flex gap-2 items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-mobile" // Unique ID for mobile version
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={getInputClasses("password")}
                  placeholder="Password"
                />
                {/* Password visibility toggle button */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="flex absolute inset-y-0 right-0 items-center pr-3 rounded-r-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {/* Display error message for password */}
              {errors.password && (
                <div className="flex gap-2 items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-xs text-gray-600">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me-mobile"
                  className="mr-2 text-yellow-500 rounded border-gray-300 focus:ring-yellow-400"
                />
                <label htmlFor="remember-me-mobile" className="text-gray-600">Remember me</label>
              </div>
              <a href="/forgot-password" className="transition-colors hover:text-gray-800">
                Forgot your password?
              </a>
            </div>

            {/* General Error Message */}
            {errors.non_field_errors && (
              <div className="flex gap-3 items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="flex-shrink-0 w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{errors.non_field_errors}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-3 mt-6 w-full font-semibold text-black bg-gradient-to-r from-yellow-300 to-lime-300 rounded-lg shadow-lg transition-all duration-300 hover:from-yellow-400 hover:to-lime-400 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>LOGGING IN...</span>
                </div>
              ) : (
                <span className="font-bold tracking-wider">LOG IN</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm