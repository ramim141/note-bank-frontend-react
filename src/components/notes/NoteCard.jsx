"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  Bookmark,
  Download,
  FileText,
  FileImage,
  File,
  Presentation,
  User,
  Building,
  Calendar,
  GraduationCap,
  MessageCircle,
  Star,
} from "lucide-react"

const NoteCard = ({ note }) => {
  const [isLiked, setIsLiked] = useState(note?.is_liked_by_current_user || false)
  const [isBookmarked, setIsBookmarked] = useState(note?.is_bookmarked_by_current_user || false)

  useEffect(() => {
    setIsLiked(note?.is_liked_by_current_user || false)
    setIsBookmarked(note?.is_bookmarked_by_current_user || false)
  }, [note?.is_liked_by_current_user, note?.is_bookmarked_by_current_user])

  const getStringValue = (field, fallback = "") => {
    if (!field) return fallback
    if (typeof field === "string") return field
    if (typeof field === "object") {
      if (field.name) return field.name
      if (field.title) return field.title
      if (field.username) return field.username
      console.warn("getStringValue: Encountered unexpected object structure for a simple field:", field)
      return String(field)
    }
    return String(field)
  }

  const uploaderName =
    note?.uploader_first_name && note?.uploader_last_name
      ? `${note.uploader_first_name} ${note.uploader_last_name}`
      : note?.uploader_username || "notebank"

  const getFileDisplay = (fileName) => {
    if (!fileName) {
      return {
        icon: (
          <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
        ),
        text: "FILE",
      }
    }

    const actualFileName = fileName.split("/").pop()?.split("\\").pop()
    if (!actualFileName)
      return {
        icon: (
          <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
        ),
        text: "FILE",
      }
    const ext = actualFileName.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "pdf":
        return {
          icon: (
            <FileText className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-red-600 group-hover/file:scale-110" />
          ),
          text: "PDF",
        }
      case "docx":
      case "doc":
        return {
          icon: (
            <FileText className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-blue-600 group-hover/file:scale-110" />
          ),
          text: ext.toUpperCase(),
        }
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return {
          icon: (
            <FileImage className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-green-600 group-hover/file:scale-110" />
          ),
          text: ext.toUpperCase(),
        }
      case "ppt":
      case "pptx":
        return {
          icon: (
            <Presentation className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-orange-600 group-hover/file:scale-110" />
          ),
          text: ext.toUpperCase(),
        }
      case "txt":
        return {
          icon: (
            <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
          ),
          text: "TXT",
        }
      case "xlsx":
      case "xls":
        return {
          icon: (
            <FileText className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-emerald-600 group-hover/file:scale-110" />
          ),
          text: ext.toUpperCase(),
        }
      default:
        return {
          icon: (
            <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
          ),
          text: "FILE",
        }
    }
  }

  const courseName = getStringValue(note?.course_name || note?.course)
  const departmentName = getStringValue(note?.department_name || note?.uploader_department)
  const semesterName = getStringValue(note?.semester)
  const fileName = note?.file || note?.file_name || note?.original_filename || note?.filename
  const category = note?.category_name || note?.note_category
  const facultyName = getStringValue(
    note?.faculty_name || note?.faculty || note?.uploader_faculty,
    "Golam Mustofa Naeem",
  )
  const fileDisplay = getFileDisplay(fileName)

  const handleLikeToggle = (e) => {
    e.stopPropagation()
    setIsLiked((prev) => !prev)
    console.log(`Toggling like for note ${note?.id}: ${!isLiked}`)
  }

  const handleBookmarkToggle = (e) => {
    e.stopPropagation()
    setIsBookmarked((prev) => !prev)
    console.log(`Toggling bookmark for note ${note?.id}: ${!isBookmarked}`)
  }

  const handleDownload = async (e) => {
    e.stopPropagation()
    console.log("Download initiated for note:", note?.id)
  }

  const handleCardClick = () => {
    if (note?.id) {
      console.log("Navigate to note:", note.id)
    } else {
      console.warn("Cannot navigate: Note ID is missing.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Jul 4, 2025"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Jul 4, 2025"
    }
  }

  return (
    <div
      className="w-full mx-auto bg-white border-2 border-gray-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:border-blue-600 hover:-translate-y-1 hover:scale-[1.01] group"
      onClick={handleCardClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 transition-all duration-300 pointer-events-none bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/10 rounded-3xl" />

      <div className="relative z-10">
        {/* Top Tags */}
        <div className="flex items-center justify-between mb-6 sm:mb-7">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 sm:px-5 sm:py-2.5 sm:text-base transition-all duration-300 hover:scale-105 group/tag">
            <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/tag:rotate-12" />
            <span className="transition-all duration-300 group-hover/tag:tracking-wide">
              {category || "Class Note"}
            </span>
          </div>
          <div className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 sm:px-5 sm:py-2.5 sm:text-base transition-all duration-300 hover:scale-105 group/course">
            <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/course:rotate-12" />
            <span className="transition-all duration-300 group-hover/course:tracking-wide">
              {courseName || "CSE-327: TOC"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-5 mb-5 sm:gap-6 sm:mb-6">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center justify-center w-24 mb-3 transition-all duration-300 bg-gray-100 h-28 rounded-2xl sm:w-28 sm:h-32 md:w-32 md:h-36 group-hover:bg-gray-50 group-hover:scale-105 group-hover:-rotate-1 group/file">
              {fileDisplay.icon}
              <span className="mt-2 text-sm font-bold text-gray-700 transition-all duration-300 sm:text-base group-hover/file:text-gray-900 group-hover/file:scale-110">
                {fileDisplay.text}
              </span>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-all duration-300 hover:scale-125 hover:rotate-12 sm:w-5 sm:h-5 cursor-pointer ${
                    note?.average_star_rating && star <= Math.round(note.average_star_rating)
                      ? "text-yellow-400 fill-current hover:text-yellow-500"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-all duration-300 line-clamp-2 sm:text-xl sm:mb-5 group-hover:text-blue-700">
              {note?.title || "Theory of computation before mid"}
            </h3>

            {/* Faculty Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-purple-700 transition-all duration-300 bg-purple-100 rounded-full sm:mb-5 hover:bg-purple-200 hover:scale-105 group/faculty">
              <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/faculty:rotate-12" />
              <span className="text-sm font-medium transition-all duration-300 sm:text-base group-hover/faculty:font-semibold">
                Faculty: {facultyName}
              </span>
            </div>

            {/* Info Tags */}
            <div className="flex items-center gap-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 group/user">
                <User className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-4 sm:h-4 group-hover/user:text-blue-600 group-hover/user:scale-110" />
                <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/user:text-blue-700 group-hover/user:font-medium">
                  {uploaderName.split(" ")[0] || "notebank"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 group/dept">
                <Building className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-4 sm:h-4 group-hover/dept:text-green-600 group-hover/dept:scale-110" />
                <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/dept:text-green-700 group-hover/dept:font-medium">
                  {departmentName || "CSE"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 transition-all duration-300 line-clamp-3 sm:text-base group-hover:text-gray-700">
              {note?.description || "Cover topic: Context free grammar, Automata."}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 transition-all duration-300 border-t border-gray-200 sm:pt-5 group-hover:border-gray-300">
          {/* Date */}
          <div className="flex items-center gap-2 px-2 py-1 transition-all duration-300 rounded-lg hover:bg-gray-100 hover:scale-105 group/date">
            <Calendar className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/date:text-blue-600 group-hover/date:scale-110" />
            <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/date:text-blue-700 group-hover/date:font-medium">
              {formatDate(note?.created_at || note?.upload_date)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Bookmark */}
            <button
              onClick={handleBookmarkToggle}
              className="flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-xl hover:bg-yellow-50 hover:scale-110 hover:-translate-y-1 group/bookmark"
              title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover/bookmark:scale-125 ${
                  isBookmarked
                    ? "text-yellow-600 fill-current group-hover/bookmark:text-yellow-700"
                    : "text-gray-500 group-hover/bookmark:text-yellow-600"
                }`}
              />
              <span className="text-xs font-medium transition-all duration-300 group-hover/bookmark:font-semibold group-hover/bookmark:text-yellow-700 sm:text-sm">
                {note?.bookmarks_count || 0}
              </span>
            </button>

            {/* Like */}
            <button
              onClick={handleLikeToggle}
              className="flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-xl hover:bg-red-50 hover:scale-110 hover:-translate-y-1 group/like"
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover/like:scale-125 ${
                  isLiked
                    ? "text-red-500 fill-current group-hover/like:text-red-600"
                    : "text-gray-500 group-hover/like:text-red-500"
                }`}
              />
              <span className="text-xs font-medium transition-all duration-300 group-hover/like:font-semibold group-hover/like:text-red-600 sm:text-sm">
                {note?.likes_count || 0}
              </span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-xl hover:bg-green-50 hover:scale-110 hover:-translate-y-1 group/download"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/download:text-green-600 group-hover/download:scale-125" />
              <span className="text-xs font-medium transition-all duration-300 group-hover/download:font-semibold group-hover/download:text-green-600 sm:text-sm">
                {note?.download_count || 0}
              </span>
            </button>

            {/* Comments */}
            <button
              className="flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-xl hover:bg-blue-50 hover:scale-110 hover:-translate-y-1 group/comment"
              title="Comments"
            >
              <MessageCircle className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/comment:text-blue-600 group-hover/comment:scale-125" />
              <span className="text-xs font-medium transition-all duration-300 group-hover/comment:font-semibold group-hover/comment:text-blue-600 sm:text-sm">
                {note?.comments_count || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
