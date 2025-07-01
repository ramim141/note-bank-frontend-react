// src/pages/Profile/EditProfilePage.jsx

"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Info } from "lucide-react"
import ProfileEditForm from "../../components/Profile/ProfileEditForm"
import { useAuth } from "../../context/AuthContext"
import { getUserProfile, getDepartments } from "../../api/apiService/userService"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  let classes =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"

  if (variant === "default") {
    classes +=
      " bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
  } else if (variant === "outline") {
    classes +=
      " border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-md hover:border-white/50 hover:shadow-xl"
  }

  if (size === "default") {
    classes += " h-11 px-6 py-3"
  } else if (size === "lg") {
    classes += " h-12 rounded-lg px-8 text-base"
  }

  classes = `${classes} ${className || ""}`

  return <button className={classes} ref={ref} {...props} />
})
Button.displayName = "Button"

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { fetchUserProfile: refreshGlobalProfile } = useAuth()
  const [initialData, setInitialData] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const loadPageData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch both profile and departments concurrently for better performance
        const [profileResponse, departmentsResponse] = await Promise.all([
          getUserProfile(),
          getDepartments(),
        ])

        const profileData = profileResponse.data
        // Ensure birthday is correctly formatted (YYYY-MM-DD)
        const formattedBirthday = profileData.birthday ? profileData.birthday.split("T")[0] : ""
        setInitialData({ ...profileData, birthday: formattedBirthday })

        const departmentsData = departmentsResponse.data
        // Format departments for the Select component
        const formattedDepartments = departmentsData.map((dept) => ({
          value: dept.id, // API provides 'id'
          label: dept.name, // API provides 'name'
        }))
        setDepartments(formattedDepartments)

      } catch (err) {
        console.error("Error loading page data:", err)
        const errorMessage = err.response?.data?.detail || "Failed to load profile data. Please try again."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    
    loadPageData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow-lg animate-spin border-t-indigo-600"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent animate-ping border-t-indigo-400"></div>
          </div>
          <p className="text-lg font-semibold text-indigo-700">Loading Profile Editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? "opacity-100" : "opacity-0"} mx-auto pt-32`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden relative px-8 py-20 mx-auto max-w-7xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute left-10 top-20 w-20 h-20 bg-white rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute right-10 bottom-10 w-32 h-32 bg-white rounded-full animate-pulse opacity-15"></div>
            <div
              className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-spin"
              style={{ animationDuration: "20s" }}
            ></div>
          </div>
          <div className="flex relative z-10 flex-col justify-between items-center md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="mb-4 text-5xl font-bold text-white bg-clip-text bg-gradient-to-r from-white to-blue-100">
                Edit Your Profile
              </h1>
              <p className="text-xl font-medium text-blue-100 opacity-90">
                Update your personal information and showcase your skills
              </p>
            </div>
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              size="lg"
              className="flex items-center mt-6 md:mt-0"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Profile
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-[-4rem] relative z-20">
          {error && (
            <div className="p-8 mb-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-l-4 border-red-500 shadow-xl">
              <p className="flex items-center text-lg font-semibold text-red-700">
                <Info className="mr-3 w-6 h-6" />
                <span>Error: {error}</span>
              </p>
            </div>
          )}

          {initialData && (
            <ProfileEditForm
              initialData={initialData}
              departments={departments}
              onCancel={() => navigate("/profile")}
              onProfileUpdate={(updatedData) => {
                refreshGlobalProfile() // Refresh global user state from context
                navigate("/profile")
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage