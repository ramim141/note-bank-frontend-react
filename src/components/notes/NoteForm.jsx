// src/components/notes/NoteForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- API Services ---
import { departmentService } from '../../api/apiService/departmentService';
import { categoryService } from '../../api/apiService/categoryService';
import { courseService } from '../../api/apiService/courseService';
import { noteService } from '../../api/apiService/noteService'; // Import noteService
import { useAuth } from '../../context/useAuth'; // To get user token for API calls
import { facultyService } from '../../api/apiService/facultyService';

// --- Icons ---
import {
  FaUpload, FaFileAlt, FaTag, FaGraduationCap, FaBuilding, FaCalendarAlt, FaEdit,
  FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaUserTie
} from 'react-icons/fa';

// --- Constants ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com";

const NoteForm = () => {
  const { token } = useAuth(); // Get token from AuthContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    category: '',
    course: '',
    department: '',
    faculty: '',
    semester: '',
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // --- Data for Dropdowns ---
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // --- Loading States for Dropdowns ---
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [facultiesLoading, setFacultiesLoading] = useState(true);

  // --- Fetching Dropdown Data ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch Departments
        try {
          const savedDepartments = localStorage.getItem('departments');
          if (savedDepartments) {
            setDepartments(JSON.parse(savedDepartments));
          } else {
            const data = await departmentService.getAllDepartments();
            setDepartments(data);
            localStorage.setItem('departments', JSON.stringify(data));
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
          setDepartments([]);
        }
        setDepartmentsLoading(false);

        // Fetch Categories
        try {
          const dataCategories = await categoryService.getAllCategories();
          setCategories(dataCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setCategories([]);
        }
        setCategoriesLoading(false);

        // Fetch Courses
        try {
          const dataCourses = await courseService.getAllCourses();
          setCourses(dataCourses);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setCourses([]);
        }
        setCoursesLoading(false);

        // Fetch Faculties
        try {
          const dataFaculties = await facultyService.getAllFaculties();
          setFaculties(dataFaculties);
        } catch (error) {
          console.error("Error fetching faculties:", error);
          setFaculties([]);
        }
        setFacultiesLoading(false);

      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load some dropdown data. Please try again.");
        setDepartmentsLoading(false);
        setCategoriesLoading(false);
        setCoursesLoading(false);
        setFacultiesLoading(false);
      }
    };
    fetchDropdownData();
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
      if (errors.file) {
        setErrors({ ...errors, file: undefined });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({
        ...formData,
        file: e.dataTransfer.files[0],
      });
      if (errors.file) {
        setErrors({ ...errors, file: undefined });
      }
    }
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({
      ...formData,
      tags: tagsArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    console.log('Token:', token);

    if (!token) {
      toast.error("Authentication token is missing. Please login again.");
      console.error("No authentication token found.");
      setIsLoading(false);
      // Optionally redirect to login page
      navigate('/login');
      return;
  }

    if (!formData.title || !formData.file || !formData.category) { // Added category as required
      toast.error("Title, File, and Category are required.");
      setErrors({ non_field_errors: "Title, File, and Category are required." });
      setIsLoading(false);
      return;
    }

    // Prepare data for API using FormData
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('file', formData.file);
    if (formData.category) formDataToSend.append('category', formData.category);
    if (formData.course) formDataToSend.append('course', formData.course);
    if (formData.department) formDataToSend.append('department', formData.department);
    if (formData.semester) formDataToSend.append('semester', formData.semester);
    if (formData.faculty) formDataToSend.append('faculty', formData.faculty);
    if (formData.tags.length > 0) formDataToSend.append('tags', formData.tags.join(',')); // Send tags as comma-separated string

    try {
      // Make sure token is available
      if (!token) {
          toast.error("You are not authenticated. Please login.");
          navigate('/login');
          setIsLoading(false);
          return;
      }

      await noteService.uploadNote(formDataToSend, token); // Use the service function

      // Handle success and errors as shown in previous example
      toast.success('Note uploaded successfully! Awaiting admin approval.');
      setFormData({ // Clear form after successful upload
        title: '', description: '', file: null, category: '', course: '',
        department: '', faculty: '', semester: '', tags: [],
      });
      navigate('/my-notes'); // Redirect to "My Notes" page

    } catch (error) {
      console.error('Upload note error:', error);
      let errorMessage = 'An unexpected error occurred during upload. Please try again.';
      if (error.message) {
          errorMessage = error.message; // Use server's message if available
      } else if (error.non_field_errors) {
          errorMessage = error.non_field_errors[0];
      } else {
          // Try to extract specific field errors
          Object.keys(error).forEach(key => {
            if (error[key] && Array.isArray(error[key])) {
              errorMessage = `${key}: ${error[key][0]}`;
            }
          });
      }
      toast.error(errorMessage);
      setErrors(error); // Set errors for field-specific error display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 rounded-full blur opacity-75 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4">
              <FaCloudUploadAlt className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Upload Your Note
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your knowledge with fellow students. Upload your notes and help build our learning community.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-6">
            <div className="flex items-center justify-center space-x-3">
              <FaEdit className="text-white text-2xl" />
              <h2 className="text-2xl font-bold text-white">Note Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div className="group">
              <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaFileAlt className="mr-2 text-violet-500" />
                Title <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-violet-300"
                  placeholder="Enter note title..."
                />
                <FaFileAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-300" />
              </div>
              {errors.title && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.title[0]}</span>}
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaEdit className="mr-2 text-purple-500" />
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-purple-300 resize-none"
                  placeholder="Describe your note content..."
                />
                <FaEdit className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              </div>
              {errors.description && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.description[0]}</span>}
            </div>

            {/* File Upload */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaUpload className="mr-2 text-indigo-500" />
                Upload File <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`relative border-2 rounded-2xl p-8 transition-all duration-300 ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"} ${formData.file ? "border-green-500 bg-green-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  {formData.file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FaCheckCircle className="text-green-500 text-3xl" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">{formData.file.name}</p>
                        <p className="text-sm text-green-600">File selected successfully</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, PPT, PPTX files</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.file && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.file[0]}</span>}
            </div>

            {/* Form Grid for Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="group">
                <label htmlFor="category" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaTag className="mr-2 text-pink-500" />
                  Category <span className="text-red-500 ml-1">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white/50">
                    <FaSpinner className="animate-spin text-pink-500 mr-2" />
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : categories.length > 0 ? (
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-pink-300 appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <FaTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-300 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-3">No categories available.</p>
                )}
                {errors.category && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.category[0]}</span>}
              </div>

              {/* Course */}
              <div className="group">
                <label htmlFor="course" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaGraduationCap className="mr-2 text-blue-500" />
                  Course
                </label>
                {coursesLoading ? (
                  <div className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white/50">
                    <FaSpinner className="animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500">Loading courses...</span>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="relative">
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-blue-300 appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <FaGraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-3">No courses available.</p>
                )}
                {errors.course && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.course[0]}</span>}
              </div>

              {/* Department */}
              <div className="group">
                <label htmlFor="department" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaBuilding className="mr-2 text-green-500" />
                  Department
                </label>
                {departmentsLoading ? (
                  <div className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white/50">
                    <FaSpinner className="animate-spin text-green-500 mr-2" />
                    <span className="text-gray-500">Loading departments...</span>
                  </div>
                ) : departments.length > 0 ? (
                  <div className="relative">
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-green-300 appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-3">No departments available.</p>
                )}
                {errors.department && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.department[0]}</span>}
              </div>

              <div className="group">
                <label htmlFor="faculty" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaUserTie className="mr-2 text-blue-600" /> {/* Added Faculty Icon */}
                  Faculty
                </label>
                {facultiesLoading ? (
                  <div className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white/50">
                    <FaSpinner className="animate-spin text-blue-600 mr-2" />
                    <span className="text-gray-500">Loading faculties...</span>
                  </div>
                ) : faculties.length > 0 ? (
                  <div className="relative">
                    <select
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-blue-400 appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Faculty --</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                    <FaUserTie className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-3">No faculties available.</p>
                )}
                {errors.faculty && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.faculty[0]}</span>}
              </div>

             <div>
               {/* Semester */}
               <div className="group">
                <label htmlFor="semester" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="mr-2 text-orange-500" />
                  Semester
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-orange-300"
                    placeholder="e.g., Fall 2024"
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                </div>
                {errors.semester && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.semester[0]}</span>}
              </div>
            </div>

            {/* Tags */}
            <div className="group">
              <label htmlFor="tags" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaTag className="mr-2 text-cyan-500" />
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags.join(", ")}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-lg group-hover:border-cyan-300"
                  placeholder="math, calculus, derivatives..."
                />
                <FaTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-300" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              {errors.tags && <span className="text-sm text-red-500 mt-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>{errors.tags[0]}</span>}
            </div>
             </div>

            {/* General Error Message */}
            {errors.non_field_errors && (
              <div className="p-4 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-2xl">
                {errors.non_field_errors}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                disabled={isLoading || categoriesLoading || coursesLoading || departmentsLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Uploading...</span>
                  </>
                ) : categoriesLoading || coursesLoading || departmentsLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-xl" />
                    <span>Upload Note</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;