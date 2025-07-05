// src/components/Profile/ProfilePage.jsx

"use client"
import { useNavigate } from "react-router-dom";
import React from "react";

// --- IMPORTS ---
import { AuthContext, useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Card } from '../../components/Profile/Card';
import { User, Mail, Phone, GraduationCap, Building, Book, Calendar, Award, BookOpen, Bookmark } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  // Use AuthContext for user data and auth state
  const { user, isAuthenticated, loading } = useAuth();

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <div className="w-16 h-16 border-4 border-white rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  // --- Not Authenticated State ---
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
        <div className="animate-bounce">
          <p className="text-xl text-red-500">Please log in to view your profile.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">Go to Login</Button>
        </div>
      </div>
    );
  }

  console.log("User object in ProfilePage:", user);

  // --- Main Page Layout ---
  return (
    <div className="min-h-screen p-6 pt-32 bg-white animate-gradient-x">
      <div className="mx-auto max-w-7xl">
        {/* Header Section with Animation */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="mb-2 text-5xl font-bold text-purple-800 animate-pulse">Profile Dashboard</h1>
          <div className="w-32 h-1 mb-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 animate-expand"></div>
          <p className="text-2xl text-gray-700 delay-300 animate-fade-in-up">
            Welcome back,{" "}
            <span className="inline-block font-bold text-blue-600 animate-bounce">
              {user?.first_name || "User"}!
            </span>
          </p>
        </div>

        {/* Content Area - Profile View Mode */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar - User Details */}
          <div className="space-y-6 lg:col-span-1 animate-slide-in-left">
            {/* Profile Details Card */}
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl hover:bg-white/30 group">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r animate-pulse from-purple-400/20 to-pink-400/20"></div>
                <div className="relative z-10 flex flex-col items-center p-6 text-center">
                  <div className="relative mb-4 group">
                    <div className="flex items-center justify-center w-32 h-32 transition-all duration-700 transform rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:rotate-12">
                      {user?.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url + '?t=' + Date.now()}
                          alt="Profile"
                          className="object-cover w-full h-full transition-all duration-500 rounded-full group-hover:brightness-110"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-white transition-all duration-500 group-hover:scale-125">
                          {user?.first_name?.[0] || "R"}
                          {user?.last_name?.[0] || "A"}
                        </span>
                      )}
                    </div>
                    {/* Rating Badge */}
                    <div className="absolute flex items-center px-1 py-1 text-sm font-bold text-white transition-all duration-500 transform bg-green-500 rounded-full -right-2 -bottom-2 hover:scale-125 hover:bg-green-400 animate-bounce-slow">
                      <span className="mx-auto animate-spin-slow">⭐</span>
                      {(user?.total_notes_liked_by_others || 0).toFixed(1)}
                    </div>
                  </div>

                  <h2 className="mb-1 text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="mb-4 text-gray-600 transition-all duration-300 group-hover:text-gray-700">
                    @{user?.username}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4">
                    <div className="px-4 py-2 text-center transition-all duration-500 transform bg-blue-100 cursor-pointer rounded-xl hover:scale-110 hover:bg-blue-200 hover:shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 animate-count-up">
                        {user?.total_notes_uploaded || 0}
                      </div>
                      <div className="text-sm text-blue-800">Notes</div>
                    </div>
                    <div className="px-4 py-2 text-center transition-all duration-500 transform bg-purple-100 cursor-pointer rounded-xl hover:scale-110 hover:bg-purple-200 hover:shadow-lg">
                      <div className="text-2xl font-bold text-purple-600 animate-count-up">
                        {user?.total_bookmarked_notes_by_user || 0}
                      </div>
                      <div className="text-sm text-purple-800">Bookmarks</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-center px-6 pb-6 mt-6">
                <Button
                  onClick={() => navigate('/change-password')}
                  className="px-8 py-3 text-lg text-white transition-all duration-300 transform bg-purple-600 rounded-xl animate-pulse hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group"
                >
                  <User className="w-4 h-4 mr-2" />
                 Change Password
                </Button>
              </div>
            </Card>

            {/* Education Section */}
            <Card className="transition-all duration-500 delay-200 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left">
              <div className="flex items-center mb-4 group">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-blue-700">
                  Education
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: GraduationCap,
                    label: "University",
                    value: user?.university || "Not set",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: Building,
                    label: "Department",
                    value: user?.department_name || "Not set",
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    icon: Calendar,
                    label: "Student ID",
                    value: user?.student_id || "Not set",
                    color: "from-pink-500 to-pink-600",
                  },
                  {
                    icon: User,
                    label: "Batch(Section)",
                    value: `${user?.batch || ""}(${user?.section || ""})`,
                    color: "from-teal-500 to-teal-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-right`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="w-5 h-5 mr-3 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium opacity-90">{item.label}</span>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills Section */}
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left delay-400">
              <div className="flex items-center mb-4 group">
                <Award className="w-6 h-6 mr-3 text-purple-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                  Skills
                </h3>
              </div>
              <div className="text-gray-600">
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-purple-800 transition-all duration-300 transform bg-purple-100 rounded-full hover:scale-110 hover:bg-purple-200 animate-fade-in"
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
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-left delay-600">
              <div className="space-y-3">
                <Button className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 transform bg-purple-600 rounded-xl hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group">
                  <BookOpen className="w-5 h-5 mr-2 transition-all duration-300 group-hover:rotate-12" />
                  My Notes
                </Button>
                <Button className="flex items-center justify-center w-full px-4 py-3 font-bold text-white transition-all duration-300 transform bg-purple-600 rounded-xl hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group">
                  <Bookmark className="w-5 h-5 mr-2 transition-all duration-300 group-hover:rotate-12" />
                  My Bookmarks
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Content - Information Sections */}
          <div className="space-y-6 lg:col-span-2 animate-slide-in-right">
            {/* Profile Header with Edit Button */}
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="animate-fade-in-left">
                  <h2 className="text-3xl font-bold text-gray-800 transition-all duration-300 hover:text-purple-700">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-600 transition-all duration-300 hover:text-gray-700">Student Profile</p>
                </div>
                <Button
                  onClick={() => navigate('/edit-profile')}
                  className="flex items-center px-6 py-2 text-white transition-all duration-300 transform bg-purple-600 rounded-xl hover:bg-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 group animate-fade-in-right"
                >
                  <User className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12" />
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="transition-all duration-500 delay-200 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right">
              <div className="flex items-center mb-6 group">
                <Mail className="w-6 h-6 mr-3 text-green-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-green-700">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: user?.email || "Not set",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: Phone,
                    label: "Mobile",
                    value: user?.mobile_number || "Not set",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    icon: User,
                    label: "Website",
                    value: user?.website || "Not set",
                    color: "from-purple-500 to-purple-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="w-6 h-6 mr-3 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium opacity-90">{item.label}</span>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right delay-400">
              <div className="flex items-center mb-6 group">
                <User className="w-6 h-6 mr-3 text-orange-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-orange-700">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    icon: User,
                    label: "Gender",
                    value: user?.gender || "Not set",
                    color: "from-pink-500 to-pink-600",
                  },
                  {
                    icon: Calendar,
                    label: "Birthday",
                    value: user?.birthday || "Not set",
                    color: "from-yellow-500 to-orange-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 text-white bg-gradient-to-r ${item.color} rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer animate-slide-in-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="w-6 h-6 mr-3 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium opacity-90">{item.label}</span>
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Academic Activity */}
            <Card className="transition-all duration-500 transform shadow-xl rounded-3xl backdrop-blur-lg bg-white/20 border-white/30 hover:scale-105 hover:shadow-2xl animate-slide-in-right delay-600">
              <div className="flex items-center mb-6 group">
                <Book className="w-6 h-6 mr-3 text-purple-600 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-700">
                  Academic Activity
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                  {
                    icon: BookOpen,
                    value: user?.total_notes_uploaded ?? 0,
                    label: "Notes Uploaded",
                    color: "bg-blue-100",
                    textColor: "text-blue-600",
                  },
                  {
                    icon: Bookmark,
                    value: user?.total_bookmarked_notes_by_user ?? 0,
                    label: "Bookmarks",
                    color: "bg-purple-100",
                    textColor: "text-purple-600",
                  },
                  {
                    icon: Award,
                    value: user?.total_notes_liked_by_others ?? 0,
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
      </div>
    </div>
  );
};

export default ProfilePage;