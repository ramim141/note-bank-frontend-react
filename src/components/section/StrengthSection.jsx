

import React, { useState, useEffect } from "react";
import { FaUsers, FaBookOpen, FaGraduationCap, FaUniversity } from "react-icons/fa"; 
import { getSiteStats } from "../../api/apiService/statsService"; 

const StrengthSection = () => {
  const [stats, setStats] = useState({
    users: '0',
    notes: '0',
    courses: '0',
    departments: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSiteStats(); // API call
        console.log('API Response:', response); // Debug log
        
        // Handle different possible response structures
        const statsData = {
          users: response?.total_users || response?.users || 0,
          notes: response?.total_notes || response?.notes || 0,
          courses: response?.total_courses || response?.courses || 0,
          departments: response?.total_departments || response?.departments || 0,
        };
        
        console.log('Processed stats:', statsData); // Debug log
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          response: error.response?.data
        });
        // Fallback to default values if API fails
        setStats({ users: '0', notes: '0', courses: '0', departments: '0' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="overflow-hidden relative px-4 py-20 mx-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 lg:py-32">
       <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-2xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 animation-delay-4000"></div>
      </div>
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-20 text-center lg:mb-28">
          <div className="inline-flex gap-2 items-center px-6 py-3 mb-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-bold tracking-wider text-indigo-700 uppercase">Our Impact</p>
          </div>
          <h2 className="mb-8 text-5xl font-black leading-tight text-gray-900 lg:text-7xl xl:text-7xl">
            Strength in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
              Numbers
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-10 shadow-lg"></div>
          <p className="mx-auto max-w-4xl text-xl font-medium leading-relaxed text-gray-700 lg:text-2xl">
            Join our thriving community of students and educators sharing knowledge and achieving academic excellence
            together.
            <span className="block mt-3 font-semibold text-indigo-600">Your success is our mission.</span>
          </p>
        </div>
      
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          
          <div className="relative p-8 rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 transform group lg:p-10 bg-white/90 hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-0 transition-opacity duration-500 from-blue-500/5 to-indigo-500/5 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex gap-6 items-center mb-6">
                <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                  <FaUsers className="m-4 text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700 lg:text-4xl">
                    {loading ? '...' : stats.users}+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    Active Students
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Growing daily</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 transform group lg:p-10 bg-white/90 hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-0 transition-opacity duration-500 from-emerald-500/5 to-green-500/5 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex gap-6 items-center mb-6">
                <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                   <FaBookOpen className="m-4 text-5xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-green-700 lg:text-4xl">
                    {loading ? '...' : stats.notes}+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-emerald-600">
                    Learning Content
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Updated weekly</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-5/6 h-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 transform group lg:p-10 bg-white/90 hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-0 transition-opacity duration-500 from-purple-500/5 to-violet-500/5 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex gap-6 items-center mb-6">
                <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                  <FaGraduationCap className="text-5xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-violet-700 lg:text-4xl">
                    {loading ? '...' : stats.courses}+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                    Courses
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Expanding</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 transform group lg:p-10 bg-white/90 hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-0 transition-opacity duration-500 from-orange-500/5 to-red-500/5 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex gap-6 items-center mb-6">
                <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                  <FaUniversity className="m-4 text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-red-700 lg:text-4xl">
                    {loading ? '...' : stats.departments}+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-orange-600">
                    Departments
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 items-center mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Comprehensive</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrengthSection;