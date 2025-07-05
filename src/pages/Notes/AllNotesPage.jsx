// pages/notes/AllNotesPage.jsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Loader, ServerCrash, Frown, Filter, X } from 'lucide-react'
import { useAuth } from "../../context/AuthContext" // আপনার useAuth হুকের সঠিক পাথ
import { noteService } from "../../api/apiService/noteService"
import { getDepartments, getCourses } from "../../api/apiService/userService" // userService থেকে ইম্পোর্ট করুন

import CategoryBar from "../../components/Notes/CategoryBar"
import NoteCard from "../../components/notes/NoteCard"
import Dropdown from "../../components/ui/Dropdown"

const AllNotesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { token } = useAuth()

  // State Management
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    department: searchParams.get("department") || "",
    course: searchParams.get("course") || "",
    semester: searchParams.get("semester") || "",
    category: searchParams.get("category") || "",
  })

  // Pagination and Infinite Scroll
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const observer = useRef()
  const activeRequestController = useRef(null) // Request cancellation-এর জন্য

  // Dropdown data
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch dropdown data on mount
  useEffect(() => {
    getDepartments().then(response => setDepartments(response.data || [])).catch(console.error)
    getCourses().then(response => setCourses(response.data || [])).catch(console.error)
  }, [])

  // Update URL search params when filters or page change
  useEffect(() => {
    const newSearchParams = new URLSearchParams()
    if (filters.search) newSearchParams.set("search", filters.search)
    if (filters.department) newSearchParams.set("department", filters.department)
    if (filters.course) newSearchParams.set("course", filters.course)
    if (filters.semester) newSearchParams.set("semester", filters.semester)
    if (filters.category) newSearchParams.set("category", filters.category)
    if (page > 1) newSearchParams.set("page", page)
    setSearchParams(newSearchParams, { replace: true })
  }, [filters, page, setSearchParams])

  // --- ডেটা ফেচ করার জন্য মূল useEffect ---
  useEffect(() => {
    // আগের রিকোয়েস্ট বাতিল করুন
    if (activeRequestController.current) {
      activeRequestController.current.abort()
    }
    // নতুন রিকোয়েস্টের জন্য নতুন কন্ট্রোলার তৈরি করুন
    const controller = new AbortController()
    activeRequestController.current = controller

    setLoading(true)
    setError(null)

    const apiParams = {
      search: filters.search,
      department__id: filters.department,
      course__id: filters.course,
      semester: filters.semester,
      category__name: filters.category,
      is_approved: true, // Only show approved notes
      page: page,
    }
    const cleanParams = Object.fromEntries(Object.entries(apiParams).filter(([_, v]) => v))
    
    // Debug: Log the parameters being sent
    console.log('API Parameters being sent:', cleanParams)
    
    noteService.getNotes(cleanParams, token, controller.signal)
      .then(data => {
        // Debug: Log the fetched notes data
        console.log('Fetched notes data:', data)
        console.log('First note sample:', data.results?.[0])
        
        // Debug: Log all note IDs
        if (data.results && data.results.length > 0) {
          console.log('Available note IDs:', data.results.map(note => ({
            id: note.id,
            title: note.title,
            file_name: note.file_name
          })))
        } else {
          console.log('No notes found in the response')
        }
        
        const newNotes = data.results || []
        const newHasNextPage = !!data.next

        setNotes(prevNotes => {
          // প্রথম পেইজ হলে, অ্যারে রিসেট করুন
          if (page === 1) {
            return newNotes
          }
          // পরের পেইজ হলে, শুধুমাত্র ইউনিক নোট যোগ করুন
          const existingNoteIds = new Set(prevNotes.map(n => n.id))
          const uniqueNewNotes = newNotes.filter(n => !existingNoteIds.has(n.id))
          return [...prevNotes, ...uniqueNewNotes]
        })
        setHasNextPage(newHasNextPage)
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError("Could not fetch notes. Please try again later.")
          console.error(err)
        }
      })
      .finally(() => {
        setLoading(false)
      })

    // Cleanup ফাংশন: কম্পোনেন্ট আনমাউন্ট হলে বা useEffect আবার রান করলে রিকোয়েস্ট বাতিল হবে
    return () => {
      controller.abort()
    }
  }, [page, filters, token]) // fetchNotes-কে আর useCallback বা dependency হিসেবে রাখার প্রয়োজন নেই


  // --- ইনফিনিট স্ক্রোলের জন্য Intersection Observer ---
  const lastNoteElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasNextPage]
  )
  
  // --- ইভেন্ট হ্যান্ডলার ---
  const handleFilterChange = (name, value) => {
    console.log('handleFilterChange called:', { name, value })
    // আগের নোটগুলো না দেখিয়ে নতুন করে লোড করার জন্য
    setNotes([])
    setPage(1) // ফিল্টার পরিবর্তনের সাথে সাথে পেইজ ১-এ ফিরে যান
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: value }
      console.log('New filters state:', newFilters)
      return newFilters
    })
  }

  const handleCategorySelect = (categoryName) => {
    handleFilterChange('category', categoryName)
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    // Debounce a search input could be a good idea here
    handleFilterChange(name, value)
  }
  
  const clearAllFilters = () => {
    setNotes([])
    setPage(1)
    setFilters({ search: "", department: "", course: "", semester: "", category: "" })
  }

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

  const hasActiveFilters = Object.values(filters).some(v => v !== "")
  const departmentOptions = departments.map((dept) => ({ value: dept.id, label: dept.name }))
  const courseOptions = courses.map((course) => ({ value: course.id, label: course.name }))

  return (
    <div className="min-h-screen pt-32 pb-32 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
      <div className="container px-3 py-6 mx-auto max-w-7xl sm:px-4 sm:py-8">
        {/* Page Header */}
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="mb-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 sm:text-5xl lg:text-6xl">
            Explore Approved Notes
          </h1>
          <p className="text-lg text-gray-600 sm:text-xl">Find the resources you need for your study. Only approved notes are shown.</p>
        </header>

        {/* Search and Filter Section */}
        <div className="relative z-10 p-4 mb-6 border shadow-lg rounded-2xl backdrop-blur-md bg-white/80 border-gray-200/50 sm:p-6 sm:mb-8">
           <div className="flex items-center justify-between mb-4 sm:hidden">
            <h3 className="text-lg font-semibold text-gray-800">Search & Filter</h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setShowMobileFilters(!showMobileFilters)
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
            >
              <Filter className="w-4 h-4" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label htmlFor="search" className="block mb-2 text-sm font-semibold text-gray-700">
                Search by Title, Tags, etc.
              </label>
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={(e) => {
                    e.preventDefault()
                    handleInputChange(e)
                  }}
                  placeholder="e.g., Data Structures, SVM, Final..."
                  className="w-full py-3 pl-10 pr-4 text-base transition-all duration-300 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-300"
                />
              </div>
            </div>
            
            <div
              className={`grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3 ${showMobileFilters ? "grid" : "hidden sm:grid"} transition-all duration-300`}
            >
              <Dropdown
                options={departmentOptions}
                value={filters.department}
                onChange={(e) => {
                  console.log('Department selected:', e.target.value)
                  handleFilterChange('department', e.target.value)
                }}
                placeholder="Select Department"
                id="department"
                name="department"
              />
              <Dropdown
                options={courseOptions}
                value={filters.course}
                onChange={(e) => {
                  console.log('Course selected:', e.target.value)
                  handleFilterChange('course', e.target.value)
                }}
                placeholder="Select Course"
                id="course"
                name="course"
              />
              <input
                type="text"
                id="semester"
                name="semester"
                value={filters.semester}
                onChange={(e) => {
                  e.preventDefault()
                  handleInputChange(e)
                }}
                placeholder="e.g., 3rd Year 2nd Sem"
                className="w-full px-4 py-3 text-base transition-all duration-300 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-300"
              />
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      clearAllFilters()
                    }}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-red-600 transition-all duration-300 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Category Bar */}
        <div className="mb-8 align-middle sm:mb-10">
          <CategoryBar onCategorySelect={handleCategorySelect} selectedCategory={filters.category} />
        </div>
              
     
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 p-4 mb-6 border bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-blue-200/50">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.search && <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">Search: "{filters.search}"</span>}
            {filters.department && <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Dept: {departmentOptions.find(d => d.value.toString() === filters.department)?.label || filters.department}</span>}
            {filters.course && <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">Course: {courseOptions.find(c => c.value.toString() === filters.course)?.label || filters.course}</span>}
            {filters.semester && <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">Semester: "{filters.semester}"</span>}
            {filters.category && <span className="px-3 py-1 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">Category: {filters.category}</span>}
          </div>
        )}
        <main>
          {loading && notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
              <Loader className="w-12 h-12 text-purple-500 animate-spin" />
              <p className="mt-4 text-xl font-semibold text-gray-700">Loading Notes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-2xl sm:py-20">
              <ServerCrash className="w-12 h-12 mb-4 text-red-500" />
              <p className="text-xl font-semibold text-red-700">{error}</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              {notes.map((note, index) => {
                if (notes.length === index + 1) {
                  return (
                    <div ref={lastNoteElementRef} key={note.id}>
                      <NoteCard 
                        note={note} 
                        onNoteUpdate={updateNoteInList}
                      />
                    </div>
                  )
                } else {
                  return (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onNoteUpdate={updateNoteInList}
                    />
                  )
                }
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-yellow-50 rounded-2xl sm:py-20">
              <Frown className="w-12 h-12 mb-4 text-yellow-600" />
              <p className="text-xl font-semibold text-yellow-800">No Notes Found</p>
              <p className="mt-2 text-base text-gray-600">Try adjusting your filters or search term.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    clearAllFilters()
                  }}
                  className="px-6 py-2 mt-4 text-sm font-medium text-yellow-700 transition-colors bg-yellow-100 rounded-lg hover:bg-yellow-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {loading && notes.length > 0 && (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          )}

          {!hasNextPage && !loading && notes.length > 0 && (
            <div className="py-10 font-semibold text-center text-gray-500">
              <p>You've reached the end!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AllNotesPage