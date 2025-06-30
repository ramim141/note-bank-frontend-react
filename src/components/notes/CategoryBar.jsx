"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Tag, LoaderPinwheelIcon as Spinner, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { categoryService } from '../../api/apiService/categoryService'

const CategoryBar = ({ onCategorySelect, selectedCategory = '' }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const savedCategories = localStorage.getItem('categories')
        if (savedCategories) {
          try {
            const parsedCategories = JSON.parse(savedCategories)
            if (parsedCategories.data && Array.isArray(parsedCategories.data) && (Date.now() - parsedCategories.timestamp < 300000)) {
              setCategories(parsedCategories.data)
              setLoading(false)
              return
            } else {
              throw new Error("Cached data expired or invalid.")
            }
          } catch {
            localStorage.removeItem('categories')
          }
        }

        const data = await categoryService.getAllCategories()
        const categoriesArray = Array.isArray(data) ? data : (data.results || [])
        setCategories(categoriesArray)
        localStorage.setItem('categories', JSON.stringify({ data: categoriesArray, timestamp: Date.now() }))
        setLoading(false)
      } catch (err) {
        setError("Failed to load categories.")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = useCallback((categoryName) => {
    const newCategory = selectedCategory === categoryName ? '' : categoryName
    onCategorySelect(newCategory)
  }, [selectedCategory, onCategorySelect])

  const scrollLeft = useCallback(() => {
    document.getElementById('category-container')?.scrollBy({ left: -300, behavior: 'smooth' })
  }, [])

  const scrollRight = useCallback(() => {
    document.getElementById('category-container')?.scrollBy({ left: 300, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 rounded-xl border shadow-lg backdrop-blur-sm sm:p-6 sm:rounded-2xl bg-white/80 border-white/20">
        <Spinner className="mr-2 w-4 h-4 text-blue-500 animate-spin sm:w-5 sm:h-5 sm:mr-3" />
        <span className="text-sm text-gray-500 sm:text-base">Loading categories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 rounded-xl border shadow-lg backdrop-blur-sm sm:p-6 sm:rounded-2xl bg-white/80 border-white/20">
        <p className="text-sm sm:text-base">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl border shadow-lg backdrop-blur-sm sm:p-6 sm:rounded-2xl bg-white/80 border-white/20">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center text-base font-bold text-gray-800 sm:text-lg">
          <Tag className="mr-2 w-4 h-4 text-pink-500 sm:w-5 sm:h-5 sm:mr-3" />
          Categories
          {selectedCategory && (
            <span className="px-2 py-1 ml-2 text-xs text-purple-700 bg-purple-100 rounded-full">
              {categories.some(cat => cat.name === selectedCategory) ? 'Active' : 'Custom'}
            </span>
          )}
        </div>
      </div>

      {/* Arrows - Mobile Only */}
      <div className="relative h-0 sm:hidden">
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 z-10 p-2 text-gray-600 bg-white rounded-full shadow-md transition -translate-y-1/2 hover:bg-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 z-10 p-2 text-gray-600 bg-white rounded-full shadow-md transition -translate-y-1/2 hover:bg-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div
          id="category-container"
          className="flex overflow-x-auto gap-2 items-center pb-2 sm:gap-3 sm:pb-3 scrollbar-hide snap-x scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "All" Button */}
          <button
            onClick={() => handleCategoryClick('')}
            className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base snap-start ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg ring-2 ring-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 ${selectedCategory === '' ? 'bg-white/80' : 'bg-blue-500'}`} />
              All Categories
            </div>
          </button>

          {/* Dynamic Buttons */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base snap-start ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg ring-2 ring-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 ${selectedCategory === cat.name ? 'bg-white/80' : 'bg-purple-500'}`} />
                {cat.name}
              </div>
            </button>
          ))}
        </div>

        {/* Edge Fade - optional */}
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r to-transparent pointer-events-none from-white/80 sm:hidden" />
        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l to-transparent pointer-events-none from-white/80 sm:hidden" />
      </div>

      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="p-3 mt-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 sm:p-4 sm:mt-4 sm:rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Tag className="mr-2 w-3 h-3 text-purple-500 sm:w-4 sm:h-4" />
              <span className="text-xs font-medium text-purple-700 sm:text-sm">
                Filtering by: <span className="font-bold">{selectedCategory}</span>
              </span>
            </div>
            <button
              onClick={() => handleCategoryClick('')}
              className="flex items-center text-xs font-medium text-purple-500 transition hover:text-purple-700 hover:scale-105 sm:text-sm"
            >
              <X className="mr-1 w-3 h-3" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryBar
