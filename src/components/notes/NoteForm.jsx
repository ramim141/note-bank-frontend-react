import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- API Services ---
import { departmentService } from '../../api/apiService/departmentService';
import { categoryService } from '../../api/apiService/categoryService';
import { courseService } from '../../api/apiService/courseService';
import { noteService } from '../../api/apiService/noteService';
import { facultyService } from '../../api/apiService/facultyService';
import { useAuth } from '../../context/useAuth';

// --- Icons ---
import {
  FaUpload, FaFileAlt, FaTag, FaGraduationCap, FaBuilding, FaCalendarAlt, FaEdit,
  FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaUserTie
} from 'react-icons/fa';

const NoteForm = ({ initialData = {}, onUploadSuccess, isModal = false }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    file: null,
    category: initialData.category || '',
    course: initialData.course || '',
    department: initialData.department || '',
    faculty: initialData.faculty || '',
    semester: initialData.semester || '',
    tags: initialData.tags || [],
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
        setDepartmentsLoading(true);
        const deptData = await departmentService.getAllDepartments();
        setDepartments(Array.isArray(deptData) ? deptData : deptData.data || []);
        setDepartmentsLoading(false);

        setCategoriesLoading(true);
        const catData = await categoryService.getAllCategories();
        setCategories(catData);
        setCategoriesLoading(false);

        setCoursesLoading(true);
        const courseData = await courseService.getAllCourses();
        setCourses(courseData);
        setCoursesLoading(false);

        setFacultiesLoading(true);
        const facultyData = await facultyService.getAllFaculties();
        setFaculties(facultyData);
        setFacultiesLoading(false);

      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load some essential data. Please refresh the page.");
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

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      setIsLoading(false);
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.file || !formData.category) {
      toast.error("Title, File, and Category are required.");
      setErrors({ non_field_errors: "Title, File, and Category are required." });
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('file', formData.file);
    if (formData.category) formDataToSend.append('category', formData.category);
    if (formData.course) formDataToSend.append('course', formData.course);
    if (formData.department) formDataToSend.append('department', formData.department);
    if (formData.semester) formDataToSend.append('semester', formData.semester);
    if (formData.faculty) formDataToSend.append('faculty', formData.faculty);
    if (formData.tags.length > 0) formDataToSend.append('tags', formData.tags.join(','));

    try {
      if (onUploadSuccess) {
        // This is for fulfilling a request from the modal
        await onUploadSuccess(formDataToSend);
      } else {
        // This is for a standard note upload from the page
        await noteService.uploadNote(formDataToSend, token);
        toast.success('Note uploaded successfully! Awaiting admin approval.');
        navigate('/my-notes');
      }

      setFormData({
        title: '', description: '', file: null, category: '', course: '',
        department: '', faculty: '', semester: '', tags: [],
      });

    } catch (error) {
      console.error('Upload note error:', error);
      let errorMessage = 'An unexpected error occurred during upload. Please try again.';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          const fieldErrors = Object.keys(errorData).map(key => `${key}: ${errorData[key][0]}`).join(' ');
          errorMessage = fieldErrors || errorMessage;
        }
        setErrors(errorData);
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {/* Title */}
      <div className="group">
        <label htmlFor="title" className="flex items-center mb-2 text-sm font-semibold text-gray-700">
          <FaFileAlt className="mr-2 text-violet-500" />
          Title <span className="ml-1 text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white/50 hover:shadow-lg group-hover:border-violet-300"
            placeholder="Enter note title..."
          />
          <FaFileAlt className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 group-focus-within:text-violet-500" />
        </div>
        {errors.title && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.title[0]}</span>}
      </div>

      {/* Description */}
      <div className="group">
        <label htmlFor="description" className="flex items-center mb-2 text-sm font-semibold text-gray-700">
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
            className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/50 hover:shadow-lg group-hover:border-purple-300"
            placeholder="Describe your note content..."
          />
          <FaEdit className="absolute top-4 left-4 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500" />
        </div>
        {errors.description && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.description[0]}</span>}
      </div>

      {/* File Upload */}
      <div className="group">
        <label className="flex items-center mb-2 text-sm font-semibold text-gray-700">
          <FaUpload className="mr-2 text-indigo-500" />
          Upload File <span className="ml-1 text-red-500">*</span>
        </label>
        <div
          className={`relative border-2 rounded-2xl p-8 transition-all duration-300 ${dragActive ? "bg-indigo-50 border-indigo-500" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"} ${formData.file ? "border-green-500 bg-green-50" : ""}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
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
              <div className="flex justify-center items-center space-x-3">
                <FaCheckCircle className="text-3xl text-green-500" />
                <div>
                  <p className="text-lg font-semibold text-green-700">{formData.file.name}</p>
                  <p className="text-sm text-green-600">File selected successfully</p>
                </div>
              </div>
            ) : (
              <div>
                <FaCloudUploadAlt className="mx-auto mb-4 text-4xl text-gray-400" />
                <p className="mb-2 text-lg font-semibold text-gray-700">Drag and drop your file here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, PPT, PPTX files</p>
              </div>
            )}
          </div>
        </div>
        {errors.file && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.file[0]}</span>}
      </div>

      {/* Form Grid for Dropdowns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Category */}
        <div className="group">
          <label htmlFor="category" className="flex items-center mb-2 text-sm font-semibold text-gray-700">
            <FaTag className="mr-2 text-pink-500" />
            Category <span className="ml-1 text-red-500">*</span>
          </label>
          {categoriesLoading ? (
            <div className="flex justify-center items-center px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white/50">
              <FaSpinner className="mr-2 text-pink-500 animate-spin" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <div className="relative">
              <select
                id="category" name="category" value={formData.category} onChange={handleChange}
                className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white/50 hover:shadow-lg group-hover:border-pink-300"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              <FaTag className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 pointer-events-none group-focus-within:text-pink-500" />
            </div>
          )}
          {errors.category && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.category[0]}</span>}
        </div>

        {/* Course */}
        <div className="group">
            <label htmlFor="course" className="flex items-center mb-2 text-sm font-semibold text-gray-700"><FaGraduationCap className="mr-2 text-blue-500" />Course</label>
            {coursesLoading ? <div className="flex justify-center items-center px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white/50"><FaSpinner className="mr-2 text-blue-500 animate-spin" /><span className="text-gray-500">Loading...</span></div> : (
              <div className="relative">
                <select id="course" name="course" value={formData.course} onChange={handleChange} className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 hover:shadow-lg group-hover:border-blue-300">
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (<option key={course.id} value={course.id}>{course.name}</option>))}
                </select>
                <FaGraduationCap className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 pointer-events-none group-focus-within:text-blue-500" />
              </div>
            )}
            {errors.course && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.course[0]}</span>}
        </div>

        {/* Department */}
        <div className="group">
            <label htmlFor="department" className="flex items-center mb-2 text-sm font-semibold text-gray-700"><FaBuilding className="mr-2 text-green-500" />Department</label>
            {departmentsLoading ? <div className="flex justify-center items-center px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white/50"><FaSpinner className="mr-2 text-green-500 animate-spin" /><span className="text-gray-500">Loading...</span></div> : (
              <div className="relative">
                <select id="department" name="department" value={formData.department} onChange={handleChange} className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/50 hover:shadow-lg group-hover:border-green-300">
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
                </select>
                <FaBuilding className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 pointer-events-none group-focus-within:text-green-500" />
              </div>
            )}
            {errors.department && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.department[0]}</span>}
        </div>

        {/* Faculty */}
        <div className="group">
            <label htmlFor="faculty" className="flex items-center mb-2 text-sm font-semibold text-gray-700"><FaUserTie className="mr-2 text-blue-600" />Faculty</label>
            {facultiesLoading ? <div className="flex justify-center items-center px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white/50"><FaSpinner className="mr-2 text-blue-600 animate-spin" /><span className="text-gray-500">Loading...</span></div> : (
              <div className="relative">
                <select id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 bg-white/50 hover:shadow-lg group-hover:border-blue-400">
                  <option value="">-- Select Faculty --</option>
                  {faculties.map((faculty) => (<option key={faculty.id} value={faculty.id}>{faculty.name}</option>))}
                </select>
                <FaUserTie className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600" />
              </div>
            )}
            {errors.faculty && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.faculty[0]}</span>}
        </div>

        {/* Semester */}
        <div className="group">
            <label htmlFor="semester" className="flex items-center mb-2 text-sm font-semibold text-gray-700"><FaCalendarAlt className="mr-2 text-orange-500" />Semester</label>
            <div className="relative">
                <input type="text" id="semester" name="semester" value={formData.semester} onChange={handleChange} className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 bg-white/50 hover:shadow-lg group-hover:border-orange-300" placeholder="e.g., Fall 2024" />
                <FaCalendarAlt className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 group-focus-within:text-orange-500" />
            </div>
            {errors.semester && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.semester[0]}</span>}
        </div>

        {/* Tags */}
        <div className="group">
            <label htmlFor="tags" className="flex items-center mb-2 text-sm font-semibold text-gray-700"><FaTag className="mr-2 text-cyan-500" />Tags</label>
            <div className="relative">
                <input type="text" id="tags" name="tags" value={formData.tags.join(", ")} onChange={handleTagsChange} className="px-4 py-3 pl-12 w-full rounded-2xl border-2 border-gray-200 shadow-sm backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white/50 hover:shadow-lg group-hover:border-cyan-300" placeholder="math, calculus, derivatives..." />
                <FaTag className="absolute left-4 top-1/2 text-gray-400 transition-colors duration-300 transform -translate-y-1/2 group-focus-within:text-cyan-500" />
            </div>
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
            {errors.tags && <span className="flex items-center mt-1 text-sm text-red-500"><span className="mr-2 w-1 h-1 bg-red-500 rounded-full"></span>{errors.tags[0]}</span>}
        </div>
      </div>

      {/* General Error Message */}
      {errors.non_field_errors && (
        <div className="p-4 text-sm text-center text-red-700 bg-red-100 rounded-2xl border border-red-300">
          {Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6">
        <button type="submit" className="flex justify-center items-center px-6 py-4 space-x-3 w-full font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading || categoriesLoading || coursesLoading || departmentsLoading || facultiesLoading}>
          {isLoading ? (
            <><FaSpinner className="text-xl animate-spin" /><span>Submitting...</span></>
          ) : (categoriesLoading || coursesLoading || departmentsLoading || facultiesLoading) ? (
            <><FaSpinner className="text-xl animate-spin" /><span>Preparing...</span></>
          ) : (
            <><FaCloudUploadAlt className="text-xl" /><span>{isModal ? 'Submit Note' : 'Upload Note'}</span></>
          )}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return formFields;
  }

  return (
    <div className="px-4 py-16 pb-32 mt-20 min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 rounded-full opacity-75 blur animate-pulse"></div>
            <div className="flex relative justify-center items-center mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 rounded-full shadow-2xl">
              <FaCloudUploadAlt className="text-3xl text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 md:text-5xl">
            Upload Your Note
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Share your knowledge with fellow students. Upload your notes and help build our learning community.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl bg-white/80 border-white/20">
          <div className="p-6 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600">
            <div className="flex justify-center items-center space-x-3">
              <FaEdit className="text-2xl text-white" />
              <h2 className="text-2xl font-bold text-white">Note Details</h2>
            </div>
          </div>
          {formFields}
        </div>
      </div>
    </div>
  );
};

export default NoteForm;