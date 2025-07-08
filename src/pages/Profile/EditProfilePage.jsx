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
import { toast } from "react-toastify"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  let classes = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
  if (variant === "default") classes += " bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
  else if (variant === "outline") classes += " border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-md hover:border-white/50 hover:shadow-xl"
  if (size === "default") classes += " h-11 px-6 py-3"
  else if (size === "lg") classes += " h-12 rounded-lg px-8 text-base"
  classes = `${classes} ${className || ""}`
  return <button className={classes} ref={ref} {...props} />
})
Button.displayName = "Button"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => <SelectPrimitive.Trigger ref={ref} className={cn("flex h-11 w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:border-gray-300 hover:from-gray-50 hover:to-gray-100 transition-all duration-200 shadow-sm hover:shadow-md", className)} {...props}>{children}<SelectPrimitive.Icon asChild><ChevronDown className="w-4 h-4 opacity-50" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} className={cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-b from-white to-gray-50 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 backdrop-blur-sm", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)} position={position} {...props}><SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>)
SelectContent.displayName = SelectPrimitive.Content.displayName
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => <SelectPrimitive.Item ref={ref} className={cn("relative flex w-full cursor-default select-none items-center rounded-md py-2.5 pl-8 pr-2 text-sm outline-none focus:bg-gradient-to-r focus:from-indigo-50 focus:to-blue-50 focus:text-indigo-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-150", className)} {...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="w-4 h-4 text-indigo-600" /></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>)
SelectItem.displayName = "SelectItem"

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const mapCodeToGender = (code) => {
  switch (code) {
    case "M": return "Male";
    case "F": return "Female";
    case "O": return "Other";
    default: return "";
  }
};

const mapGenderToCode = (gender) => {
  switch (gender) {
    case "Male": return "M";
    case "Female": return "F";
    case "Other": return "O";
    default: return "";
  }
};

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile: refreshGlobalProfile, isAuthenticated } = useAuth();

  const [initialData, setInitialData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const loadPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileResponse, departmentsResponse] = await Promise.all([
          getUserProfile(),
          getDepartments(),
        ]);

        const profileData = profileResponse.data;
        const formattedBirthday = profileData.birthday ? profileData.birthday.split("T")[0] : "";
        setInitialData({ ...profileData, birthday: formattedBirthday, department: profileData.department ? String(profileData.department) : "" });

        const departmentsData = departmentsResponse.data;
        const formattedDepartments = departmentsData.map((dept) => ({
          value: dept.id,
          label: dept.name,
        }));
        setDepartments(formattedDepartments);

      } catch (err) {
        console.error("Error loading page data:", err);
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to load profile data.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleProfileUpdateSuccess = async (updatedData) => {
    console.log("EditProfilePage: handleProfileUpdateSuccess called. Received data:", updatedData);
    try {
      await refreshGlobalProfile();
      console.log("EditProfilePage: Global profile refresh completed.");
      toast.success("Profile updated successfully!");
      console.log("EditProfilePage: Success toast shown.");
      navigate("/profile");
      console.log("EditProfilePage: Navigation to /profile completed.");
    } catch (err) {
      console.error("EditProfilePage: Error during profile update success handling:", err);
      toast.error("Failed to refresh profile after update. Redirecting anyway...");
      navigate("/profile"); // Fallback navigation
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full shadow-lg animate-spin border-t-indigo-600"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-indigo-400"></div>
          </div>
          <p className="text-lg font-semibold text-indigo-700">Loading Profile Editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
        <div className="max-w-md p-8 text-center border border-red-200 shadow-xl rounded-3xl bg-white/90">
          <div className="flex items-center justify-center w-20 h-20 p-6 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-red-700">Error Loading Data</h2>
          <p className="text-lg text-red-600">{error}</p>
          <Button variant="default" size="lg" className="mt-6" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-in-out ${animate ? "opacity-100" : "opacity-0"} mx-auto pt-32`}>
      <div className="mx-auto max-w-7xl">
        <div className="relative px-8 py-20 mx-auto overflow-hidden shadow-2xl max-w-7xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-40 h-40 bg-white rounded-full -top-20 -right-20 opacity-30 animate-pulse"></div>
            <div className="absolute w-20 h-20 bg-white rounded-full left-10 top-20 opacity-20 animate-bounce"></div>
            <div className="absolute w-32 h-32 bg-white rounded-full right-10 bottom-10 animate-pulse opacity-15"></div>
            <div className="absolute rounded-full top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 animate-spin" style={{ animationDuration: "20s" }}></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
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
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Profile
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-[-4rem] relative z-20">
          {error && (
            <div className="p-8 mb-8 border-l-4 border-red-500 shadow-xl bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl">
              <p className="flex items-center text-lg font-semibold text-red-700">
                <Info className="w-6 h-6 mr-3" />
                <span>Error: {error}</span>
              </p>
            </div>
          )}

          {initialData && departments && (
            <ProfileEditForm
              initialData={initialData}
              departments={departments}
              onCancel={() => navigate("/profile")}
              onProfileUpdate={handleProfileUpdateSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage