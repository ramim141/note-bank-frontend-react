// src/components/Profile/ProfileEditForm.jsx

"use client"

import React, { useState, useEffect } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "react-toastify"
import { updateUserProfile } from "../../api/apiService/userService"

import {
  User, Phone, Globe, Calendar, University, Building, Users, Hash, Info, Lock, Code, Loader2, Camera, UserCheck,
} from "lucide-react"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

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

export default function ProfileEditForm({ initialData, departments, onCancel, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    university: initialData?.university || "",
    department: initialData?.department ? String(initialData.department) : "",
    batch: initialData?.batch || "",
    section: initialData?.section || "",
    mobile_number: initialData?.mobile_number || "",
    website: initialData?.website || "",
    birthday: initialData?.birthday ? initialData.birthday.split("T")[0] : "",
    gender: mapCodeToGender(initialData?.gender) || "",
    bio: initialData?.bio || "",
    skills: Array.isArray(initialData?.skills) ? initialData.skills : [],
  });
  const [rawSkillsInput, setRawSkillsInput] = useState(initialData?.skills?.join(", ") || "");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(initialData?.profile_picture_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicturePreviewUrl(reader.result);
      reader.readAsDataURL(profilePictureFile);
    } else if (!initialData?.profile_picture_url) {
      setProfilePicturePreviewUrl(null);
    }
  }, [profilePictureFile, initialData?.profile_picture_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setProfilePictureFile(file);
    }
  };

  const handleSkillsInputChange = (e) => {
    setRawSkillsInput(e.target.value);
  };

  const handleSkillsBlur = () => {
    const skillsArray = rawSkillsInput.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentSkills = rawSkillsInput.split(",")
      .map(skill => skill.trim())
      .filter(Boolean);
    const finalData = { ...formData, skills: currentSkills };

    const apiPayload = {
      ...finalData,
      gender: mapGenderToCode(finalData.gender),
    };

    const dataToSubmit = new FormData();

    Object.entries(apiPayload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === 'skills' && Array.isArray(value)) {
          dataToSubmit.append('skills', value.join(','));
        } else {
          dataToSubmit.append(key, value);
        }
      }
    });

    if (profilePictureFile) {
      dataToSubmit.append("profile_picture", profilePictureFile);
    } else if (!profilePicturePreviewUrl && initialData?.profile_picture_url) {
      // dataToSubmit.append("profile_picture", ""); // Uncomment if backend requires this
    }

    const updatePromise = Promise.race([
      updateUserProfile(dataToSubmit),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
      )
    ]);

    try {
      const response = await updatePromise;
      console.log("ProfileEditForm: Update success response:", response);
      setIsSubmitting(false);
      if (onProfileUpdate) {
        onProfileUpdate(response.data || response); // Handle both { data: { ... } } and flat response
      }
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error("ProfileEditForm: Update error:", err);
      setIsSubmitting(false);
      const errorData = err.response?.data;
      let errorMessage = "Failed to update profile.";
      if (typeof errorData === 'object' && errorData !== null) {
        errorMessage = Object.entries(errorData)
          .map(([key, value]) => {
            const cleanedKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            const errors = Array.isArray(value) ? value.join(', ') : value;
            return `${cleanedKey}: ${errors}`;
          })
          .join(' | ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto">
      <div className="mt-32 overflow-hidden border shadow-2xl max-w-7xl bg-gradient-to-br from-white rounded-2xl backdrop-blur-sm via-blue-50/30 to-indigo-50/50 border-white/50">
        <div className="flex justify-center pt-12 mb-12 bg-gradient-to-b to-transparent from-indigo-50/50">
          <div className="relative group">
            <div className="flex items-center justify-center w-40 h-40 overflow-hidden transition-all duration-500 rounded-full shadow-2xl bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 ring-4 ring-white group-hover:scale-105 group-hover:shadow-3xl">
              {profilePicturePreviewUrl ? (
                <img src={profilePicturePreviewUrl} alt="Profile Preview" className="object-cover w-full h-full" />
              ) : (
                <UserCheck className="w-20 h-20 text-indigo-600" />
              )}
            </div>
            <input
              type="file"
              id="profilePictureInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => document.getElementById("profilePictureInput")?.click()}
              className="absolute right-0 p-3 text-white transition-all duration-300 rounded-full shadow-xl bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 hover:shadow-2xl"
              title="Change Profile Picture"
            >
              <Camera className="w-5 h-5" />
            </button>
            {profilePicturePreviewUrl && (
              <button
                type="button"
                onClick={() => {
                  setProfilePictureFile(null);
                  setProfilePicturePreviewUrl(null);
                  const input = document.getElementById("profilePictureInput");
                  if (input) input.value = "";
                }}
                className="absolute left-0 p-2 text-white transition-all duration-300 rounded-full shadow-lg bottom-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-110"
                title="Remove Profile Picture"
              >
                x
              </button>
            )}
            <div className="absolute text-sm font-medium text-gray-600 transform -translate-x-1/2 -bottom-8 left-1/2 whitespace-nowrap">
              Click camera to update photo
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 mt-[-4rem] relative z-20 space-y-10 bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl">
          <div className="space-y-10">
            <div className="p-8 border shadow-lg bg-gradient-to-br rounded-2xl from-blue-50/50 to-indigo-50/30 border-blue-100/50">
              <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800"><span className="flex items-center justify-center w-10 h-10 mr-3 text-indigo-600 shadow-md bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl"><User className="w-5 h-5" /></span>Account Information</h2>
              <div className="p-6 mb-6 border bg-gradient-to-r from-gray-50 rounded-xl to-blue-50/30 border-gray-200/50">
                <p className="mb-2 text-sm font-medium text-gray-600">Username (Cannot be updated)</p>
                <p className="text-lg font-semibold text-gray-800">{initialData?.username || "N/A"}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative group">
                  <label htmlFor="first_name" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><User className="w-4 h-4" /> First Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><User className="w-4 h-4" /></span>
                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                  </div>
                </div>
                <div className="relative group">
                  <label htmlFor="last_name" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><User className="w-4 h-4" /> Last Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><User className="w-4 h-4" /></span>
                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border shadow-lg bg-gradient-to-br rounded-2xl from-purple-50/50 to-indigo-50/30 border-purple-100/50">
              <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800"><span className="flex items-center justify-center w-10 h-10 mr-3 text-purple-600 shadow-md bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl"><University className="w-5 h-5" /></span>Educational Information</h2>
              <div className="relative mb-6 group">
                <label htmlFor="university" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><University className="w-4 h-4" /> University</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><University className="w-4 h-4" /></span>
                  <input type="text" id="university" name="university" value={formData.university} onChange={handleChange} className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                </div>
              </div>
              <div className="relative mb-6 group">
                <label htmlFor="department" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Building className="w-4 h-4" /> Department</label>
                <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={String(dept.value)}>
                        {dept.label}
                      </SelectItem>
                    ))}
                    {(!departments || departments.length === 0) && (
                      <SelectItem value="" disabled>No departments available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative group">
                  <label htmlFor="batch" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Users className="w-4 h-4" /> Batch</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Users className="w-4 h-4" /></span>
                    <input type="text" id="batch" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g., 57" className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                  </div>
                </div>
                <div className="relative group">
                  <label htmlFor="section" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Hash className="w-4 h-4" /> Section</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Hash className="w-4 h-4" /></span>
                    <input type="text" id="section" name="section" value={formData.section} onChange={handleChange} placeholder="e.g., D" className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border shadow-lg bg-gradient-to-br rounded-2xl from-green-50/50 to-teal-50/30 border-green-100/50">
              <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800"><span className="flex items-center justify-center w-10 h-10 mr-3 text-green-600 shadow-md bg-gradient-to-br from-green-100 to-teal-100 rounded-xl"><Phone className="w-5 h-5" /></span>Contact Information</h2>
              <div className="relative mb-6 group">
                <label htmlFor="mobile_number" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Phone className="w-4 h-4" /> Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Phone className="w-4 h-4" /></span>
                  <input type="tel" id="mobile_number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                </div>
              </div>
              <div className="relative group">
                <label htmlFor="website" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Globe className="w-4 h-4" /> Website</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Globe className="w-4 h-4" /></span>
                  <input type="url" id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                </div>
              </div>
            </div>

            <div className="p-8 border shadow-lg bg-gradient-to-br rounded-2xl from-yellow-50/50 to-orange-50/30 border-yellow-100/50">
              <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800"><span className="flex items-center justify-center w-10 h-10 mr-3 text-yellow-600 shadow-md bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl"><Info className="w-5 h-5" /></span>Personal Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative group">
                  <label htmlFor="birthday" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Calendar className="w-4 h-4" /> Birthday</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Calendar className="w-4 h-4" /></span>
                    <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"/>
                  </div>
                </div>
                <div className="relative group">
                  <label htmlFor="gender" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><User className="w-4 h-4" /> Gender</label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative mt-6 group">
                <label htmlFor="bio" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Info className="w-4 h-4" /> Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm resize-none bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"
                ></textarea>
              </div>
            </div>

            <div className="p-8 border shadow-lg bg-gradient-to-br rounded-2xl from-pink-50/50 to-purple-50/30 border-pink-100/50">
              <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800"><span className="flex items-center justify-center w-10 h-10 mr-3 text-pink-600 shadow-md bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl"><Code className="w-5 h-5" /></span>Skills & Expertise</h2>
              <div className="relative group">
                <label htmlFor="skills" className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 transition-colors duration-200 group-focus-within:text-indigo-600"><Code className="w-4 h-4" /> Skills (Comma-separated)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none"><Code className="w-4 h-4" /></span>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={rawSkillsInput}
                    onChange={handleSkillsInputChange}
                    onBlur={handleSkillsBlur}
                    placeholder="e.g., Python, React, Machine Learning, UI/UX Design"
                    className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:from-indigo-50/30 focus:to-blue-50/30 hover:border-gray-300 hover:shadow-md"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-600">Add multiple skills separated by commas.</p>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-800 border rounded-full shadow-sm bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-200/50">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full py-4 text-lg font-bold shadow-2xl"
                onClick={handleSubmit}
              >
                <div className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-3 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}