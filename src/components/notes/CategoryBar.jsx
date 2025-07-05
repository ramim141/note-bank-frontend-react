"use client"

import { useState, useEffect, useCallback } from "react"
import { Tag, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react"
import { categoryService } from "../../api/apiService/categoryService"

const CategoryBar = ({ onCategorySelect, selectedCategory = "" }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const savedCategories = localStorage.getItem("categories")
        if (savedCategories) {
          try {
            const parsedCategories = JSON.parse(savedCategories)
            if (
              parsedCategories.data &&
              Array.isArray(parsedCategories.data) &&
              Date.now() - parsedCategories.timestamp < 300000
            ) {
              setCategories(parsedCategories.data)
              setLoading(false)
              return
            } else {
              throw new Error("Cached data expired or invalid.")
            }
          } catch {
            localStorage.removeItem("categories")
          }
        }

        const data = await categoryService.getAllCategories()
        const categoriesArray = Array.isArray(data) ? data : data.results || []
        setCategories(categoriesArray)
        localStorage.setItem("categories", JSON.stringify({ data: categoriesArray, timestamp: Date.now() }))
        setLoading(false)
      } catch (err) {
        setError("Failed to load categories.")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = useCallback(
    (categoryName) => {
      const newCategory = selectedCategory === categoryName ? "" : categoryName
      onCategorySelect(newCategory)
    },
    [selectedCategory, onCategorySelect],
  )

  const scrollLeft = useCallback(() => {
    document.getElementById("category-container")?.scrollBy({ left: -300, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    document.getElementById("category-container")?.scrollBy({ left: 300, behavior: "smooth" })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 border shadow-lg rounded-2xl backdrop-blur-sm bg-white/60 border-purple-100/50">
        <div className="relative mr-3">
          <div className="w-5 h-5 border-2 border-purple-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-5 h-5 border-2 border-transparent rounded-full animate-spin border-t-purple-600"></div>
        </div>
        <span className="font-medium text-gray-600">Loading categories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-red-100 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full">
          <X className="w-6 h-6 text-red-500" />
        </div>
        <p className="font-medium text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 border shadow-lg rounded-2xl backdrop-blur-sm bg-white/60 border-purple-100/50 sm:p-6">
      {/* Mobile scroll buttons */}
      <div className="relative mb-4 sm:hidden">
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 transition-all duration-300 transform -translate-y-1/2 border rounded-full shadow-md top-1/2 backdrop-blur-sm bg-white/90 border-purple-100/50 hover:bg-white hover:shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-purple-600" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 transition-all duration-300 transform -translate-y-1/2 border rounded-full shadow-md top-1/2 backdrop-blur-sm bg-white/90 border-purple-100/50 hover:bg-white hover:shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-purple-600" />
        </button>
      </div>

      <div className="relative">
        <div
          id="category-container"
          className="flex items-center gap-3 px-8 pb-2 overflow-x-auto scrollbar-hide snap-x scroll-smooth sm:px-0 sm:flex-wrap sm:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* "All" Button */}
          <button
            onClick={() => handleCategoryClick("")}
            className={`group flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap snap-start shadow-sm hover:shadow-md ${
              selectedCategory === ""
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg ring-2 ring-purple-200/50"
                : "bg-white/80 text-gray-700 hover:bg-white border border-purple-100/50"
            }`}
          >
            <Sparkles
              className={`w-4 h-4 ${selectedCategory === "" ? "text-white" : "text-purple-500"} group-hover:rotate-12 transition-transform duration-300`}
            />
            All Categories
            {selectedCategory === "" && <div className="w-2 h-2 rounded-full animate-pulse bg-white/80" />}
          </button>

          {/* Dynamic Category Buttons */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap snap-start shadow-sm hover:shadow-md ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg ring-2 ring-indigo-200/50"
                  : "bg-white/80 text-gray-700 hover:bg-white border border-purple-100/50"
              }`}
            >
              <Tag
                className={`w-4 h-4 ${selectedCategory === cat.name ? "text-white" : "text-indigo-500"} group-hover:rotate-12 transition-transform duration-300`}
              />
              {cat.name}
              {selectedCategory === cat.name && <div className="w-2 h-2 rounded-full animate-pulse bg-white/80" />}
            </button>
          ))}
        </div>

        {/* Edge fade effects for mobile */}
        <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-r to-transparent from-white/60 sm:hidden" />
        <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none bg-gradient-to-l to-transparent from-white/60 sm:hidden" />
      </div>

      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="p-4 mt-4 border shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-purple-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100">
                <Tag className="w-3 h-3 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-purple-700">
                Filtering by: <span className="text-purple-800">{selectedCategory}</span>
              </span>
            </div>
            <button
              onClick={() => handleCategoryClick("")}
              className="group flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white/60 hover:bg-white rounded-lg border border-purple-200/50 transition-all duration-300 hover:shadow-sm"
            >
              <X className="w-3 h-3 transition-transform duration-300 group-hover:rotate-90" />
              Clear
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        #category-container::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default CategoryBar
