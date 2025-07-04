"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  Bookmark,
  Download,
  FileText,
  Star,
  FileImage,
  File,
  Presentation,
  User,
  Building,
  Tag,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getSecureDownloadUrl, downloadNoteFile } from "../../api/apiService/downloadService"
import { useAuth } from "../../context/useAuth"

const NoteCard = ({ note }) => {
  const [isLiked, setIsLiked] = useState(note?.is_liked_by_current_user || false)
  const [isBookmarked, setIsBookmarked] = useState(note?.is_bookmarked_by_current_user || false)

  const navigate = useNavigate()
  const { token: accessToken } = useAuth()

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
      : note?.uploader_username || "Anonymous"

  const getFileDisplay = (fileName) => {
    if (!fileName) {
      return {
        icon: <File className="w-6 h-6 text-gray-600 sm:w-8 sm:h-8" />,
        text: "FILE",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    }

    const actualFileName = fileName.split("/").pop()?.split("\\").pop()
    if (!actualFileName)
      return {
        icon: <File className="w-6 h-6 text-gray-600 sm:w-8 sm:h-8" />,
        text: "FILE",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    const ext = actualFileName.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "pdf":
        return {
          icon: <FileText className="w-6 h-6 text-red-600 sm:w-8 sm:h-8" />,
          text: "PDF",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      case "docx":
      case "doc":
        return {
          icon: <FileText className="w-6 h-6 text-blue-600 sm:w-8 sm:h-8" />,
          text: ext.toUpperCase(),
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return {
          icon: <FileImage className="w-6 h-6 text-green-600 sm:w-8 sm:h-8" />,
          text: ext.toUpperCase(),
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "ppt":
      case "pptx":
        return {
          icon: <Presentation className="w-6 h-6 text-orange-600 sm:w-8 sm:h-8" />,
          text: ext.toUpperCase(),
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        }
      case "txt":
        return {
          icon: <File className="w-6 h-6 text-gray-600 sm:w-8 sm:h-8" />,
          text: "TXT",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
      case "xlsx":
      case "xls":
        return {
          icon: <FileText className="w-6 h-6 text-green-600 sm:w-8 sm:h-8" />,
          text: ext.toUpperCase(),
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      default:
        return {
          icon: <File className="w-6 h-6 text-gray-600 sm:w-8 sm:h-8" />,
          text: "FILE",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  const courseName = getStringValue(note?.course_name || note?.course)
  const departmentName = getStringValue(note?.department_name || note?.uploader_department)
  const semesterName = getStringValue(note?.semester)
  const fileName = note?.file || note?.file_name || note?.original_filename || note?.filename
  const category = note?.category_name || note?.note_category

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
    console.log("--- Download process started ---")
    console.log("Note ID:", note?.id)
    console.log("Is Access Token available?", !!accessToken)

    if (!note?.id) {
      toast.warn("Download link is not available.")
      console.log("--- Download process STOPPED: No Note ID ---")
      return
    }

    if (!accessToken) {
      toast.error("Please log in to download files.")
      console.log("--- Download process STOPPED: No Access Token ---")
      return
    }

    const downloadToastId = toast.loading("Preparing download...")

    try {
      console.log("Step 1: Getting secure download URL...")
      const secureUrl = await getSecureDownloadUrl(note.id, accessToken)
      console.log("Step 1 SUCCESS: Secure URL received ->", secureUrl)

      console.log("Step 2: Downloading file from the secure URL...")
      await downloadNoteFile(secureUrl, accessToken)
      console.log("Step 2 SUCCESS: File download function executed.")

      toast.success("Download started!", { id: downloadToastId })
    } catch (error) {
      console.error("--- Download process FAILED ---")
      console.error("The error object is:", error)
      toast.error(error.message || "Could not download the file.", { id: downloadToastId })
    }
  }

  const handleCardClick = () => {
    if (note?.id) {
      navigate(`/notes/${note.id}`)
    } else {
      console.warn("Cannot navigate: Note ID is missing.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "upload date"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "upload date"
    }
  }

  return (
    <div
      className="relative p-4 mx-auto w-full bg-white rounded-2xl border-2 border-gray-200 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 sm:p-6 sm:rounded-3xl"
      onClick={handleCardClick}
    >
      {/* Top Section - Category and Course Tags */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center sm:mb-6">
        <div className="px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200 transition-all duration-300 hover:bg-gray-200 sm:px-4 sm:py-2 sm:rounded-2xl">
          <span className="text-xs font-semibold text-gray-700 sm:text-sm">{category || semesterName}</span>
        </div>
        <div className="px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200 transition-all duration-300 hover:bg-gray-200 sm:px-4 sm:py-2 sm:rounded-2xl">
          <span className="text-xs font-semibold text-gray-700 sm:text-sm">{courseName || "Course"}</span>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:gap-6 sm:mb-6">
        {/* File Type Display */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div
            className={`w-20 h-24 ${fileDisplay.bgColor} rounded-xl border-2 ${fileDisplay.borderColor} flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-24 sm:h-32 sm:rounded-2xl lg:w-28 lg:h-36`}
          >
            {fileDisplay.icon}
            <span className="mt-1 text-sm font-black tracking-wide text-gray-800 sm:text-lg lg:text-xl">
              {fileDisplay.text}
            </span>
          </div>
        </div>

        {/* Note Information */}
        <div className="flex-grow min-w-0">
          {/* Note Title */}
          <h2 className="mb-3 text-xl font-black text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-blue-600 sm:text-2xl sm:mb-4 lg:text-3xl">
            {note?.title || "Untitled Note"}
          </h2>

          {/* Uploader Information */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 sm:items-center">
              <div className="flex gap-2 items-center">
                <User className="flex-shrink-0 w-4 h-4 text-gray-600 sm:w-5 sm:h-5" />
                <span className="text-base font-bold text-gray-800 truncate sm:text-lg">{uploaderName}</span>
              </div>
              {departmentName && (
                <div className="flex gap-2 items-center">
                  <Building className="flex-shrink-0 w-4 h-4 text-gray-600 sm:w-5 sm:h-5" />
                  <span className="text-base font-semibold text-gray-700 truncate sm:text-lg">{departmentName}</span>
                </div>
              )}
            </div>

            {/* Batch/Section Information */}
            {(note?.uploader_batch || note?.uploader_section) && (
              <div className="flex gap-2 items-center">
                <User className="flex-shrink-0 w-4 h-4 text-gray-600 sm:w-5 sm:h-5" />
                <span className="text-sm font-medium text-gray-600 sm:text-base">
                  {note?.uploader_batch && note?.uploader_section
                    ? `${note.uploader_batch} (${note.uploader_section})`
                    : note?.uploader_batch || note?.uploader_section || "uploader batch(section)"}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {note?.description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2 sm:mt-3">{note.description}</p>
          )}

          {/* Star Rating */}
          {note?.average_star_rating !== undefined && note.average_star_rating !== null && (
            <div className="flex gap-2 items-center mt-2 sm:mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 transition-colors duration-200 sm:w-4 sm:h-4 ${
                      star <= Math.round(note.average_star_rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600 sm:text-sm">
                {typeof note.average_star_rating === "number"
                  ? note.average_star_rating.toFixed(1)
                  : note.average_star_rating}
                {` (${note.star_ratings_count || 0})`}
              </span>
            </div>
          )}

          {/* Tags */}
          {note?.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center mt-2 sm:gap-2 sm:mt-3">
              {note.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="flex gap-1 items-center px-2 py-1 text-xs font-medium text-cyan-800 bg-cyan-100 rounded-md"
                >
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs font-medium text-gray-500">+{note.tags.length - 2} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Upload Date and Actions */}
      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center sm:pt-4">
        {/* Upload Date */}
        <div className="text-xs font-medium text-gray-600 sm:text-sm">
          {formatDate(note?.created_at || note?.upload_date)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center items-center sm:gap-6">
          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className="flex gap-1.5 items-center text-gray-500 transition-all duration-200 hover:text-yellow-500 hover:scale-110 sm:gap-2"
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-200 sm:w-5 sm:h-5 ${isBookmarked ? "text-yellow-500 fill-current" : ""}`}
            />
            <span className="text-xs font-semibold sm:text-sm">{note?.bookmarks_count || 0}</span>
          </button>

          {/* Like */}
          <button
            onClick={handleLikeToggle}
            className="flex gap-1.5 items-center text-gray-500 transition-all duration-200 hover:text-red-500 hover:scale-110 sm:gap-2"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 sm:w-5 sm:h-5 ${isLiked ? "text-red-500 fill-current" : ""}`}
            />
            <span className="text-xs font-semibold sm:text-sm">{note?.likes_count || 0}</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex gap-1.5 items-center text-gray-500 transition-all duration-200 hover:text-green-500 hover:scale-110 sm:gap-2"
            title="Download"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs font-semibold sm:text-sm">{note?.download_count || 0}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard