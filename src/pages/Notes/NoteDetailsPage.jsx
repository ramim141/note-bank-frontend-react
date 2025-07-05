"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../../context/useAuth"
import { getNoteById, downloadNote, toggleLikeNote, toggleBookmarkNote } from "../../api/apiService/userService"
import NoteDetailsHeader from "../../components/notes/NoteDetailsHeader"
import NoteDetailsActions from "../../components/notes/NoteDetailsActions"
import NoteFilePreview from "../../components/notes/NoteFilePreview"
import NoteComments from "../../components/notes/NoteComments"
import Spinner from "../../components/ui/Spinner"

const NoteDetailsPage = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarksCount, setBookmarksCount] = useState(0)
  const [downloadCount, setDownloadCount] = useState(0)

  useEffect(() => {
    const fetchNoteDetails = async () => {
      if (!noteId) {
        setError("Note ID is required")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getNoteById(noteId)
        const noteData = response.data || response

        setNote(noteData)
        setIsLiked(noteData.liked || false)
        setLikesCount(noteData.likes_count || 0)
        setIsBookmarked(noteData.bookmarked || false)
        setBookmarksCount(noteData.bookmarks_count || 0)
        setDownloadCount(noteData.download_count || 0)
      } catch (err) {
        console.error("Error fetching note details:", err)
        setError(err.message || "Failed to load note details")
        toast.error("Failed to load note details")
      } finally {
        setLoading(false)
      }
    }

    fetchNoteDetails()
  }, [noteId])

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like notes.")
      return
    }

    const originalIsLiked = isLiked
    const originalLikesCount = likesCount

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))

    try {
      const response = await toggleLikeNote(noteId)
      const updatedData = response.data || response

      if (typeof updatedData.liked !== "undefined") {
        setIsLiked(updatedData.liked)
      }
      if (typeof updatedData.likes_count !== "undefined") {
        setLikesCount(updatedData.likes_count)
      }

      // Update note state
      setNote((prev) => ({
        ...prev,
        liked: updatedData.liked,
        likes_count: updatedData.likes_count,
      }))
    } catch (error) {
      // Revert optimistic update
      setIsLiked(originalIsLiked)
      setLikesCount(originalLikesCount)
      console.error("Failed to toggle like:", error)
      toast.error("Failed to update like status")
    }
  }

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark notes.")
      return
    }

    const originalIsBookmarked = isBookmarked
    const originalBookmarksCount = bookmarksCount

    // Optimistic update
    setIsBookmarked(!isBookmarked)
    setBookmarksCount((prev) => (isBookmarked ? prev - 1 : prev + 1))

    try {
      const response = await toggleBookmarkNote(noteId)
      const updatedData = response.data || response

      if (typeof updatedData.bookmarked !== "undefined") {
        setIsBookmarked(updatedData.bookmarked)
      }
      if (typeof updatedData.bookmarks_count !== "undefined") {
        setBookmarksCount(updatedData.bookmarks_count)
      }

      // Update note state
      setNote((prev) => ({
        ...prev,
        bookmarked: updatedData.bookmarked,
        bookmarks_count: updatedData.bookmarks_count,
      }))
    } catch (error) {
      // Revert optimistic update
      setIsBookmarked(originalIsBookmarked)
      setBookmarksCount(originalBookmarksCount)
      console.error("Failed to toggle bookmark:", error)
      toast.error("Failed to update bookmark status")
    }
  }

  const handleDownload = async () => {
    try {
      toast.info("Preparing download...")
      await downloadNote(noteId)
      const newDownloadCount = downloadCount + 1
      setDownloadCount(newDownloadCount)

      // Update note state
      setNote((prev) => ({
        ...prev,
        download_count: newDownloadCount,
      }))

      toast.success("Download started!")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "Failed to download the note.")
    }
  }

  const handleBackToNotes = () => {
    navigate("/notes")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading note details...</p>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 mx-auto max-w-md text-center">
          <div className="p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Note Not Found</h2>
            <p className="mb-6 text-gray-600">
              {error || "The note you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={handleBackToNotes}
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-xl transition-colors duration-300 hover:bg-blue-700"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={handleBackToNotes}
          className="flex gap-2 items-center mb-6 font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Notes
        </button>

        {/* Note Details Card */}
        <div className="overflow-hidden gap-8 mb-8 bg-white rounded-3xl shadow-xl">
          <NoteDetailsHeader note={note} />
          <div className="mb-8">
          <NoteFilePreview note={note} />
        </div>
          <NoteDetailsActions
            note={note}
            isLiked={isLiked}
            likesCount={likesCount}
            isBookmarked={isBookmarked}
            bookmarksCount={bookmarksCount}
            downloadCount={downloadCount}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onDownload={handleDownload}
          />
        </div>

       
        

        {/* Comments Section */}
        <div>
          <NoteComments noteId={noteId} />
        </div>
      </div>
    </div>
  )
}

export default NoteDetailsPage
