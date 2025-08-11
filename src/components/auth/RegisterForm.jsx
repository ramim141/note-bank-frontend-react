// RegisterForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../api/apiService/departmentService";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BadgeIcon as IdCard,
  Building,
  Calendar,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  // --- State for Form Data ---
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("registerFormData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          username: "",
          email: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          student_id: "",
          department: null, 
          batch: "",
          section: "",
        };
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const navigate = useNavigate();

  // --- Effect to save form data to localStorage ---
  useEffect(() => {
    localStorage.setItem("registerFormData", JSON.stringify(formData));
  }, [formData]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentLoading(true); 
      setDepartmentError(null); 

      try {
        const savedDepartments = localStorage.getItem("departments");
        if (savedDepartments) {
          const parsedDepartments = JSON.parse(savedDepartments);
          if (Array.isArray(parsedDepartments) && parsedDepartments.length > 0) {
            setDepartments(parsedDepartments);
            setDepartmentLoading(false);
            return; 
          } else {
            console.warn("Invalid or empty data in localStorage for departments. Fetching from API.");
            localStorage.removeItem("departments");
          }
        }

        const data = await departmentService.getAllDepartments();
        console.log("Fetched departments data:", data); 

        // Ensure the fetched data is an array before setting
        if (data && Array.isArray(data)) {
          setDepartments(data);
          setDepartmentLoading(false);
          // Save departments to localStorage for future use
          localStorage.setItem("departments", JSON.stringify(data));
        } else {
          if (data && typeof data === 'object' && Array.isArray(data.results)) {
            setDepartments(data.results);
            setDepartmentLoading(false);
            localStorage.setItem("departments", JSON.stringify(data.results));
          } else {
            console.error("API did not return an array of departments:", data);
            setDepartmentError("Failed to load departments. Invalid data format received.");
            setDepartmentLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentError("Failed to load departments. Please try again later.");
        setDepartmentLoading(false);
      }
    };

    fetchDepartments();
  }, []); 

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    const departmentValue = value === "" ? null : Number.parseInt(value, 10);
    setFormData({
      ...formData,
      [name]: departmentValue,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'password2') {
      setShowPassword2(!showPassword2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); 

    const dataToSend = { ...formData };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Log response details for debugging
      console.log("Registration API Response Status:", response.status);
      const responseText = await response.text();
      console.log("Registration API Response Text:", responseText);

      if (!response.ok) {
        // Handle API errors (e.g., validation errors, server errors)
        try {
          if (!responseText || responseText.trim() === "") {
            const errorMessage = `Registration failed with status ${response.status}. Please try again.`;
            toast.error(errorMessage);
            setErrors({ non_field_errors: errorMessage });
            return;
          }

          const errorData = JSON.parse(responseText);
          setErrors(errorData);

          // Show toast notifications for specific errors
          if (errorData.non_field_errors) {
            toast.error(errorData.non_field_errors[0] || "Registration failed. Please check your inputs.");
          } else {
            // Iterate over other fields and show their errors
            Object.keys(errorData).forEach((key) => {
              if (errorData[key] && Array.isArray(errorData[key]) && errorData[key].length > 0) {
                toast.error(`${key}: ${errorData[key][0]}`);
              }
            });
          }
        } catch (parseError) {
          // Handle cases where the error response is not valid JSON
          console.error("Failed to parse error response JSON:", parseError);
          const errorMessage = `Registration failed with status ${response.status}. Server returned invalid error format.`;
          toast.error(errorMessage);
          setErrors({ non_field_errors: errorMessage });
        }
      } else {
        // Handle successful registration
        try {
          // Even on success, it's good practice to try parsing the response,
          // though often success messages don't need parsing.
          if (!responseText || responseText.trim() === "") {
            toast.success("Registration successful! Please check your email for verification.");
            localStorage.removeItem("registerFormData"); // Clear saved form data on success
            navigate("/login"); // Redirect to login page
            return;
          }



          toast.success("Registration successful! Please check your email for verification.");
          localStorage.removeItem("registerFormData");
          navigate("/login");

        } catch (parseError) {
          // Handle cases where success response is not valid JSON
          console.error("Failed to parse successful response JSON:", parseError);
          toast.error("Registration completed, but received unexpected data format.");
          // Decide if you still want to redirect or keep the user on the page
          // For now, let's assume success and redirect.
          localStorage.removeItem("registerFormData");
          navigate("/login");
        }
      }
    } catch (error) {
      // Handle network errors or other unexpected exceptions during the fetch
      console.error("Registration network or unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
      setErrors({ non_field_errors: "An unexpected error occurred. Please check your internet connection or try again later." });
    } finally {
      setIsLoading(false); 
    }
  };

  // --- Render Logic ---
  return (
    <div className="flex justify-center items-center px-4 py-8 pt-36 pb-36 min-h-screen bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden overflow-hidden w-full max-w-7xl bg-white rounded-3xl shadow-2xl lg:flex">
        {/* Left Panel - Yellow Section */}
        <div className="flex relative flex-col flex-1 justify-center items-center p-12 text-center bg-gradient-to-br from-yellow-300 via-lime-300 to-yellow-400">
          {/* Close Button - If needed, implement navigation to a different page */}
          {/* <button className="flex absolute top-6 right-6 justify-center items-center w-8 h-8 rounded-full transition-colors bg-black/10 hover:bg-black/20">
            <X className="w-4 h-4 text-black/60" />
          </button> */}

          {/* Logo */}
          <div className="flex justify-center items-center mb-4 w-20 h-20 bg-black rounded-full">
            <span className="text-4xl font-bold text-white">N</span>
          </div>

          {/* Brand Name */}
          <h3 className="mb-8 text-2xl font-semibold text-black">NoteBank</h3>

          {/* Welcome Text */}
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-black text-black">Join Us Today!</h1>
            <p className="text-base leading-relaxed text-black/70">
              Create your account to access
              <br />
              thousands of study materials
            </p>
          </div>

          {/* Sign Up Button - Navigates to current page, might be redundant */}
          <button className="px-12 py-3 mb-8 font-semibold tracking-wider text-white bg-black rounded-lg transition-colors hover:bg-gray-800">
            SIGN UP
          </button>

          {/* Bottom Links */}
          <div className="space-x-4 text-sm text-black/70">
            {/* Links might need proper routing if you use react-router-dom */}
            <a href="/create" className="transition-colors hover:text-black">
              CREATE HERE
            </a>
            <span>|</span>
            <a href="/directory" className="transition-colors hover:text-black">
              DIRECTORY HERE
            </a>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex relative flex-col flex-1 justify-start p-8 pt-16"> {/* Added relative positioning for absolute elements */}

          {/* Close Button for Form Section */}
          <button
            onClick={() => navigate('/login')} // Example: navigate back to login
            className="flex absolute top-6 right-6 justify-center items-center w-8 h-8 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
            aria-label="Close form"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-extrabold text-gray-800">Create Account</h2>
              <p className="text-gray-600">Join our learning community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name - Top Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1">
                  <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <User className={`w-5 h-5 transition-colors duration-200 ${focusedField === "first_name" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("first_name")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "first_name" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.first_name ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="First name"
                      required // Added for basic HTML5 validation
                    />
                  </div>
                  {errors.first_name && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.first_name[0]}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <User className={`w-5 h-5 transition-colors duration-200 ${focusedField === "last_name" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("last_name")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "last_name" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.last_name ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="Last name"
                      required // Added for basic HTML5 validation
                    />
                  </div>
                  {errors.last_name && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.last_name[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email - Full Width */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-200 ${focusedField === "email" ? "text-yellow-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "email" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.email ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                    placeholder="Enter email address"
                    required // Added for basic HTML5 validation
                  />
                  {formData.email && !errors.email && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <div className="flex gap-2 items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email[0]}</span>
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <User className={`w-5 h-5 transition-colors duration-200 ${focusedField === "username" ? "text-yellow-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "username" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.username ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                    placeholder="Username"
                    required // Added for basic HTML5 validation
                  />
                  {formData.username && !errors.username && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.username && (
                  <div className="flex gap-2 items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.username[0]}</span>
                  </div>
                )}
              </div>

              {/* Password and Confirm Password - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${focusedField === "password" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "password" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.password ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="Password"
                      required // Added for basic HTML5 validation
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="flex absolute inset-y-0 right-0 items-center pr-3 rounded-r-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password[0]}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label htmlFor="password2" className="block text-sm font-semibold text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${focusedField === "password2" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type={showPassword2 ? "text" : "password"}
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password2")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "password2" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.password2 ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="Confirm password"
                      required // Added for basic HTML5 validation
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password2')}
                      className="flex absolute inset-y-0 right-0 items-center pr-3 rounded-r-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showPassword2 ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password2 && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password2[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Student ID - Full Width */}
              <div className="space-y-1">
                <label htmlFor="student_id" className="block text-sm font-semibold text-gray-700">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <IdCard className={`w-5 h-5 transition-colors duration-200 ${focusedField === "student_id" ? "text-yellow-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    placeholder="e.g., 22-01-01-001"
                    value={formData.student_id}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("student_id")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "student_id" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.student_id ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                    required // Added for basic HTML5 validation
                  />
                  {formData.student_id && !errors.student_id && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.student_id && (
                  <div className="flex gap-2 items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.student_id[0]}</span>
                  </div>
                )}
              </div>

              {/* Department, Batch, Section - Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Department */}
                <div className="col-span-2 space-y-1"> {/* Adjust span if needed */}
                  <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                    Department
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Building className={`w-5 h-5 transition-colors duration-200 ${focusedField === "department" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    {departmentLoading ? (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center text-sm text-gray-500">
                        <Loader2 className="mr-2 w-4 h-4 text-gray-400 animate-spin" />
                        Loading Departments...
                      </div>
                    ) : departmentError ? (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-red-50 border-2 border-red-200 rounded-lg flex items-center text-sm text-red-600">
                        <AlertCircle className="mr-2 w-4 h-4 text-red-500" />
                        Error loading departments
                      </div>
                    ) : departments && departments.length > 0 ? (
                      <select
                        id="department"
                        name="department"
                        value={formData.department === null ? "" : formData.department} // Ensure value is "" if null for select
                        onChange={handleSelectChange}
                        onFocus={() => setFocusedField("department")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white ${focusedField === "department" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.department ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center text-sm text-gray-500">
                        No departments available
                      </div>
                    )}
                  </div>
                  {errors.department && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.department[0]}</span>
                    </div>
                  )}
                </div>

                {/* Batch */}
                <div className="space-y-1">
                  <label htmlFor="batch" className="block text-sm font-semibold text-gray-700">
                    Batch
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Calendar className={`w-5 h-5 transition-colors duration-200 ${focusedField === "batch" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("batch")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "batch" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.batch ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  {errors.batch && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.batch[0]}</span>
                    </div>
                  )}
                </div>

                {/* Section */}
                <div className="space-y-1">
                  <label htmlFor="section" className="block text-sm font-semibold text-gray-700">
                    Section
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <Users className={`w-5 h-5 transition-colors duration-200 ${focusedField === "section" ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("section")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 ${focusedField === "section" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.section ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                      placeholder="e.g., A"
                    />
                  </div>
                  {errors.section && (
                    <div className="flex gap-2 items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.section[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* General Error Message */}
              {errors.non_field_errors && (
                <div className="flex gap-3 items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-700">{errors.non_field_errors}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || departmentLoading}
                className="px-4 py-3 mt-6 w-full font-semibold text-black bg-gradient-to-r from-yellow-300 to-lime-300 rounded-lg shadow-lg transition-all duration-300 hover:from-yellow-400 hover:to-lime-400 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>REGISTERING...</span>
                  </div>
                ) : departmentLoading ? (
                  <div className="flex gap-2 justify-center items-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PREPARING...</span>
                  </div>
                ) : (
                  <span className="font-bold tracking-wider">REGISTER</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex overflow-hidden flex-col w-full max-w-sm bg-white rounded-3xl shadow-2xl lg:hidden">
        {/* Top Panel - Yellow Section */}
        <div className="relative px-6 py-8 text-center bg-gradient-to-br from-yellow-300 via-lime-300 to-yellow-400">
          {/* Logo */}
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-black rounded-full">
            <span className="text-xl font-bold text-white">N</span>
          </div>

          {/* Brand Name */}
          <h3 className="mb-6 text-base font-semibold text-black">NoteBank</h3>

          {/* Welcome Text */}
          <div className="mb-6 space-y-3">
            <h2 className="text-2xl font-bold text-black">Create Account</h2>
            <p className="text-sm leading-relaxed text-black/80">Join our learning community</p>
          </div>

          {/* Divider Line */}
          <div className="mx-auto w-16 h-1 bg-black"></div>
        </div>

        {/* Bottom Panel - Form Section */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name-mobile" className="block text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="first_name-mobile"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 placeholder-gray-400 text-sm"
                    placeholder="First"
                  />
                </div>
                {errors.first_name && (
                  <div className="flex gap-2 items-center text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.first_name[0]}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="last_name-mobile" className="block text-sm font-semibold text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="last_name-mobile"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 placeholder-gray-400 text-sm"
                    placeholder="Last"
                  />
                </div>
                {errors.last_name && (
                  <div className="flex gap-2 items-center text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.last_name[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email-mobile" className="block text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Mail className={`w-4 h-4 transition-colors duration-200 ${focusedField === "email" ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <input
                  type="email"
                  id="email-mobile"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 text-sm ${focusedField === "email" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.email ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email[0]}</span>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label htmlFor="username-mobile" className="block text-sm font-semibold text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <User className={`w-4 h-4 transition-colors duration-200 ${focusedField === "username" ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <input
                  type="text"
                  id="username-mobile"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 text-sm ${focusedField === "username" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.username ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.username[0]}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password-mobile" className="block text-sm font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className={`w-4 h-4 transition-colors duration-200 ${focusedField === "password" ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-mobile"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 text-sm ${focusedField === "password" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.password ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="flex absolute inset-y-0 right-0 items-center pr-3"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password[0]}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="password2-mobile" className="block text-sm font-semibold text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className={`w-4 h-4 transition-colors duration-200 ${focusedField === "password2" ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="password2-mobile"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password2")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 text-sm ${focusedField === "password2" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.password2 ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password2')}
                  className="flex absolute inset-y-0 right-0 items-center pr-3"
                  aria-label="Toggle confirm password visibility"
                >
                  {showPassword2 ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password2 && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password2[0]}</span>
                </div>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-1">
              <label htmlFor="student_id-mobile" className="block text-sm font-semibold text-gray-700">
                Student ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <IdCard className={`w-4 h-4 transition-colors duration-200 ${focusedField === "student_id" ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <input
                  type="text"
                  id="student_id-mobile"
                  name="student_id"
                  placeholder="e.g., 22-01-01-001"
                  value={formData.student_id}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("student_id")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white placeholder-gray-400 text-sm ${focusedField === "student_id" ? "border-yellow-400 ring-4 ring-yellow-400/20" : errors.student_id ? "border-red-400 ring-4 ring-red-400/20" : "border-gray-200 hover:border-gray-300"}`}
                />
              </div>
              {errors.student_id && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.student_id[0]}</span>
                </div>
              )}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label htmlFor="department-mobile" className="block text-sm font-semibold text-gray-700">
                Department
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Building className="w-4 h-4 text-gray-400" />
                </div>
                {departmentLoading ? (
                  <div className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center text-xs text-gray-500">
                    <Loader2 className="mr-2 w-3 h-3 text-gray-400 animate-spin" />
                    Loading Departments...
                  </div>
                ) : (
                  <select
                    id="department-mobile"
                    name="department"
                    value={formData.department === null ? "" : formData.department}
                    onChange={handleSelectChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 text-sm"
                  >
                    <option value="">Select Department</option>
                    {departments && departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No departments available</option>
                    )}
                  </select>
                )}
              </div>
              {errors.department && (
                <div className="flex gap-2 items-center text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.department[0]}</span>
                </div>
              )}
            </div>

            {/* Batch & Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="batch-mobile" className="block text-sm font-semibold text-gray-700">
                  Batch
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="batch-mobile"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 placeholder-gray-400 text-sm"
                    placeholder="e.g., 2024"
                  />
                </div>
                {errors.batch && (
                  <div className="flex gap-2 items-center text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.batch[0]}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="section-mobile" className="block text-sm font-semibold text-gray-700">
                  Section
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="section-mobile"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 placeholder-gray-400 text-sm"
                    placeholder="e.g., A"
                  />
                </div>
                {errors.section && (
                  <div className="flex gap-2 items-center text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.section[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* General Error Message */}
            {errors.non_field_errors && (
              <div className="flex gap-3 items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="flex-shrink-0 w-4 h-4 text-red-500" />
                <span className="text-xs text-red-700">{errors.non_field_errors}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || departmentLoading}
              className="px-4 py-3 mt-6 w-full font-semibold text-black bg-gradient-to-r from-yellow-300 to-lime-300 rounded-lg shadow-lg transition-all duration-300 hover:from-yellow-400 hover:to-lime-400 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">REGISTERING...</span>
                </div>
              ) : departmentLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">PREPARING...</span>
                </div>
              ) : (
                <span className="text-sm font-bold tracking-wider">REGISTER</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;