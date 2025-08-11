// src/components/cards/NoteCard.jsx
// NO CHANGES REQUIRED IN THIS FILE. It correctly uses the functions from userService.

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-toastify"
import { downloadNote } from "../../api/apiService/userService"
import { toggleLikeNote, toggleBookmarkNote } from "../../api/apiService/userService"
import { getFileDisplay } from "../../utils/fileUtils.jsx"
import {
  Heart,
  Bookmark,
  Download,
  User,
  Building,
  Calendar,
  GraduationCap,
  MessageCircle,
  Star,
  Trash2,
} from "lucide-react"

const NoteCard = ({ note, onNoteUpdate, onRemoveBookmark, isRemoving = false }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [isLiked, setIsLiked] = useState(note?.liked || false)
  const [likesCount, setLikesCount] = useState(note?.likes_count || 0)
  const [isBookmarked, setIsBookmarked] = useState(note?.bookmarked || false)
  const [bookmarksCount, setBookmarksCount] = useState(note?.bookmarks_count || 0)
  const [downloadCount, setDownloadCount] = useState(note?.download_count || 0)

  useEffect(() => {
    setIsLiked(note?.liked || false)
    setLikesCount(note?.likes_count || 0)
    setIsBookmarked(note?.bookmarked || false)
    setBookmarksCount(note?.bookmarks_count || 0)
    setDownloadCount(note?.download_count || 0)
  }, [
    note?.liked,
    note?.likes_count,
    note?.bookmarked,
    note?.bookmarks_count,
    note?.download_count,
  ])



  const uploaderName =
    note?.uploader_first_name && note?.uploader_last_name
      ? `${note.uploader_first_name} ${note.uploader_last_name}`
      : note?.uploader_username || "notebank"

  const courseName = note?.course_name || "Course"
  const departmentName = note?.department_name || note?.uploader_department || "Dept"
  const fileName = note?.file_name
  const category = note?.category_name || "Note"
  const facultyName = note?.faculty_name || "N/A"

  const fileDisplay = getFileDisplay(fileName)

  const handleLikeToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error("Please log in to like notes.")
      return
    }
    
    if (!note || !note.id) {
        console.error("handleLikeToggle failed: note.id is missing.", note);
        toast.error("Cannot like note: ID is missing.");
        return;
    }

    const originalIsLiked = isLiked
    const originalLikesCount = likesCount

    // Optimistic update
    setIsLiked((prev) => {
      setLikesCount((count) => prev ? count - 1 : count + 1)
      return !prev
    })

    try {
      const response = await toggleLikeNote(note.id)
      
      // Debug: Log the API response
      console.log('Like toggle API response:', response)
      console.log('Response data:', response?.data)
      
      // If API returns updated data, use it to update state
      if (response && response.data) {
        const updatedData = response.data
        
        // Update with API response data if available
        if (typeof updatedData.liked !== 'undefined') {
          setIsLiked(updatedData.liked)
        }
        if (typeof updatedData.likes_count !== 'undefined') {
          setLikesCount(updatedData.likes_count)
        }
        
        // Update parent component state if callback is provided
        if (onNoteUpdate && note?.id) {
          onNoteUpdate(note.id, updatedData)
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(originalIsLiked)
      setLikesCount(originalLikesCount)
      console.error("Failed to toggle like:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleBookmarkToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark notes.")
      return
    }

    if (!note || !note.id) {
        console.error("handleBookmarkToggle failed: note.id is missing.", note);
        toast.error("Cannot bookmark note: ID is missing.");
        return;
    }

    const originalIsBookmarked = isBookmarked
    const originalBookmarksCount = bookmarksCount

    // Optimistic update
    setIsBookmarked((prev) => {
      setBookmarksCount((count) => prev ? count - 1 : count + 1)
      return !prev
    })

    try {
      const response = await toggleBookmarkNote(note.id)
      
      // Debug: Log the API response
      console.log('Bookmark toggle API response:', response)
      console.log('Response data:', response?.data)
      
      // If API returns updated data, use it to update state
      if (response && response.data) {
        const updatedData = response.data
        
        // Update with API response data if available
        if (typeof updatedData.bookmarked !== 'undefined') {
          setIsBookmarked(updatedData.bookmarked)
        }
        if (typeof updatedData.bookmarks_count !== 'undefined') {
          setBookmarksCount(updatedData.bookmarks_count)
        }
        
        // Update parent component state if callback is provided
        if (onNoteUpdate && note?.id) {
          onNoteUpdate(note.id, updatedData)
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(originalIsBookmarked)
      setBookmarksCount(originalBookmarksCount)
      console.error("Failed to toggle bookmark:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error("Please log in to download notes.")
      return
    }

    if (!note || !note.id) {
      toast.error("Cannot download: Note ID is missing.")
      return
    }

    // Check if the note has a file associated with it
    if (!note.file_name) {
      toast.error("This note doesn't have a file attached.")
      return
    }

    // Debug: Log the note being downloaded
    console.log('Attempting to download note:', {
      id: note.id,
      title: note.title,
      file_name: note.file_name
    })

    try {
      toast.info("Preparing download...")
      await downloadNote(note.id)
      const newDownloadCount = downloadCount + 1
      setDownloadCount(newDownloadCount)
      
      // Update parent component state if callback is provided
      if (onNoteUpdate && note?.id) {
        onNoteUpdate(note.id, { download_count: newDownloadCount })
      }
      
      toast.success("Download started!")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "Failed to download the note.")
    }
  }

  const handleCardClick = () => {
    if (note?.id) {
      navigate(`/${note.id}`)
    } else {
      console.warn("Cannot navigate: Note ID is missing.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const roundedRating = note?.average_rating ? Math.round(note.average_rating) : 0

  return (
    <div
      className="w-full mx-auto bg-white border-2 border-gray-200 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:border-blue-600 hover:-translate-y-1 hover:scale-[1.01] group"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br rounded-3xl transition-all duration-300 pointer-events-none from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/10" />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6 sm:mb-7">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 sm:px-5 sm:py-2.5 sm:text-base transition-all duration-300 hover:scale-105 group/tag">
            <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/tag:rotate-12" />
            <span className="transition-all duration-300 group-hover/tag:tracking-wide">
              {category}
            </span>
          </div>
          <div className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 sm:px-5 sm:py-2.5 sm:text-base transition-all duration-300 hover:scale-105 group/course">
            <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/course:rotate-12" />
            <span className="transition-all duration-300 group-hover/course:tracking-wide">
              {courseName}
            </span>
          </div>
        </div>

        <div className="flex gap-5 mb-5 sm:gap-6 sm:mb-6">
          <div className="flex-shrink-0">
            <div className="flex flex-col justify-center items-center mb-3 w-24 h-28 bg-gray-100 rounded-2xl transition-all duration-300 sm:w-28 sm:h-32 md:w-32 md:h-36 group-hover:bg-gray-50 group-hover:scale-105 group-hover:-rotate-1 group/file">
              {fileDisplay.icon}
              <span className="mt-2 text-sm font-bold text-gray-700 transition-all duration-300 sm:text-base group-hover/file:text-gray-900 group-hover/file:scale-110">
                {fileDisplay.text}
              </span>
            </div>

            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-all duration-300 hover:scale-125 hover:rotate-12 sm:w-5 sm:h-5 cursor-pointer ${
                    star <= roundedRating
                      ? "text-yellow-400 fill-current hover:text-yellow-500"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-all duration-300 line-clamp-2 sm:text-xl sm:mb-5 group-hover:text-blue-700">
              {note?.title || "Note Title"}
            </h3>

            <div className="inline-flex gap-2 items-center px-4 py-2 mb-4 text-purple-700 bg-purple-100 rounded-full transition-all duration-300 sm:mb-5 hover:bg-purple-200 hover:scale-105 group/faculty">
              <GraduationCap className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 group-hover/faculty:rotate-12" />
              <span className="text-sm font-medium transition-all duration-300 sm:text-base group-hover/faculty:font-semibold">
                Faculty: {facultyName}
              </span>
            </div>

            <div className="flex gap-4 items-center mb-4 sm:mb-5">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 group/user">
                <User className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-4 sm:h-4 group-hover/user:text-blue-600 group-hover/user:scale-110" />
                <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/user:text-blue-700 group-hover/user:font-medium">
                  {uploaderName.split(" ")[0]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 group/dept">
                <Building className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-4 sm:h-4 group-hover/dept:text-green-600 group-hover/dept:scale-110" />
                <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/dept:text-green-700 group-hover/dept:font-medium">
                  {departmentName}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 transition-all duration-300 line-clamp-3 sm:text-base group-hover:text-gray-700">
              {note?.description || "No description available."}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 transition-all duration-300 sm:pt-5 group-hover:border-gray-300">
          <div className="flex gap-2 items-center px-2 py-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 group/date">
            <Calendar className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/date:text-blue-600 group-hover/date:scale-110" />
            <span className="text-sm text-gray-600 transition-all duration-300 sm:text-base group-hover/date:text-blue-700 group-hover/date:font-medium">
              {formatDate(note?.created_at)}
            </span>
          </div>

          <div className="flex gap-3 items-center sm:gap-4">
            {/* Remove Bookmark Button - Only show when onRemoveBookmark prop is provided */}
            {onRemoveBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemoveBookmark(note.id)
                }}
                disabled={isRemoving}
                className="flex flex-col gap-1 items-center p-2 rounded-xl transition-all duration-300 hover:bg-red-50 hover:scale-110 hover:-translate-y-1 group/remove-bookmark focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Remove from bookmarks"
              >
                {isRemoving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 animate-spin sm:w-5 sm:h-5 border-t-transparent" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/remove-bookmark:scale-125 group-hover/remove-bookmark:text-red-600" />
                )}
                <span className="text-xs font-medium transition-all duration-300 group-hover/remove-bookmark:font-semibold group-hover/remove-bookmark:text-red-600 sm:text-sm">
                  {isRemoving ? "Removing..." : " "}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleBookmarkToggle}
              className="flex flex-col gap-1 items-center p-2 rounded-xl transition-all duration-300 hover:bg-yellow-50 hover:scale-110 hover:-translate-y-1 group/bookmark"
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
                {bookmarksCount}
              </span>
            </button>

            <button
              type="button"
              onClick={handleLikeToggle}
              className="flex flex-col gap-1 items-center p-2 rounded-xl transition-all duration-300 hover:bg-red-50 hover:scale-110 hover:-translate-y-1 group/like"
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
                {likesCount}
              </span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col gap-1 items-center p-2 rounded-xl transition-all duration-300 hover:bg-green-50 hover:scale-110 hover:-translate-y-1 group/download"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/download:text-green-600 group-hover/download:scale-125" />
              <span className="text-xs font-medium transition-all duration-300 group-hover/download:font-semibold group-hover/download:text-green-600 sm:text-sm">
                {downloadCount}
              </span>
            </button>

            <button
              type="button"
              className="flex flex-col gap-1 items-center p-2 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:-translate-y-1 group/comment"
              title="Comments"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCardClick()
              }}
            >
              <MessageCircle className="w-4 h-4 text-gray-500 transition-all duration-300 sm:w-5 sm:h-5 group-hover/comment:text-blue-600 group-hover/comment:scale-125" />
              <span className="text-xs font-medium transition-all duration-300 group-hover/comment:font-semibold group-hover/comment:text-blue-600 sm:text-sm">
                {note?.comments?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard