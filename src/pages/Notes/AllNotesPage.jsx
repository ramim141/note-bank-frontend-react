// pages/notes/AllNotesPage.jsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"

import { useSearchParams } from "react-router-dom"
import { Search, Loader, ServerCrash, Frown, Filter, X } from 'lucide-react'
import { useAuth } from "../../context/useAuth"
import { noteService } from "../../api/apiService/noteService"
import { departmentService } from "../../api/apiService/departmentService"
import { courseService } from "../../api/apiService/courseService"

import CategoryBar from "../../components/Notes/CategoryBar"
import NoteCard from "../../components/Notes/NoteCard"
import Dropdown from "../../components/ui/Dropdown"


const getCacheKey = (params) => `notes-cache-${JSON.stringify(params)}`

const AllNotesPage = () => {

  const [searchParams, setSearchParams] = useSearchParams()

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

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Pagination States
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10))
  const [hasNextPage, setHasNextPage] = useState(false)

  const { token } = useAuth()
  const observer = useRef()

  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])

  // Fetch dropdown data on mount
  useEffect(() => {
    departmentService.getAllDepartments().then(setDepartments)
    courseService.getAllCourses().then(setCourses)
  }, [])


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


  const fetchNotes = useCallback(async (currentPage, currentFilters) => {
    const isFirstPageLoad = currentPage === 1
    
    // Construct params for API call and cache key
    const apiParams = {
      search: currentFilters.search,
      department: currentFilters.department,
      course: currentFilters.course,
      semester: currentFilters.semester,
      category__name: currentFilters.category,
      page: currentPage,
    }
    const cleanParams = Object.fromEntries(Object.entries(apiParams).filter(([_, v]) => v));
    const cacheKey = getCacheKey(cleanParams)

    // If it's the first page, check for cached data first
    if (isFirstPageLoad) {
      const cachedData = sessionStorage.getItem(cacheKey)
      if (cachedData) {
        const { notes: cachedNotes, hasNextPage: cachedHasNextPage } = JSON.parse(cachedData)
        setNotes(cachedNotes)
        setHasNextPage(cachedHasNextPage)
        setLoading(false) 
        return
      }
    }
    

    setLoading(true)

    try {
      setError(null)
      const data = await noteService.getNotes(cleanParams, token)
      const newNotes = data.results || (Array.isArray(data) ? data : [])
      const newHasNextPage = !!data.next

      // Update state based on page number
      if (isFirstPageLoad) {
        setNotes(newNotes)
      } else {
        // Append new notes, preventing duplicates
        setNotes((prev) => [...prev, ...newNotes.filter(n => !prev.some(p => p.id === n.id))])
      }
      setHasNextPage(newHasNextPage)


      if (isFirstPageLoad && newNotes.length > 0) {
        sessionStorage.setItem(cacheKey, JSON.stringify({ notes: newNotes, hasNextPage: newHasNextPage }))
      }

    } catch (err) {
      setError("Could not fetch notes. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [token]) 


  useEffect(() => {
    fetchNotes(page, filters)
  }, [page, filters, fetchNotes])



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
    [loading, hasNextPage],
  )


  const handleFilterChange = (newFilters) => {
    setPage(1)
    setNotes([]) 
    setFilters(newFilters)
  }
  
  const handleCategorySelect = (categoryName) => {
    handleFilterChange({ ...filters, category: categoryName })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    handleFilterChange({ ...filters, [name]: value })
  }

  const clearAllFilters = () => {
    handleFilterChange({ search: "", department: "", course: "", semester: "", category: "" })
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
            Explore All Notes
          </h1>
          <p className="text-lg text-gray-600 sm:text-xl">Find the resources you need for your study.</p>
        </header>

        {/* Search and Filter Section */}
        <div className="relative z-10 p-4 mb-6 border shadow-lg rounded-2xl backdrop-blur-md bg-white/80 border-gray-200/50 sm:p-6 sm:mb-8">
           {/* ... Mobile Filter Toggle ... */}
           <div className="flex items-center justify-between mb-4 sm:hidden">
            <h3 className="text-lg font-semibold text-gray-800">Search & Filter</h3>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
            >
              <Filter className="w-4 h-4" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="search" className="block mb-2 text-sm font-semibold text-gray-700">
              Search by Title or Description
            </label>
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="Select Department"
              id="department"
              name="department"
            />
            <Dropdown
              options={courseOptions}
              value={filters.course}
              onChange={handleInputChange}
              placeholder="Select Course"
              id="course"
              name="course"
            />
            <input
              type="text"
              id="semester"
              name="semester"
              value={filters.semester}
              onChange={handleInputChange}
              placeholder="e.g., 3rd Year 2nd Sem"
              className="w-full px-4 py-3 text-base transition-all duration-300 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-300"
            />
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-red-600 transition-all duration-300 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-sm"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="mb-8 align-middle sm:mb-10">
          <CategoryBar onCategorySelect={handleCategorySelect} selectedCategory={filters.category} />
        </div>
              
     
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 p-4 mb-6 border bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-blue-200/50">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.search && (
              <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.department && (
              <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Dept: {departmentOptions.find(d => d.value === filters.department)?.label || filters.department}
              </span>
            )}
            {filters.course && (
              <span className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                Course: {courseOptions.find(c => c.value === filters.course)?.label || filters.course}
              </span>
            )}
            {filters.semester && (
              <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                Semester: "{filters.semester}"
              </span>
            )}
            {filters.category && (
              <span className="px-3 py-1 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">
                Category: {filters.category}
              </span>
            )}
          </div>
        )}
        <main>
          {loading && notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
              <div className="relative mb-4">
                <Loader className="w-10 h-10 text-purple-500 animate-spin sm:w-12 sm:h-12" />
                <div className="absolute inset-0 w-10 h-10 border-2 border-purple-200 rounded-full animate-pulse sm:w-12 sm:h-12"></div>
              </div>
              <p className="text-lg font-semibold text-gray-700 sm:text-xl">Loading Notes...</p>
              <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your content</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-2xl sm:py-20">
              <ServerCrash className="w-10 h-10 mb-4 text-red-500 sm:w-12 sm:h-12" />
              <p className="text-lg font-semibold text-red-700 sm:text-xl">{error}</p>
              <button
                onClick={() => fetchNotes(page, filters)}
                className="px-6 py-2 mt-4 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              {notes.map((note, index) => {
                if (notes.length === index + 1) {
                  return (
                    <div ref={lastNoteElementRef} key={note.id}>
                      <NoteCard note={note} />
                    </div>
                  )
                } else {
                  return <NoteCard key={note.id} note={note} />
                }
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-yellow-50 rounded-2xl sm:py-20">
              <Frown className="w-10 h-10 mb-4 text-yellow-600 sm:w-12 sm:h-12" />
              <p className="text-lg font-semibold text-yellow-800 sm:text-xl">No Notes Found</p>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">Try adjusting your filters or search term.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 mt-4 text-sm font-medium text-yellow-700 transition-colors bg-yellow-100 rounded-lg hover:bg-yellow-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Loading indicator for pagination */}
          {loading && notes.length > 0 && (
            <div className="flex justify-center py-6 sm:py-8">
              <div className="relative">
                <Loader className="w-6 h-6 text-purple-500 animate-spin sm:w-8 sm:h-8" />
                <div className="absolute inset-0 w-6 h-6 border border-purple-200 rounded-full animate-pulse sm:w-8 sm:h-8"></div>
              </div>
            </div>
          )}

          {/* End of results message */}
          {!hasNextPage && !loading && notes.length > 0 && (
            <div className="py-8 font-semibold text-center text-gray-500 sm:py-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {"You've reached the end!"}
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AllNotesPage