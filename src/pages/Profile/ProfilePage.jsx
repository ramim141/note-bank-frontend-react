// src/components/Profile/ProfilePage.jsx

"use client"
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

// --- CORRECTED IMPORTS ---
import { getUserProfile } from "/src/api/apiService/userService.js";
// Assuming departments are not directly needed here in ProfilePage, but if they were, import them.
// import { departmentService } from '/src/api/apiService/departmentService.js';
import { AuthContext, useAuth } from '../../context/AuthContext'; // Adjust path if needed

// --- IMPORT UI COMPONENTS ---
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
// import Dropdown from '../../components/ui/Dropdown'; // Not used in this page
import { Card } from '../../components/Profile/Card'; // Assuming Card is a named export
// import { Badge } from '../../components/Profile/badge'; // Not used in this page
import { User, Mail, Phone, GraduationCap, Building, Book, Calendar, Award, BookOpen, Bookmark } from "lucide-react"; // Using lucide-react

const ProfilePage = () => {
  const navigate = useNavigate();
  // Get authentication state and functions from AuthContext
  const { user: authUser, token, isAuthenticated, fetchUserProfile, loading: authLoading } = useAuth(); // Destructure auth loading state

  // State management for profile data, loading, error, and editing mode
  const [profileData, setProfileData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // Renamed to avoid confusion with AuthContext loading
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [departments] = useState([]); // If needed for edit form, but currently not used in view mode

  // Effect hook to fetch profile data
  useEffect(() => {
    // --- IMPORTANT ---
    // Only proceed if auth state is not loading, and user is authenticated
    if (authLoading) {
      console.log("ProfilePage: Waiting for auth loading to finish.");
      return; // Wait for AuthContext to initialize
    }

    if (!isAuthenticated || !token) {
      // If not authenticated after auth context is ready
      setError("Please log in to view your profile.");
      setPageLoading(false); // Stop page loading
      // Optionally navigate to login immediately:
      // navigate('/login'); 
      return;
    }

    // --- Fetch Profile Data ---
    const fetchProfile = async () => {
      setPageLoading(true); // Start page loading
      setError(null);
      try {
        const response = await getUserProfile();
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile for page:", err);
        setError("Failed to load profile data.");
      } finally {
        setPageLoading(false); // Stop page loading
      }
    };

    fetchProfile();

  }, [isAuthenticated, token, fetchUserProfile, navigate, authLoading]); // Dependencies for the effect

  // Handler to close the editing form and return to view mode
  const handleCloseEdit = () => {
    setIsEditing(false);
    // Optionally refetch profile data after closing edit form
    // fetchUserProfile();
  };

  // Render loading state if page data is still loading OR auth state is loading
  if (pageLoading || authLoading) { // Check both loading states
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <div className="w-16 h-16 rounded-full border-4 border-white animate-spin border-t-transparent"></div>
      </div>
    );
  }

  // Render error state if any occurred during data loading or auth
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <div className="animate-bounce">
          <p className="text-xl text-red-500">{error}</p>
          {!isAuthenticated && ( // Show login button only if not authenticated
             <Button onClick={() => navigate('/login')} className="mt-4">Go to Login</Button>
          )}
        </div>
      </div>
    );
  }

  // --- Main Page Layout ---
  return (
    <div className="p-6 pt-32 min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 animate-gradient-x">
      <div className="mx-auto max-w-7xl">
        {/* Header Section with Animation */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="mb-2 text-5xl font-bold text-purple-800 animate-pulse">Profile Dashboard</h1>
          <div className="mb-4 w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-expand"></div>
          <p className="text-2xl text-gray-700 delay-300 animate-fade-in-up">
            Welcome back,{" "}
            <span className="inline-block font-bold text-blue-600 animate-bounce">
              {profileData?.first_name || authUser?.first_name || "User"}!
            </span>
          </p>
        </div>

        {/* Content Area - Toggle between Profile View and Edit Form */}
        {!isEditing ? (
          // Profile View Mode - Using a Grid Layout
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Sidebar - User Details */}
            <div className="space-y-6 lg:col-span-1 animate-slide-in-left">
              {/* Profile Details Card */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl hover:bg-white/30 group">
                <div className="overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r animate-pulse from-purple-400/20 to-pink-400/20"></div>
                  <div className="flex relative z-10 flex-col items-center p-6 text-center">
                    <div className="relative mb-4 group">
                      <div className="flex justify-center items-center w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-700 transform hover:scale-110 hover:rotate-12 animate-float">
                        {profileData?.profile_picture_url ? (
                          <img
                            src={profileData.profile_picture_url || "/placeholder.svg"}
                            alt="Profile"
                            className="object-cover w-full h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-white transition-all duration-500 group-hover:scale-125">
                            {profileData?.first_name?.[0] || authUser?.first_name?.[0] || "R"}
                            {profileData?.last_name?.[0] || authUser?.last_name?.[0] || "A"}
                          </span>
                        )}
                      </div>
                      {/* Rating Badge */}
                      <div className="flex absolute -right-2 -bottom-2 items-center px-1 py-1 text-sm font-bold text-white bg-green-500 rounded-full transition-all duration-500 transform hover:scale-125 hover:bg-green-400 animate-bounce-slow">
                        <span className="mx-auto animate-spin-slow">⭐</span>
                        {(profileData?.total_notes_liked_by_others || 0).toFixed(1)}
                      </div>
                    </div>

                    <h2 className="mb-1 text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                      {profileData?.first_name} {profileData?.last_name}
                    </h2>
                    <p className="mb-4 text-gray-600 transition-all duration-300 group-hover:text-gray-700">
                      @{profileData?.username}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="px-4 py-2 text-center bg-blue-100 rounded-xl transition-all duration-500 transform cursor-pointer hover:scale-110 hover:bg-blue-200 hover:shadow-lg">
                        <div className="text-2xl font-bold text-blue-600 animate-count-up">
                          {profileData?.total_notes_uploaded || 0}
                        </div>
                        <div className="text-sm text-blue-800">Notes</div>
                      </div>
                      <div className="px-4 py-2 text-center bg-purple-100 rounded-xl transition-all duration-500 transform cursor-pointer hover:scale-110 hover:bg-purple-200 hover:shadow-lg">
                        <div className="text-2xl font-bold text-purple-600 animate-count-up">
                          {profileData?.total_bookmarked_notes_by_user || 0}
                        </div>
                        <div className="text-sm text-purple-800">Bookmarks</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-center px-6 pb-6 mt-6">
                  <Button
                    onClick={() => navigate('/edit-profile')}
                    className="px-8 py-3 text-lg text-white bg-purple-600 rounded-xl transition-all duration-300 animate-pulse transform hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group"
                  >
                    <User className="mr-2 w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </Card>

              {/* Education Section */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 delay-200 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left">
                <div className="flex items-center mb-4 group">
                  <GraduationCap className="mr-3 w-6 h-6 text-blue-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-blue-700">
                    Education
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: GraduationCap,
                      label: "University",
                      value: profileData?.university || "Not set",
                      color: "from-blue-500 to-blue-600",
                    },
                    {
                      icon: Building,
                      label: "Department",
                      value: profileData?.department_name || "Not set",
                      color: "from-purple-500 to-purple-600",
                    },
                    {
                      icon: Calendar,
                      label: "Student ID",
                      value: profileData?.student_id || "Not set",
                      color: "from-pink-500 to-pink-600",
                    },
                    {
                      icon: User,
                      label: "Batch(Section)",
                      value: `${profileData?.batch || ""}(${profileData?.section || ""})`,
                      color: "from-teal-500 to-teal-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-right`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className="mr-3 w-5 h-5 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium opacity-90">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skills Section */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left delay-400">
                <div className="flex items-center mb-4 group">
                  <Award className="mr-3 w-6 h-6 text-purple-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                    Skills
                  </h3>
                </div>
                <div className="text-gray-600">
                  {profileData?.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-purple-200 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="animate-pulse">No skills added yet.</p>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left delay-600">
                <div className="space-y-3">
                  <Button className="flex justify-center items-center px-4 py-3 w-full font-bold text-white bg-purple-600 rounded-xl transition-all duration-300 transform hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group">
                    <BookOpen className="mr-2 w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
                    My Notes
                  </Button>
                  <Button className="flex justify-center items-center px-4 py-3 w-full font-bold text-white bg-purple-600 rounded-xl transition-all duration-300 transform hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group">
                    <Bookmark className="mr-2 w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
                    My Bookmarks
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Content - Information Sections */}
            <div className="space-y-6 lg:col-span-2 animate-slide-in-right">
              {/* Profile Header with Edit Button */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="animate-fade-in-left">
                    <h2 className="text-3xl font-bold text-gray-800 transition-all duration-300 hover:text-purple-700">
                      {profileData?.first_name} {profileData?.last_name}
                    </h2>
                    <p className="text-gray-600 transition-all duration-300 hover:text-gray-700">Student Profile</p>
                  </div>
                  <Button
                    onClick={() => navigate('/edit-profile')}
                    className="flex items-center px-6 py-2 text-white bg-purple-600 rounded-xl transition-all duration-300 transform hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group animate-fade-in-right"
                  >
                    <User className="mr-2 w-4 h-4 transition-all duration-300 group-hover:rotate-12" />
                    Edit Profile
                  </Button>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 delay-200 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right">
                <div className="flex items-center mb-6 group">
                  <Mail className="mr-3 w-6 h-6 text-green-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-green-700">
                    Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: profileData?.email || "Not set",
                      color: "from-blue-500 to-blue-600",
                    },
                    {
                      icon: Phone,
                      label: "Mobile",
                      value: profileData?.mobile_number || "Not set",
                      color: "from-green-500 to-green-600",
                    },
                    {
                      icon: User,
                      label: "Website",
                      value: profileData?.website || "Not set",
                      color: "from-purple-500 to-purple-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className="mr-3 w-6 h-6 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium opacity-90">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Basic Information */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right delay-400">
                <div className="flex items-center mb-6 group">
                  <User className="mr-3 w-6 h-6 text-orange-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-orange-700">
                    Basic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    {
                      icon: User,
                      label: "Gender",
                      value: profileData?.gender || "Not set",
                      color: "from-pink-500 to-pink-600",
                    },
                    {
                      icon: Calendar,
                      label: "Birthday",
                      value: profileData?.birthday || "Not set",
                      color: "from-yellow-500 to-orange-500",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className="mr-3 w-6 h-6 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium opacity-90">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Academic Activity */}
              <Card className="rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-500 transform bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right delay-600">
                <div className="flex items-center mb-6 group">
                  <Book className="mr-3 w-6 h-6 text-purple-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                    Academic Activity
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  {[
                    {
                      icon: BookOpen,
                      value: profileData?.total_notes_uploaded ?? 0,
                      label: "Notes Uploaded",
                      color: "bg-blue-100",
                      textColor: "text-blue-600",
                    },
                    {
                      icon: Bookmark,
                      value: profileData?.total_bookmarked_notes_by_user ?? 0,
                      label: "Bookmarks",
                      color: "bg-purple-100",
                      textColor: "text-purple-600",
                    },
                    {
                      icon: Award,
                      value: profileData?.total_notes_liked_by_others ?? 0,
                      label: "Total Likes",
                      color: "bg-red-100",
                      textColor: "text-red-600",
                    },
                    {
                      icon: Award, // Placeholder icon
                      value: 0,
                      label: "Total Reviews",
                      color: "bg-orange-100",
                      textColor: "text-orange-600",
                    },
                    {
                      icon: Award, // Placeholder icon
                      value: "0.0",
                      label: "Avg. Rating",
                      color: "bg-green-100",
                      textColor: "text-green-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-4 space-y-2 text-center rounded-xl ${item.color} transform transition-all duration-500 hover:scale-110 hover:shadow-lg cursor-pointer animate-bounce-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className={`w-8 h-8 ${item.textColor} transition-all duration-300 hover:scale-125`} />
                      <div className={`text-3xl font-bold ${item.textColor} animate-count-up`}>{item.value}</div>
                      <div className={`text-sm font-medium ${item.textColor.replace("600", "800")}`}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          // Edit Form View with Animation
          <div className="mx-auto max-w-3xl animate-fade-in">
            {/* Placeholder for the removed ProfileEditForm */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;