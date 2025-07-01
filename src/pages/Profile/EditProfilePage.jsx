// src/pages/Profile/EditProfilePage.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Import necessary icons
import { FaUser, FaCamera, FaSave, FaArrowLeft, FaUniversity, FaBuilding, FaMobile, FaGlobe, FaBirthdayCake, FaVenusMars, FaInfoCircle, FaCode, FaUsers as BatchIcon, FaSpinner } from 'react-icons/fa';

// --- CORRECTED IMPORTS ---
// Import AuthContext and useAuth hook
import { AuthContext, useAuth } from '../../context/AuthContext'; // Ensure correct export and path
// Import API service functions
import { getUserProfile, updateUserProfile } from '../../api/apiService/userService'; // Correct import
import { departmentService } from '../../api/apiService/departmentService'; // Correct import

// Import UI components (adjust paths as per your project structure)
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import { Card } from '../../components/Profile/Card'; // Assuming Card is a named export
import Avatar from '../../components/Profile/avatar';
import ProfileEditForm from '../../components/Profile/ProfileEditForm';
import { toast } from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  // Get authentication state and functions from AuthContext
  // Destructure loading state as well
  const { user: authUser, logout, fetchUserProfile, token, isAuthenticated, loading: authLoading } = useAuth();

  // State for loading, errors, departments, and initial profile data
  const [loadingPage, setLoadingPage] = useState(true); // Page-specific loading
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]); // Initialize departments as an empty array
  const [initialData, setInitialData] = useState(null); // To store fetched profile data

  // Ref for file input
  const fileInputRef = useRef(null);

  // Effect to load initial data when the component mounts or auth state changes
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingPage(true); // Start page-specific loading
        setError(null);

        const [profileRes, departmentsRes] = await Promise.all([
          getUserProfile(),
          departmentService.getAllDepartments()
        ]);
        
        const profile = profileRes.data;
        
        const loadedDepartments = departmentsRes.data?.results || departmentsRes.data || [];
        const formattedDepartments = loadedDepartments
          .filter(dept => dept && dept.id && dept.name)
          .map(dept => ({
            value: dept.id,
            label: dept.name
          }));
        setDepartments(formattedDepartments);

        const userDepartmentId = profile.department || profile.department_name;
        const foundDepartment = formattedDepartments.find(dept => dept.value === userDepartmentId);

        setInitialData(profile); // Set the raw profile data
        
        // If you are setting formData here, you need to do it carefully
        // Usually, ProfileEditForm would manage its own state based on initialData prop
        
      } catch (err) {
        console.error("Error loading initial data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please log in again.");
          logout();
        } else {
          setError('Failed to load profile data. Please try again.');
        }
      } finally {
        setLoadingPage(false); // Stop page-specific loading
      }
    };

    // Only load data if user is authenticated and auth state is not loading
    if (isAuthenticated && token) {
      loadInitialData();
    } else if (!isAuthenticated && !authLoading) { // If not authenticated AND auth is not loading
      setError("Please log in to edit your profile.");
      setLoadingPage(false); // Stop loading if not authenticated
    }
    // If authLoading is true, we wait for it to finish.
    // If isAuthenticated is true, we load data.
    // If isAuthenticated is false and authLoading is false, we show login error.

  }, [isAuthenticated, token, logout, fetchUserProfile, navigate, authLoading]); // Dependencies

  // Handler to navigate back to the profile page
  const handleCancel = () => {
    navigate('/profile');
  };

  // Render loading state if auth state is still loading OR page data is loading
  if (authLoading || loadingPage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  // Render error state if any occurred during data loading or auth
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#837CEE] via-[#DAADEC] to-[#B2E3E2] text-center p-4">
        <p className="mb-4 text-lg font-semibold text-red-600">{error}</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  // Main render for the edit profile page
  return (
    <div className="px-4 py-8 mx-auto max-w-2xl">
      {/* Header Section */}
      <div className="relative max-w-6xl px-6 py-12 mx-auto overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl mb-[-2rem] z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-20"></div>
          <div className="absolute left-10 top-20 w-20 h-20 bg-white rounded-full opacity-10"></div>
          <div className="absolute right-10 bottom-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
        </div>
        <div className="flex relative z-10 flex-col justify-between items-center md:flex-row">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Edit Your Profile</h1>
            <p className="text-blue-100">Update your personal information and preferences</p>
          </div>
          <Button onClick={handleCancel} variant="outline" className="flex items-center px-4 py-2 mt-4 text-white rounded-lg border backdrop-blur-sm transition-all duration-300 md:mt-0 bg-white/10 hover:bg-white/20 border-white/20">
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </Button>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto mt-[-2rem] relative z-20">
        <Card className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="p-8">
            <ProfileEditForm
              initialData={initialData} // Pass fetched profile data
              departments={departments} // Pass formatted departments list
              onCancel={() => navigate('/profile')} // Handle cancel action
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;