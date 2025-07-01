"use client"

import React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

import { Star, Camera } from "lucide-react"

const ProfileAvatar = ({ profilePictureUrl, initials, rating, className, onFileChange }) => {
  const fileInputRef = React.useRef(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    if (onFileChange) {
      onFileChange(file)
    }
  }

  return (
    <div className={cn("inline-block relative group", className)}>
      <div
        className={cn(
          "flex overflow-hidden relative justify-center items-center w-36 h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-3xl",
          className,
        )}
        onClick={handleAvatarClick}
      >
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl || "/placeholder.svg"}
            alt="Profile Picture"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-6xl font-bold text-white uppercase drop-shadow-lg">{initials || "?"}</span>
        )}
        <div className="flex absolute inset-0 justify-center items-center bg-gradient-to-br rounded-full opacity-0 backdrop-blur-sm transition-all duration-300 from-black/40 to-black/60 group-hover:opacity-100">
          <Camera className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
      </div>
      {rating !== undefined && (
        <div className="flex absolute -right-3 -bottom-3 items-center px-3 py-2 text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-white shadow-xl">
          <Star className="mr-1 w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{rating.toFixed(1)}</span>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </div>
  )
}

export default ProfileAvatar
