"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from 'react-hot-toast'

// Custom Hooks and Services

import { getDashboardData } from "../../api/apiService/dashboardService"

// Dashboard Components
import StatCard from "./StatCard"
import RechartsPieChart from "./Enhanced3DPieChart"
import AchievementBadge from "./AchievementBadge"
import EnhancedLoadingDashboard from "./EnhancedLoadingDashboard"

// Icons
import {
  BookIcon,
  DownloadIcon,
  HeartIcon,
  BookmarkIcon,
  PlusIcon,
  ArrowRightIcon,
  AwardIcon,
  StarIcon,
  UserIcon,
  ActivityIcon,
  TargetIcon,
  UsersIcon,
  PieChartIcon,
  MessageSquareIcon,
} from "./DashboardIcons"

// এই mock ডেটা এখন আর ব্যবহৃত হচ্ছে না যদি আপনার API অ্যাচিভমেন্ট ডেটা পাঠায়।
// আপাতত রেখে দেওয়া হলো, কারণ আপনার API এখনো অ্যাচিভমেন্ট সেকশন ইমপ্লিমেন্ট করেনি।
const mockAchievements = [
    {
        type: "trophy",
        title: "Top Contributor",
        description: "Uploaded 20+ high-quality notes",
        progress: 100,
    },
    {
        type: "fire",
        title: "Hot Streak",
        description: "7 days of consecutive uploads",
        progress: 85,
    },
    {
        type: "star",
        title: "Rising Star",
        description: "Received 100+ likes this month",
        progress: 78,
    },
    {
        type: "lightbulb",
        title: "Knowledge Sharer",
        description: "Helped 500+ students",
        progress: 92,
    },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  const user = dashboardData?.user

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getDashboardData()
      setDashboardData(response.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Could not load dashboard data.");
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      // Cache fetch removed, always fetch from API
      setIsLoading(true);
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load your dashboard. Please try again.");
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // শুধু একবার রান করার জন্য খালি dependency array

  const handleRefresh = useCallback(async () => {
    // একটি "রিফ্রেশ" বাটনের জন্য এই ফাংশন ব্যবহার করা যেতে পারে
    setIsLoading(true);
    try {
        localStorage.removeItem('dashboardDataCache'); // ক্যাশ ক্লিয়ার করুন
        const response = await getDashboardData();
        setDashboardData(response.data);
        toast.success("Dashboard has been updated!");
    } catch (error) {
        toast.error("Failed to refresh data.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
  }

  // প্রাথমিক লোডিং এর জন্য এই কন্ডিশনটি গুরুত্বপূর্ণ
  if (isLoading) {
    return <EnhancedLoadingDashboard />;
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>
        <p className="mb-6 text-lg text-gray-700">We couldn't load your dashboard data.</p>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, myNotes, bookmarks, performanceData } = dashboardData

  return (
    <div className="overflow-hidden relative  min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50 pt-32">
      {/* Enhanced Background Effects */}
      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r rounded-full blur-3xl from-blue-400/10 to-purple-400/10 animate-float" />
        <div className="absolute right-10 bottom-10 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl from-pink-400/10 to-indigo-400/10 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r rounded-full blur-3xl animate-pulse from-emerald-400/10 to-cyan-400/10" />
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div
          className="flex flex-col justify-between items-start mb-12 opacity-0 sm:flex-row sm:items-center animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
              {user?.first_name || "User"}'s Dashboard 
            </h1>
            <p
              className="text-xl font-medium text-gray-600 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Ready to create something amazing today?
            </p>

            {/* Tab Navigation */}
            <div
              className="flex gap-2 mt-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              {["overview", "achievements", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-md"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="overflow-hidden relative px-8 py-4 mt-6 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl transition-all duration-300 sm:mt-0 group hover:scale-105 hover:shadow-2xl"
            onClick={() => handleNavigation("/upload-note")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex relative gap-3 items-center">
              <PlusIcon size={24} />
              <span>Upload Note</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "overview" && (
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={BookIcon} value={stats?.uploads || 0} label="Notes Uploaded" gradientFrom="from-indigo-500" gradientTo="to-blue-600" delay={0.1} />
                <StatCard icon={DownloadIcon} value={stats?.downloads || 0} label="Total Downloads" gradientFrom="from-emerald-500" gradientTo="to-green-600" delay={0.2} />
                <StatCard icon={MessageSquareIcon} value={stats?.totalReviews || 0} label="Total Reviews" gradientFrom="from-cyan-500" gradientTo="to-teal-600" delay={0.3} />
                <StatCard icon={StarIcon} value={stats?.avgRating || "0.0"} label="Average Rating" gradientFrom="from-amber-500" gradientTo="to-orange-600" trend={null} delay={0.4} />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div className="space-y-10 lg:col-span-2">
                  {/* Recent Notes */}
                  <div
                    className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl opacity-0 backdrop-blur-sm from-white/80 to-blue-50/50 border-white/20 animate-slide-in-left"
                    style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
                  >
                    <div className="absolute inset-0 opacity-5">
                      <svg width="100%" height="100%"><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="currentColor" /></pattern><rect width="100%" height="100%" fill="url(#dots)" /></svg>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="flex gap-3 items-center text-2xl font-bold text-gray-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                          <BookIcon size={24} className="text-indigo-600" animated />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Recent Masterpieces</span>
                        </h3>
                        <button onClick={() => handleNavigation("/my-notes")} className="flex gap-2 items-center font-bold text-indigo-600 transition-all duration-300 group hover:text-purple-600 hover:translate-x-1">
                          View All <ArrowRightIcon size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {myNotes && myNotes.length > 0 ? (
                          myNotes.map((note, index) => (
                            <div key={note.id} className="relative p-6 bg-gradient-to-r rounded-2xl border opacity-0 backdrop-blur-sm transition-all duration-300 cursor-pointer group from-white/90 to-gray-50/90 border-gray-200/50 animate-slide-in-left hover:translate-x-2 hover:shadow-lg hover:scale-102" style={{ animationDelay: `${index * 100 + 800}ms`, animationFillMode: "forwards" }} onClick={() => handleNavigation(`/notes/${note.id}`)}>
                              <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 transition-opacity duration-300 from-indigo-500/10 to-purple-500/10 group-hover:opacity-100" />
                              <div className="flex relative justify-between items-center">
                                <div className="flex-1">
                                  <h4 className="mb-2 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">{note.title}</h4>
                                  <p className="text-sm font-medium text-gray-600">{note.course_name}</p>
                                </div>
                                <div className="flex gap-6 items-center">
                                  <span className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 hover:scale-110 ${note.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                    {note.is_approved ? "✨ Approved" : "⏳ Pending"}
                                  </span>
                                  <div className="flex gap-4 items-center text-sm">
                                    <span className="flex gap-2 items-center font-semibold text-rose-600 transition-all duration-300 hover:scale-110"><HeartIcon size={16} /> {note.likes_count || 0}</span>
                                    <span className="flex gap-2 items-center font-semibold text-emerald-600 transition-all duration-300 hover:scale-110"><DownloadIcon size={16} /> {note.download_count || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-gray-500">You haven't uploaded any notes yet. Start sharing!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bookmarks */}
                  <div
                    className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl opacity-0 backdrop-blur-sm from-white/80 to-amber-50/50 border-white/20 animate-slide-in-left"
                    style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
                  >
                    <div className="relative">
                      <h3 className="flex gap-3 items-center mb-8 text-2xl font-bold text-gray-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                        <BookmarkIcon size={24} className="text-amber-600" animated />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Saved Treasures</span>
                      </h3>
                      <div className="space-y-4">
                        {bookmarks && bookmarks.length > 0 ? (
                          bookmarks.map((note, index) => (
                            <div key={note.id} className="flex gap-4 items-center p-4 rounded-xl border border-transparent opacity-0 transition-all duration-300 cursor-pointer hover:border-amber-200 hover:translate-x-2 hover:bg-amber-50 animate-slide-in-left" style={{ animationDelay: `${index * 100 + 900}ms`, animationFillMode: "forwards" }} onClick={() => handleNavigation(`/notes/${note.id}`)}>
                              <div className="transition-all duration-300 hover:rotate-12 hover:scale-125">
                                <BookmarkIcon size={20} className="text-amber-500" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 transition-all duration-300 hover:text-amber-600 hover:translate-x-1">{note.title}</p>
                                <p className="text-sm text-gray-600">by {note.uploader_username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-gray-500">You haven't bookmarked any notes yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-10">
                  {/* Profile Card */}
                  <div className="overflow-hidden relative bg-gradient-to-br rounded-3xl border shadow-2xl opacity-0 backdrop-blur-sm from-white/90 to-indigo-50/50 border-white/20 animate-slide-in-right" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                    <div className="overflow-hidden relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="absolute w-20 h-20 rounded-full blur-xl bg-white/20 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s` }}/>
                      ))}
                    </div>
                    <div className="relative px-8 pb-8">
                      <div className="relative -mt-16 mb-6 opacity-0 animate-scale-in" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                        {user?.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt="Profile" className="object-cover mx-auto w-32 h-32 rounded-full border-4 border-white shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3" />
                        ) : (
                          <div className="flex justify-center items-center mx-auto w-32 h-32 text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                            {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>{user?.first_name} {user?.last_name}</h3>
                        <div className="space-y-2">
                          <p className="font-bold text-indigo-600 opacity-0 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>{user?.student_id}</p>
                          <p className="font-medium text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>{user?.department_name}</p>
                        </div>
                        <div className="flex gap-3 justify-center pt-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                          <div className="flex gap-2 items-center px-4 py-2 text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"><AwardIcon size={14} /> Top Contributor</div>
                          <div className="flex gap-2 items-center px-4 py-2 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"><StarIcon size={14} /> Rising Star</div>
                        </div>
                        <button onClick={() => handleNavigation("/profile")} className="px-6 py-4 mt-8 w-full font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl opacity-0 transition-all duration-300 group hover:shadow-2xl hover:scale-105 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}>
                          <div className="flex gap-3 justify-center items-center"><UserIcon size={20} /><span>Manage Profile</span></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category Distribution Chart */}
                  <div className="overflow-hidden relative p-8 rounded-3xl border shadow-2xl opacity-0 backdrop-blur-sm bg-white/80 border-gray-200/50 animate-scale-in" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                    <div className="relative">
                      <div className="flex gap-3 items-center mb-1 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                        <PieChartIcon size={24} className="text-blue-600" /><h3 className="text-2xl font-bold text-gray-800">Category Distribution</h3>
                      </div>
                      <p className="pl-9 mb-4 text-gray-500 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>Your notes across different categories</p>
                      <RechartsPieChart data={performanceData} />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl opacity-0 backdrop-blur-sm from-white/90 to-green-50/50 border-white/20 animate-slide-in-right" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                    <div className="relative">
                      <h3 className="flex gap-3 items-center mb-8 text-2xl font-bold text-gray-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
                        <TargetIcon size={24} className="text-emerald-600" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Quick Actions</span>
                      </h3>
                      <div className="space-y-4">
                        {[
                          { icon: UsersIcon, label: "Browse Community", path: "/notes", color: "from-blue-500 to-indigo-600" },
                          { icon: BookIcon, label: "Manage My Notes", path: "/my-notes", color: "from-purple-500 to-pink-600" },
                          { icon: ActivityIcon, label: "View Analytics", path: "/analytics", color: "from-emerald-500 to-teal-600" },
                        ].map((action, index) => (
                          <button key={index} onClick={() => handleNavigation(action.path)} className="flex gap-4 items-center p-4 w-full rounded-2xl border-2 opacity-0 transition-all duration-300 group bg-white/80 border-gray-200/50 hover:border-transparent hover:shadow-xl hover:scale-105 hover:translate-x-1 animate-slide-in-right" style={{ animationDelay: `${index * 100 + 1000}ms`, animationFillMode: "forwards" }}>
                            <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}><action.icon size={20} className="text-white" /></div>
                            <span className="font-bold text-gray-700 transition-colors group-hover:text-gray-900">{action.label}</span>
                            <div className="ml-auto opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"><ArrowRightIcon size={16} className="text-gray-400" /></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <h2 className="mb-4 text-3xl font-bold text-gray-800">Your Achievements</h2>
                <p className="text-lg text-gray-600">Celebrating your journey and milestones</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {mockAchievements.map((achievement, index) => (
                  <AchievementBadge key={index} type={achievement.type} title={achievement.title} description={achievement.description} progress={achievement.progress} delay={index * 0.15} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <h2 className="mb-4 text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
                <p className="text-lg text-gray-600">Deep insights into your content performance</p>
              </div>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-2xl opacity-0 animate-scale-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  <h3 className="flex gap-3 items-center mb-6 text-xl font-bold text-gray-800"><PieChartIcon size={24} className="text-indigo-600" />Category Performance</h3>
                  <RechartsPieChart data={performanceData} />
                </div>
                {/* Add more analytics cards here in the future */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}