"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth"

import {
  FaBell,
  FaChartBar,
  FaFileAlt,
  FaBookmark,
  FaUpload,
  FaUserCircle,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa"
import Avatar from "../ui/Avatar"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com"

const Navbar = () => {
  // --- AuthContext থেকে নতুন নোটিফিকেশন স্টেট নিন ---
  const { isAuthenticated, logout, user, loading, notifications, unreadCount, markNotificationsAsRead, clearNotifications } = useAuth()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false) // নোটিফিকেশন ড্রপডাউনের জন্য নতুন স্টেট

  const dropdownRef = useRef(null)
  const notificationRef = useRef(null) // নোটিফিকেশন ড্রপডাউনের জন্য নতুন ref

  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  const profilePicUrl = user?.profile_picture_url
    ? user.profile_picture_url.startsWith("http") ? user.profile_picture_url : `${API_BASE_URL}${user.profile_picture_url}`
    : null

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleProfileClick = () => {
    setIsDropdownOpen(prev => !prev)
    setIsNotificationOpen(false) // প্রোফাইল মেনু খুললে নোটিফিকেশন মেনু বন্ধ হবে
  }

  const handleNotificationClick = () => {
    setIsNotificationOpen(prev => !prev)
    if (!isNotificationOpen) {
      markNotificationsAsRead() // ড্রপডাউন খুললেই নোটিফিকেশনগুলো পড়া হয়েছে হিসেবে মার্ক হবে
    }
    setIsDropdownOpen(false) // নোটিফিকেশন মেনু খুললে প্রোফাইল মেনু বন্ধ হবে
  }
  
  const handleLogoutClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await logout()
    navigate("/login")
    setIsDropdownOpen(false)
  }

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false)
    setIsNotificationOpen(false)
  }

  const userInitial = user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : "P"
  const studentName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "Student Name"
  const studentId = user?.student_id || "Student ID"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? "border-b shadow-2xl backdrop-blur-xl bg-white/80 border-white/20" : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg"}`}>
      <div className="mx-auto max-w-7xl auto">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-extrabold tracking-wider transition-all duration-300 hover:scale-105 group"
          >
            <span className="relative mr-3">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl opacity-75 blur-sm transition-all duration-300 animate-pulse group-hover:opacity-100"></div>
              <div className="flex relative justify-center items-center w-12 h-12 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl shadow-lg transition-all duration-300 transform group-hover:rotate-12">
                <span className="text-xl font-black text-white drop-shadow-lg">N</span>
              </div>
            </span>
            <span
              className={`font-black transition-all duration-300 font-sans sm:text-xl lg:text-3xl drop-shadow-lg ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Note{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 animate-pulse">
                Bank
              </span>
            </span>
          </Link>
          
          {/* Enhanced Navigation Links */}
          <div className="hidden flex-grow justify-center items-center space-x-2 md:flex">
             <Link to="/" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">Home<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
             <Link to="/notes" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">Browse Notes<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
             <Link to="/note-requests" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">Note Requests<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
             <Link to="/about" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">About<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
             <Link to="/contributors" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">Contributors<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
             <Link to="/faculty" className={`flex items-center px-6 py-3 space-x-2 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700 hover:shadow-md" : "backdrop-blur-sm text-white/90 hover:bg-white/10 hover:text-white hover:shadow-lg"}`}>
                <span className="relative">Faculty<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span></span>
             </Link>
          </div>

          {/* Enhanced Auth Section */}
          <div className="flex items-center">
            {loading ? (
              <div className="relative"><div className={`${isScrolled ? "bg-gray-200" : "bg-white/20"} h-12 w-12 rounded-full animate-pulse`}></div><div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full opacity-75 animate-spin"></div></div>
            ) : isAuthenticated ? (
              <div className="flex relative items-center space-x-4">
                {/* --- নোটিফিকেশন আইকন এবং ড্রপডাউন --- */}
                <div className="relative" ref={notificationRef}>
                  <button onClick={handleNotificationClick} className={`relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 transform hover:-translate-y-1 group ${isScrolled ? "text-gray-600 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50" : "hover:bg-white/10 text-white/90"}`}>
                    <FaBell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    {unreadCount > 0 && (
                      <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-bounce">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl origin-top-right sm:w-96 animate-in fade-in slide-in-from-top-5">
                      <div className="flex justify-between items-center p-4 font-bold text-gray-800 border-b">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                          <button onClick={clearNotifications} className="flex gap-2 items-center px-2 py-1 text-xs font-semibold text-red-600 rounded hover:bg-red-50">
                            <FaTrashAlt /> Clear all
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-96">
                        {notifications.length > 0 ? (
                          notifications.map((notif, index) => (
                            <Link key={`${notif.id}-${index}`} to={notif.target_url || '/'} onClick={handleDropdownItemClick} className="block p-4 border-b border-gray-100 transition duration-200 hover:bg-gray-100">
                              <p className="text-sm text-gray-800">
                                <span className="font-bold">{notif.actor}</span> {notif.verb}
                                {notif.target && <span className="font-semibold text-violet-600"> {notif.target}</span>}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                            </Link>
                          ))
                        ) : (
                          <p className="p-4 text-sm text-center text-gray-500">No notifications yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* প্রোফাইল আইকন এবং ড্রপডাউন */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={handleProfileClick} className="overflow-hidden relative w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30 group" aria-label="Open user menu">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 rounded-full opacity-75 blur transition-all duration-300 animate-pulse group-hover:opacity-100"></div>
                    <Avatar src={profilePicUrl} alt={userInitial} size="md" className="relative w-full h-full font-bold text-white bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-xl transition-all duration-300 border-3 border-white/30 hover:border-white/60" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full z-10 mt-2 w-72 duration-300 origin-top-right animate-in fade-in slide-in-from-top-5">
                      <div className="overflow-hidden rounded-3xl border ring-1 shadow-2xl backdrop-blur-2xl bg-white/95 ring-black/5 border-white/20">
                        {/* Enhanced User Profile Section */}
                        <div className="flex relative flex-col items-center p-4 text-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-b border-white/30">
                          <div className="absolute inset-0 bg-gradient-to-br opacity-50 from-violet-100/50 via-purple-100/50 to-indigo-100/50"></div>
                          <div className="absolute top-0 left-0 w-full h-full opacity-20">
                            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-violet-300 to-purple-400 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-full blur-2xl animate-pulse"></div>
                          </div>
                          <div className="relative mb-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 rounded-full opacity-75 blur animate-pulse"></div>
                            <Avatar src={profilePicUrl} alt={userInitial} size="xl" className="relative w-16 h-16 text-lg font-bold text-white bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-full ring-4 shadow-2xl transition-all duration-300 transform ring-white/50 hover:scale-105" />
                          </div>
                          <h3 className="mb-1 text-lg font-bold text-gray-800 drop-shadow-sm">{studentName}</h3>
                          <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">{studentId}</p>
                        </div>
                        {/* Enhanced Menu Items */}
                        <nav className="py-1 backdrop-blur-sm bg-white/90">
                          <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:scale-105 hover:shadow-lg group" onClick={handleDropdownItemClick}>
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaUserCircle className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">Profile</p><p className="text-sm text-gray-500">View your profile</p></div>
                          </Link>
                          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105 hover:shadow-lg group" onClick={handleDropdownItemClick}>
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaChartBar className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">Dashboard</p><p className="text-sm text-gray-500">View your activity</p></div>
                          </Link>
                          <Link to="/my-notes" className="flex items-center px-4 py-2 text-gray-700 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:scale-105 hover:shadow-lg group" onClick={handleDropdownItemClick}>
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaFileAlt className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">My Notes</p><p className="text-sm text-gray-500">Manage your notes</p></div>
                          </Link>
                          <Link to="/bookmarks" className="flex items-center px-4 py-2 text-gray-700 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:scale-105 hover:shadow-lg group" onClick={handleDropdownItemClick}>
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaBookmark className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">Bookmarks</p><p className="text-sm text-gray-500">Your saved items</p></div>
                          </Link>
                          <Link to="/upload-note" className="flex items-center px-4 py-2 text-gray-700 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:scale-105 hover:shadow-lg group" onClick={handleDropdownItemClick}>
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaUpload className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">Upload New Note</p><p className="text-sm text-gray-500">Share your notes</p></div>
                          </Link>
                          <button onClick={handleLogoutClick} className="flex items-center px-4 py-2 mt-2 w-full text-left text-gray-700 border-t border-gray-100 transition-all duration-300 transform hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:scale-105 hover:shadow-lg group">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"><FaSignOutAlt className="text-lg" /></div>
                            <div><p className="text-lg font-semibold">Logout</p><p className="text-sm text-gray-500">Sign out of your account</p></div>
                          </button>
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className={`px-6 py-3 font-semibold transition-all duration-300 rounded-2xl hover:scale-105 transform hover:-translate-y-1 hover:shadow-xl ${isScrolled ? "text-white bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg hover:from-gray-700 hover:via-gray-800 hover:to-gray-900" : "text-white border backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40"}`}>Login</Link>
                <Link to="/register" className={`px-6 py-3 font-semibold transition-all duration-300 rounded-2xl hover:scale-105 transform hover:-translate-y-1 hover:shadow-xl ${isScrolled ? "text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500" : "text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 shadow-lg hover:from-yellow-300 hover:via-orange-300 hover:to-red-400"}`}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar