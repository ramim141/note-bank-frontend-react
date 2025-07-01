"use client"

// src/pages/Notes/AllNotesPage.jsx
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/useAuth"
import ProtectedRoute from "../../routes/ProtectedRoute"
import NoteCard from "../../components/notes/NoteCard"
import FilterSidebar from "../../components/notes/FilterSidebar"
import CategoryBar from "../../components/notes/CategoryBar"
import { noteService } from "../../api/apiService/noteService"
import { FaSpinner, FaFilter, FaTimes, FaSearch, FaSort, FaSync, FaChevronLeft } from "react-icons/fa"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com"

// Local storage keys
const NOTES_STORAGE_KEY = "notebank_all_notes"
const NOTES_TIMESTAMP_KEY = "notebank_notes_timestamp"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

const AllNotesPage = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const previousTokenRef = useRef(null)

  const [allNotes, setAllNotes] = useState([]) // Store all notes
  const [filteredNotes, setFilteredNotes] = useState([]) // Store filtered notes
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(true) // Start with sidebar open on large devices
  const [activeFilters, setActiveFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, popular, rating

  // Local storage utility functions
  const saveNotesToStorage = useCallback((notes) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
      localStorage.setItem(NOTES_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.warn("Failed to save notes to localStorage:", error)
    }
  }, [])

  const loadNotesFromStorage = useCallback(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
      const timestamp = localStorage.getItem(NOTES_TIMESTAMP_KEY)

      if (storedNotes && timestamp) {
        const age = Date.now() - Number.parseInt(timestamp)
        if (age < CACHE_DURATION) {
          return JSON.parse(storedNotes)
        }
      }
    } catch (error) {
      console.warn("Failed to load notes from localStorage:", error)
    }
    return null
  }, [])

  const clearNotesFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(NOTES_STORAGE_KEY)
      localStorage.removeItem(NOTES_TIMESTAMP_KEY)
    } catch (error) {
      console.warn("Failed to clear notes from localStorage:", error)
    }
  }, [])

  // Memoize the logout function to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout()
    clearNotesFromStorage() // Clear cached notes on logout
    navigate("/login")
  }, [logout, navigate, clearNotesFromStorage])

  // Function to manually refresh notes (clear cache and fetch fresh data)
  const refreshNotes = useCallback(async () => {
    if (!token) {
      setError("No authentication token found. Please login.")
      return
    }

    setLoading(true)
    setError(null)
    clearNotesFromStorage() // Clear existing cache

    try {
      const data = await noteService.getAllNotes(token)
      const notes = data.results || data

      setAllNotes(notes)
      setFilteredNotes(notes)
      saveNotesToStorage(notes) // Cache the fresh notes
      setLoading(false)
      console.log("Notes refreshed from API and cached")
    } catch (err) {
      console.error("Error refreshing notes:", err)
      let errorMessage = "Failed to refresh notes."

      if (err.code === "token_not_valid" || err.detail?.includes("token not valid")) {
        errorMessage = "Your session has expired. Please login again."
        clearNotesFromStorage() // Clear invalid cache
        handleLogout()
      } else if (err.status === 401) {
        errorMessage = "You are not authenticated. Please login."
        clearNotesFromStorage() // Clear invalid cache
        handleLogout()
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.detail) {
        errorMessage = err.detail
      }

      setError(errorMessage)
      setLoading(false)
    }
  }, [token, clearNotesFromStorage, saveNotesToStorage, handleLogout])

  // Fetch notes
  useEffect(() => {
    // Prevent unnecessary API calls if token hasn't changed
    if (token === previousTokenRef.current && previousTokenRef.current !== null) {
      return
    }

    previousTokenRef.current = token

    const fetchNotes = async () => {
      if (!token) {
        setError("No authentication token found. Please login.")
        setLoading(false)
        navigate("/login")
        return
      }

      setLoading(true)
      setError(null)

      // First, try to load from localStorage
      const cachedNotes = loadNotesFromStorage()
      if (cachedNotes) {
        setAllNotes(cachedNotes)
        setFilteredNotes(cachedNotes)
        setLoading(false)
        console.log("Notes loaded from cache")
        return
      }

      // If no cached data, fetch from API
      try {
        const data = await noteService.getAllNotes(token)
        const notes = data.results || data

        setAllNotes(notes)
        setFilteredNotes(notes)
        saveNotesToStorage(notes) // Cache the fetched notes
        setLoading(false)
        console.log("Notes fetched from API and cached")
      } catch (err) {
        console.error("Error fetching notes:", err)
        let errorMessage = "Failed to fetch notes."

        if (err.code === "token_not_valid" || err.detail?.includes("token not valid")) {
          errorMessage = "Your session has expired. Please login again."
          clearNotesFromStorage() // Clear invalid cache
          handleLogout()
        } else if (err.status === 401) {
          errorMessage = "You are not authenticated. Please login."
          clearNotesFromStorage() // Clear invalid cache
          handleLogout()
        } else if (err.message) {
          errorMessage = err.message
        } else if (err.detail) {
          errorMessage = err.detail
        }

        setError(errorMessage)
        setLoading(false)
      }
    }

    fetchNotes()
  }, [token, handleLogout, loadNotesFromStorage, saveNotesToStorage, clearNotesFromStorage])

  // Apply filters and search
  useEffect(() => {
    let result = [...allNotes]

    // Helper function to safely get string value from field that might be object or string
    const getStringValue = (field) => {
      if (!field) return ""
      if (typeof field === "string") return field
      if (typeof field === "object") {
        if (field.name) return field.name
        if (field.title) return field.title
        if (field.category_name) return field.category_name
      }
      return String(field)
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter((note) => {
        const title = getStringValue(note.title)
        const description = getStringValue(note.description)
        const category = getStringValue(note.category || note.category_name)
        const course = getStringValue(note.course || note.course_name)

        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Apply category filter
    if (activeFilters.category && activeFilters.category !== "") {
      console.log("Filtering by category:", activeFilters.category) // Debug log
      result = result.filter((note) => {
        // Check multiple possible category field names
        const categoryFields = [note.category, note.category_name, note.category?.name, note.categoryName]

        for (const field of categoryFields) {
          const category = getStringValue(field)
          if (category && category.toLowerCase() === activeFilters.category.toLowerCase()) {
            return true
          }
        }
        return false
      })
      console.log("Filtered results:", result.length) // Debug log
    }

    // Apply other filters
    if (activeFilters.course && activeFilters.course !== "") {
      result = result.filter((note) => {
        const course = getStringValue(note.course)
        return course.toLowerCase().includes(activeFilters.course.toLowerCase())
      })
    }

    if (activeFilters.department && activeFilters.department !== "") {
      result = result.filter((note) => {
        const department = getStringValue(note.department_name)
        return department.toLowerCase().includes(activeFilters.department.toLowerCase())
      })
    }

    if (activeFilters.semester && activeFilters.semester !== "") {
      result = result.filter((note) => {
        const semester = getStringValue(note.semester)
        return semester.toLowerCase().includes(activeFilters.semester.toLowerCase())
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case "popular":
        result.sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
        break
      case "rating":
        result.sort((a, b) => (b.average_star_rating || 0) - (a.average_star_rating || 0))
        break
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }

    setFilteredNotes(result)
  }, [allNotes, activeFilters, searchTerm, sortBy])

  const handleFilterChange = useCallback((filterName, filterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: filterValue,
    }))
  }, [])

  const handleCategorySelect = useCallback((categoryName) => {
    console.log("AllNotesPage: Received category:", categoryName) // Debug log
    setActiveFilters((prev) => ({
      ...prev,
      category: categoryName,
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setActiveFilters({})
    setSearchTerm("")
    setSortBy("newest")
  }, [])

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev)
  }, [])

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false)
  }, [])

  const handleNoteCardClick = useCallback(
    (noteId) => {
      navigate(`/notes/${noteId}`)
    },
    [navigate],
  )

  const activeFilterCount =
    Object.values(activeFilters).filter((value) => value && value !== "").length + (searchTerm ? 1 : 0)

  const sidebarContent = (
    <div className="flex flex-col w-full h-full">
      {/* Filter Header with Close Button */}
      <div className="flex-shrink-0 p-4 border-b sm:p-6 border-gray-200/50">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center text-lg font-bold text-gray-800 sm:text-xl">
            <FaFilter className="mr-2 text-blue-500 sm:mr-3" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded-full">{activeFilterCount}</span>
            )}
          </h3>
          {/* Close button for both mobile and desktop */}
          <button
            onClick={toggleFilter}
            className="p-2 text-gray-400 rounded-lg transition-all duration-200 hover:text-gray-600 hover:bg-gray-100 hover:scale-105"
            title="Close Filters"
          >
            <FaChevronLeft className="hidden lg:block" />
            <FaTimes className="block lg:hidden" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="overflow-y-auto flex-1 p-4 sm:p-6">
        <FilterSidebar onFilterChange={handleFilterChange} activeFilters={activeFilters} />
      </div>

      {/* Filter Actions */}
      <div className="flex-shrink-0 p-4 space-y-3 border-t sm:p-6 border-gray-200/50">
        <button
          onClick={clearAllFilters}
          className="px-4 py-3 w-full font-medium text-gray-700 bg-gray-100 rounded-xl transition-all duration-200 hover:bg-gray-200 hover:shadow-md active:scale-95"
        >
          Clear All Filters
        </button>
        <button
          onClick={closeFilter}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] lg:hidden"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )

  // Dynamic grid classes based on sidebar state - FULLY RESPONSIVE
  const getGridClasses = () => {
    if (isFilterOpen) {
      // Sidebar open: Responsive grid with proper breakpoints
      return "grid grid-cols-1 gap-4 sm:gap-6 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
    } else {
      // Sidebar closed: More columns available
      return "grid grid-cols-1 gap-4 sm:gap-6 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    }
  }

  return (
    <ProtectedRoute>
      {/* All Note Page */}
      <div className="min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
        {/* Mobile Filter Overlay */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50 lg:hidden" onClick={closeFilter} />
        )}

        {/* Main Layout Container */}
        <div className="flex min-h-screen">
          {/* Filter Sidebar - RESPONSIVE WIDTH */}
          {/* Mobile: Only render when open */}
          {isFilterOpen && (
            <div className="fixed inset-y-0 left-0 z-50 w-72 border-r shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out sm:w-80 bg-white/95 border-white/20 lg:hidden">
              {sidebarContent}
            </div>
          )}

          {/* Desktop: Always render, but toggle width */}
          <div
            className={`hidden lg:flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transition-all duration-300 ease-in-out z-30 ${
              isFilterOpen ? "w-72 xl:w-80" : "overflow-hidden w-0"
            }`}
          >
            {sidebarContent}
          </div>

          {/* Main Content - FULLY RESPONSIVE */}
          <div className="flex flex-col flex-1 min-h-screen">
            {/* Title Section */}
            <div className="sticky top-0 z-30 flex-shrink-0 border-b backdrop-blur-sm bg-white/80 border-white/20">
              {/* RESPONSIVE CONTAINER */}
              <div className="px-4 py-4 mx-auto max-w-7xl md:px-8 lg:px-12">
                {/* Title and Filter Toggle */}
                <div className="flex gap-3 justify-between items-center mb-4 sm:gap-4 sm:mb-6">
                  <div className="flex gap-3 items-center sm:gap-4">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:text-2xl md:text-3xl lg:text-4xl">
                      All Notes
                    </h1>
                    {/* Filter Toggle for Large Screens */}
                    <button
                      onClick={toggleFilter}
                      className="hidden p-2 text-gray-600 bg-gray-100 rounded-lg shadow-sm transition-all duration-200 sm:p-3 sm:rounded-xl lg:flex hover:text-gray-800 hover:bg-gray-200 hover:scale-105"
                      title={isFilterOpen ? "Hide Filters" : "Show Filters"}
                    >
                      <FaFilter
                        className={`text-sm sm:text-base transition-colors duration-200 ${isFilterOpen ? "text-blue-500" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Filter Toggle for Mobile */}
                  <button
                    onClick={toggleFilter}
                    className="p-3 sm:p-3.5 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 transform hover:from-blue-600 hover:to-indigo-700 hover:scale-105 lg:hidden"
                  >
                    <FaFilter className="text-sm sm:text-base" />
                  </button>
                </div>

                {/* Search Bar Section - FULLY RESPONSIVE */}
                <div className="flex flex-col gap-3 items-stretch mb-4 sm:flex-row sm:gap-4 sm:items-center sm:mb-6">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-0">
                    <FaSearch className="absolute left-3 top-1/2 text-sm text-gray-400 transform -translate-y-1/2 sm:left-4 sm:text-base" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:shadow-md shadow-sm"
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex gap-3 items-center sm:gap-4">
                    {/* Sort Dropdown */}
                    <div className="relative flex-1 sm:flex-none">
                      <FaSort className="absolute left-3 top-1/2 text-sm text-gray-400 transform -translate-y-1/2 pointer-events-none sm:left-4 sm:text-base" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer hover:shadow-md shadow-sm min-w-[140px] sm:min-w-[160px]"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Downloaded</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>

                    {/* Refresh Button */}
                    <button
                      onClick={refreshNotes}
                      disabled={loading}
                      className="p-3 sm:p-3.5 text-gray-600 bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:text-gray-800 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm flex-shrink-0"
                      title="Refresh notes"
                    >
                      <FaSync
                        className={`text-sm sm:text-base transition-transform duration-200 ${loading ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Stats and Grid Indicator - RESPONSIVE */}
                <div className="flex flex-col gap-3 pt-3 border-t sm:flex-row sm:justify-between sm:items-center sm:gap-4 sm:pt-4 border-gray-200/50">
                  <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-4">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      Showing <span className="font-bold text-gray-800">{filteredNotes.length}</span> of{" "}
                      <span className="font-bold text-gray-800">{allNotes.length}</span> notes
                    </p>
                    {activeFilterCount > 0 && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full sm:px-3 w-fit">
                        {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
                      </span>
                    )}
                  </div>
                  {/* Grid indicator for large screens */}
                  <p className="hidden text-xs font-medium text-gray-500 lg:block">
                    {isFilterOpen ? "2-3 columns layout" : "3-5 columns layout"}
                  </p>
                </div>
              </div>
            </div>

            {/* Note Card and Category Div */}
            <div className="overflow-y-auto flex-1">
              {/* RESPONSIVE CONTAINER */}
              <div className="px-4 py-4 mx-auto max-w-7xl md:px-8 lg:px-12">
                {/* Category Section - RESPONSIVE */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800 sm:text-2xl sm:mb-6">
                    <span className="mr-3 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full sm:h-8 sm:mr-4"></span>
                    Categories
                  </h2>
                  <CategoryBar
                    onCategorySelect={handleCategorySelect}
                    selectedCategory={activeFilters.category || ""}
                  />
                </div>

                {/* NoteCard Grid - FULLY RESPONSIVE */}
                <div>
                  {loading ? (
                    <div className="flex flex-col justify-center items-center py-16 rounded-xl shadow-lg backdrop-blur-sm sm:py-24 sm:rounded-2xl bg-white/60">
                      <FaSpinner className="mb-4 text-3xl text-blue-500 animate-spin sm:mb-6 sm:text-5xl" />
                      <p className="text-lg font-medium text-gray-600 sm:text-xl">Loading notes...</p>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm sm:mt-2">
                        Please wait while we fetch your notes
                      </p>
                    </div>
                  ) : error ? (
                    <div className="py-16 text-center rounded-xl shadow-lg backdrop-blur-sm sm:py-20 sm:rounded-2xl bg-white/60">
                      <div className="mb-4 text-4xl sm:mb-6 sm:text-6xl">⚠️</div>
                      <div className="px-4 mb-3 text-lg font-medium text-red-500 sm:text-xl sm:mb-4">
                        Error: {error}
                      </div>
                      <button
                        onClick={refreshNotes}
                        className="px-6 py-3 mt-4 font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg transition-all duration-200 transform sm:mt-6 sm:px-8 sm:py-4 sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : filteredNotes.length > 0 ? (
                    <div className={getGridClasses()}>
                      {filteredNotes.map((note, index) => (
                        <div key={note.id} className="w-full">
                          {/* Note ${index + 1} */}
                          <NoteCard note={note} onClick={() => handleNoteCardClick(note.id)} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center rounded-xl shadow-lg backdrop-blur-sm sm:py-24 sm:rounded-2xl bg-white/60">
                      <div className="mb-4 text-6xl text-gray-300 sm:mb-6 sm:text-8xl">📝</div>
                      <h3 className="px-4 mb-3 text-xl font-medium text-gray-700 sm:mb-4 sm:text-2xl">
                        No notes found
                      </h3>
                      <p className="px-4 mx-auto mb-6 max-w-md text-base text-gray-500 sm:mb-8 sm:text-lg">
                        {activeFilterCount > 0
                          ? "Try adjusting your filters or search terms to find more notes."
                          : "No notes are available at the moment. Check back later!"}
                      </p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg transition-all duration-200 transform sm:px-8 sm:py-4 sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AllNotesPage
