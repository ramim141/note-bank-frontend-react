// src/components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { departmentService } from '../../api/apiService/departmentService';
import { toast } from 'react-toastify'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  // --- State for Form Data ---
  const [formData, setFormData] = useState(() => {
    // Try to load form data from localStorage on initial render
    const savedFormData = localStorage.getItem('registerFormData');
    return savedFormData ? JSON.parse(savedFormData) : {
      username: '',
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: '',
      student_id: '',
      department: null,
      batch: '',
      section: '',
    };
  });
  // --- End State ---

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState(null);
  const navigate = useNavigate();

  // --- Effect to save form data to localStorage ---
  useEffect(() => {
    localStorage.setItem('registerFormData', JSON.stringify(formData));
  }, [formData]);
  // --- End Effect ---


  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Optional: Check localStorage first for departments
        const savedDepartments = localStorage.getItem('departments');
        if (savedDepartments) {
            setDepartments(JSON.parse(savedDepartments));
            setDepartmentLoading(false);
            return;
        }

        const data = await departmentService.getAllDepartments();
        setDepartments(data);
        setDepartmentLoading(false);
        // Save departments to localStorage for future use
        localStorage.setItem('departments', JSON.stringify(data));

      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentError("Failed to load departments. Please try again later.");
        setDepartmentLoading(false);
      }
    };
    fetchDepartments();
  }, []);

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

  const handleSelectChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value === '' ? null : parseInt(value, 10),
      });
       if (errors[name]) {
          setErrors({ ...errors, [name]: undefined });
       }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // ... (previous validation code)

    const dataToSend = { ...formData };

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      // --- START OF DEBUGGING CODE ---
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      const responseText = await response.text(); // Get response as text first
      console.log('Response text:', responseText);
      // --- END OF DEBUGGING CODE ---

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        // This block will catch non-2xx status codes
        try {
          // Check if response text is empty
          if (!responseText || responseText.trim() === '') {
            // Handle empty response body
            const errorMessage = `Registration failed with status ${response.status}. Please try again.`;
            toast.error(errorMessage);
            setErrors({ non_field_errors: errorMessage });
            return;
          }
          
          const errorData = JSON.parse(responseText); // Try to parse error response
          setErrors(errorData);
          if (errorData.non_field_errors) {
            toast.error(errorData.non_field_errors[0] || "Registration failed. Please try again.");
          } else {
            Object.keys(errorData).forEach(key => {
              if (errorData[key] && Array.isArray(errorData[key])) {
                toast.error(`${key}: ${errorData[key][0]}`);
              }
            });
          }
        } catch (parseError) {
          // If server response is not JSON (e.g., HTML error page)
          console.error('Failed to parse error response:', parseError);
          console.error('Error response text:', responseText);
          const errorMessage = responseText && responseText.trim() !== '' 
            ? 'Registration failed due to an unexpected server error.'
            : `Registration failed with status ${response.status}. Please try again.`;
          toast.error(errorMessage);
          setErrors({ non_field_errors: errorMessage });
        }
      } else {
        // If response is OK (2xx)
        try {
          // Check if response text is empty for successful responses
          if (!responseText || responseText.trim() === '') {
            // Empty response for successful registration is acceptable
            toast.success('Registration successful! Please check your email for verification.');
            localStorage.removeItem('registerFormData');
            navigate('/login');
            return;
          }
          
          JSON.parse(responseText); // Parse successful response to validate JSON
          toast.success('Registration successful! Please check your email for verification.');
          localStorage.removeItem('registerFormData');
          navigate('/login');
        } catch (parseError) {
          // If a 2xx response is not valid JSON (should not happen ideally)
          console.error('Failed to parse successful response:', parseError);
          console.error('Successful response text:', responseText);
          toast.error('Registration completed, but received invalid data.');
        }
      }
    } catch (error) {
      // This catches network errors or errors thrown by response.text() / JSON.parse() if they fail before the if(!response.ok) block
      console.error('Registration network or unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setErrors({ non_field_errors: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto w-full max-w-sm bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (other form fields) ... */}
        {/* Username, Email, Password, Confirm Password, Student ID, First Name, Last Name, Batch, Section */}

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
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
          {errors.username && <span id="username-error" className="text-sm text-red-500">{errors.username[0]}</span>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="email-error"
          />
          {errors.email && <span id="email-error" className="text-sm text-red-500">{errors.email[0]}</span>}
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
          {errors.password && <span id="password-error" className="text-sm text-red-500">{errors.password[0]}</span>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="password2-error"
          />
          {errors.password2 && <span id="password2-error" className="text-sm text-red-500">{errors.password2[0]}</span>}
        </div>

        {/* Student ID */}
        <div>
          <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
            Student ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            placeholder="e.g., 123-456-789"
            value={formData.student_id}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="student_id-error"
          />
          {errors.student_id && <span id="student_id-error" className="text-sm text-red-500">{errors.student_id[0]}</span>}
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="first_name-error"
          />
           {errors.first_name && <span id="first_name-error" className="text-sm text-red-500">{errors.first_name[0]}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="last_name-error"
          />
           {errors.last_name && <span id="last_name-error" className="text-sm text-red-500">{errors.last_name[0]}</span>}
        </div>

        {/* Department Dropdown */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department (Optional)
          </label>
          {departmentLoading ? (
            <p className="mt-1 text-sm text-gray-500">Loading departments...</p>
          ) : departmentError ? (
            <p className="mt-1 text-sm text-red-500">{departmentError}</p>
          ) : departments.length > 0 ? (
            <select
              id="department"
              name="department"
              value={formData.department === null ? '' : formData.department}
              onChange={handleSelectChange}
              className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-describedby="department-error"
            >
              <option value="">-- Select Department --</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No departments available.</p>
          )}
           {errors.department && <span id="department-error" className="text-sm text-red-500">{errors.department[0]}</span>}
        </div>

        {/* Batch */}
        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
            Batch (Optional)
          </label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="batch-error"
          />
           {errors.batch && <span id="batch-error" className="text-sm text-red-500">{errors.batch[0]}</span>}
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">
            Section (Optional)
          </label>
          <input
            type="text"
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-describedby="section-error"
          />
           {errors.section && <span id="section-error" className="text-sm text-red-500">{errors.section[0]}</span>}
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
          disabled={isLoading || departmentLoading}
        >
          {isLoading ? 'Registering...' : (departmentLoading ? 'Preparing...' : 'Register')}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?
        <a href="/login" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;