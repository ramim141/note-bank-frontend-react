"use client"

import { useEffect, useState } from "react"
import bookmarkService from "../../api/apiService/bookmarkService"
import CategoryBar from "../notes/CategoryBar"
import NoteCard from "../notes/NoteCard"
import { Search, Bookmark, Heart, ChevronLeft, ChevronRight, Filter } from "lucide-react"

const Bookmarks = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [prev, setPrev] = useState(null)
  const [category, setCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchNotes = async (pageNum = 1, categoryName = "") => {
    setLoading(true)
    setError("")
    try {
      const res = await bookmarkService.getBookmarkedNotes({ category_name: categoryName, page: pageNum })
      if (Array.isArray(res)) {
        setNotes(res)
        setCount(res.length)
        setNext(null)
        setPrev(null)
      } else {
        setNotes(res.results || [])
        setCount(res.count || 0)
        setNext(res.next)
        setPrev(res.previous)
      }
      setPage(pageNum)
    } catch (err) {
      setError(err?.detail || "Failed to load bookmarks.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes(1, category)
    // eslint-disable-next-line
  }, [category])

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      note.title?.toLowerCase().includes(query) ||
      note.description?.toLowerCase().includes(query) ||
      note.subject?.toLowerCase().includes(query) ||
      note.category?.name?.toLowerCase().includes(query)
    )
  })

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
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin border-t-purple-600"></div>
      </div>
      <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Loading your bookmarks...
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="sticky top-0 z-20 border-b shadow-sm backdrop-blur-xl border-purple-100/50">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title and Stats */}
            <div className="flex items-center gap-4">
              <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                <Bookmark className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                  My Bookmarks
                </h1>
                <p className="flex items-center gap-2 font-medium text-gray-600">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {count} saved notes
                  {category && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-purple-600">in {category}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md lg:max-w-sm">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-gray-700 placeholder-gray-500 transition-all duration-300 border rounded-xl backdrop-blur-sm bg-white/70 border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute p-1 transition-colors duration-200 transform -translate-y-1/2 rounded-full right-3 top-1/2 hover:bg-gray-200"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filter by Category</h2>
          </div>
          <CategoryBar onCategorySelect={setCategory} selectedCategory={category} />
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="py-16 text-center">
            <div className="inline-block p-8 border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Bookmark className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-red-700">Oops! Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-block p-8 border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                <Bookmark className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-800">
                {searchQuery ? "No matching bookmarks found" : "No bookmarks yet!"}
              </h3>
              <p className="max-w-md mx-auto mb-6 text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms or browse all categories."
                  : "Start bookmarking your favorite notes to see them here."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-xl hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredNotes.length} of {count} bookmarks
                {searchQuery && (
                  <span className="px-3 py-1 ml-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                    "{searchQuery}"
                  </span>
                )}
              </p>
            </div>

            {/* Notes Grid */}
            <div className="grid gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-2">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <NoteCard 
                    note={note} 
                    onNoteUpdate={updateNoteInList}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!searchQuery && (prev || next) && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => fetchNotes(page - 1, category)}
              disabled={!prev || loading || page === 1}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 transform border shadow-sm rounded-xl backdrop-blur-sm group bg-white/80 border-purple-200/50 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Previous
            </button>

            <div className="flex items-center gap-2 px-4 py-3 border bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-purple-200/50">
              <span className="text-sm font-medium text-gray-600">Page</span>
              <span className="px-3 py-1 font-bold text-purple-600 bg-white rounded-lg shadow-sm">{page}</span>
            </div>

            <button
              onClick={() => fetchNotes(page + 1, category)}
              disabled={!next || loading}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 transform border shadow-sm rounded-xl backdrop-blur-sm group bg-white/80 border-purple-200/50 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}

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
    </div>
  )
}

export default Bookmarks
