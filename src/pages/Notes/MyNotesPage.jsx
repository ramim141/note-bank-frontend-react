"use client"

// src/pages/Notes/MyNotesPage.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth" // Import useAuth
import ProtectedRoute from "../../routes/ProtectedRoute" // Import ProtectedRoute
import NoteCard from "../../components/notes/NoteCard" // Fixed import path
import { noteService } from "../../api/apiService/noteService" // Fixed import path
import { toast } from "react-toastify"
import { Search, Upload, FileText, Clock, CheckCircle, Plus, MoreHorizontal } from "lucide-react"

const MyNotesPage = () => {
  const { token, logout } = useAuth() // Get token and logout function
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleNotes, setVisibleNotes] = useState(6)

  useEffect(() => {
    const fetchMyNotes = async () => {
      if (!token) {
        // If no token, it means user is not logged in, ProtectedRoute should handle this
        // But for safety, we can add a check here too.
        setError("You are not authenticated.")
        setLoading(false)
        navigate("/login")
        return
      }

      try {
        const data = await noteService.getMyNotes(token)
        setNotes(data.results || data) // API might return {results: [...]} or just [...]
        setLoading(false)
      } catch (err) {
        console.error("Error fetching my notes:", err)
        let errorMessage = "Failed to fetch your notes."

        // Handle specific token validation errors
        if (err.code === "token_not_valid" || err.detail?.includes("token not valid")) {
          errorMessage = "Your session has expired. Please login again."
          // Clear the invalid token and redirect to login
          logout()
          navigate("/login")
        } else if (err.status === 401) {
          errorMessage = "You are not authenticated. Please login."
          logout()
          navigate("/login")
        } else if (err.message) {
          errorMessage = err.message
        } else if (err.detail) {
          errorMessage = err.detail
        } else if (typeof err === "string") {
          errorMessage = err
        }

        toast.error(errorMessage)
        setError(errorMessage)
        setLoading(false)
      }
    }

    fetchMyNotes()
  }, [token, navigate, logout]) // Dependency on token, navigate, and logout

  // Filter notes based on active tab and search query
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "approved") return matchesSearch && note.is_approved
    if (activeTab === "pending") return matchesSearch && !note.is_approved

    return matchesSearch
  })

  const displayedNotes = filteredNotes.slice(0, visibleNotes)
  const hasMoreNotes = filteredNotes.length > visibleNotes

  const approvedCount = notes.filter((note) => note.is_approved).length
  const pendingCount = notes.filter((note) => !note.is_approved).length

  // Callback to update a specific note in the notes array
  const updateNoteInList = (noteId, updatedData) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, ...updatedData }
          : note
      )
    )
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin border-t-purple-600"></div>
      </div>
      <span className="ml-4 text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Loading your notes...
      </span>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-64 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
        {/* Header Section */}
        <div className="top-0 z-10 pt-32 border-b shadow-sm backdrop-blur-xl bg-white/80 border-purple-100/50">
          <div className="px-4 py-6 mx-auto max-w-7xl md:px-8 lg:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Title and Stats */}
              <div className="flex items-center gap-4">
                <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                    My Notes Collection
                  </h1>
                  <p className="font-medium text-gray-600">
                    {notes.length} total notes • {approvedCount} approved • {pendingCount} pending
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={() => navigate("/upload-note")}
                className="flex items-center gap-3 px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl group hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
              >
                <Upload className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                Upload New Note
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mt-6">
              <Search className="absolute w-5 h-5 text-gray-700 transform -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search notes by title, description, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 placeholder-gray-500 transition-all duration-300 border rounded-xl backdrop-blur-sm bg-white/70 border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-8 mx-auto max-w-7xl md:px-8 lg:px-12">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1 mb-8 border shadow-sm rounded-2xl backdrop-blur-sm bg-white/60 border-purple-100/50">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              All Notes
              <span className="px-2 py-1 text-xs rounded-full backdrop-blur-sm bg-white/20">{notes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "approved"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50/50"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Approved Notes
              <span className="px-2 py-1 text-xs rounded-full backdrop-blur-sm bg-white/20">{approvedCount}</span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "pending"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/50"
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending Notes
              <span className="px-2 py-1 text-xs rounded-full backdrop-blur-sm bg-white/20">{pendingCount}</span>
            </button>
          </div>

          {/* Content Area */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="py-16 text-center">
              <div className="inline-block p-4 mb-4 border border-red-200 bg-red-50 rounded-2xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
                <p className="mb-2 text-xl font-semibold text-red-700">Oops! Something went wrong</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <>
              {/* Notes Grid */}
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-2">
                {displayedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="transition-all duration-300 transform hover:scale-105 "
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <NoteCard 
                      note={note} 
                      onNoteUpdate={updateNoteInList}
                      onClick={() => console.log("Note clicked:", note.id)} 
                    />
                  </div>
                ))}
              </div>

              {/* More Notes Button */}
              {hasMoreNotes && (
                <div className="text-center">
                  <button
                    onClick={() => setVisibleNotes((prev) => prev + 6)}
                    className="flex items-center gap-3 px-8 py-4 mx-auto font-semibold text-purple-700 transition-all duration-300 transform border shadow-sm bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl group hover:from-purple-200 hover:to-indigo-200 border-purple-200/50 hover:shadow-lg hover:scale-105"
                  >
                    <MoreHorizontal className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    Load More Notes
                    <span className="px-3 py-1 text-sm rounded-full bg-purple-200/50">
                      +{Math.min(6, filteredNotes.length - visibleNotes)}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-block p-8 border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
                  <FileText className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-800">
                  {searchQuery ? "No matching notes found" : "No notes uploaded yet!"}
                </h3>
                <p className="max-w-md mx-auto mb-6 text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all notes."
                    : "Upload your first note to get started and build your knowledge collection."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate("/upload-note")}
                    className="flex items-center gap-3 px-8 py-4 mx-auto font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl group hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    Upload Your First Note
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}

export default MyNotesPage
