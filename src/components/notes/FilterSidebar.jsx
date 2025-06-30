"use client"

import { useState, useEffect } from "react"
import { Filter, Tag, GraduationCap, Building, Calendar, Loader2, X, Trash2 } from "lucide-react"

// --- API Services ---
import { categoryService } from "../../api/apiService/categoryService"
import { courseService } from "../../api/apiService/courseService"
import { departmentService } from "../../api/apiService/departmentService"

const FilterSidebar = ({ onFilterChange, activeFilters = {} }) => {
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])

  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [departmentsLoading, setDepartmentsLoading] = useState(true)

  // Controlled form values that sync with activeFilters
  const [formValues, setFormValues] = useState({
    category: "",
    course: "",
    department: "",
    semester: "",
  })

  // Sync form values with activeFilters prop
  useEffect(() => {
    setFormValues({
      category: activeFilters.category || "",
      course: activeFilters.course || "",
      department: activeFilters.department || "",
      semester: activeFilters.semester || "",
    })
  }, [activeFilters])

  // Fetch dropdown data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch Categories with caching
        const fetchCategories = async () => {
          try {
            const savedCategories = localStorage.getItem("categories")
            if (savedCategories) {
              const parsedCategories = JSON.parse(savedCategories)
              // Check if data is less than 5 minutes old
              if (parsedCategories.timestamp && Date.now() - parsedCategories.timestamp < 5 * 60 * 1000) {
                setCategories(parsedCategories.data)
                setCategoriesLoading(false)
                return
              }
            }

            const data = await categoryService.getAllCategories()
            setCategories(data)
            localStorage.setItem(
              "categories",
              JSON.stringify({
                data,
                timestamp: Date.now(),
              }),
            )
            setCategoriesLoading(false)
          } catch (error) {
            console.error("Error fetching categories:", error)
            setCategoriesLoading(false)
          }
        }

        // Fetch Departments with caching
        const fetchDepartments = async () => {
          try {
            const savedDepartments = localStorage.getItem("departments")
            if (savedDepartments) {
              const parsedDepartments = JSON.parse(savedDepartments)
              if (parsedDepartments.timestamp && Date.now() - parsedDepartments.timestamp < 5 * 60 * 1000) {
                setDepartments(parsedDepartments.data)
                setDepartmentsLoading(false)
                return
              }
            }

            const data = await departmentService.getAllDepartments()
            setDepartments(data)
            localStorage.setItem(
              "departments",
              JSON.stringify({
                data,
                timestamp: Date.now(),
              }),
            )
            setDepartmentsLoading(false)
          } catch (error) {
            console.error("Error fetching departments:", error)
            setDepartmentsLoading(false)
          }
        }

        // Fetch Courses with caching
        const fetchCourses = async () => {
          try {
            const savedCourses = localStorage.getItem("courses")
            if (savedCourses) {
              const parsedCourses = JSON.parse(savedCourses)
              if (parsedCourses.timestamp && Date.now() - parsedCourses.timestamp < 5 * 60 * 1000) {
                setCourses(parsedCourses.data)
                setCoursesLoading(false)
                return
              }
            }

            const data = await courseService.getAllCourses()
            setCourses(data)
            localStorage.setItem(
              "courses",
              JSON.stringify({
                data,
                timestamp: Date.now(),
              }),
            )
            setCoursesLoading(false)
          } catch (error) {
            console.error("Error fetching courses:", error)
            setCoursesLoading(false)
          }
        }

        // Fetch all data concurrently
        await Promise.all([fetchCategories(), fetchDepartments(), fetchCourses()])
      } catch (error) {
        console.error("Error fetching filter data:", error)
        console.error("Failed to load some filter options. Please refresh the page.")
      }
    }

    fetchFilterData()
  }, [])

  const handleFilterChange = (filterName, filterValue) => {
    // Update local form state
    setFormValues((prev) => ({
      ...prev,
      [filterName]: filterValue,
    }))

    // Notify parent component
    onFilterChange(filterName, filterValue)
  }

  const clearIndividualFilter = (filterName) => {
    handleFilterChange(filterName, "")
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      category: "",
      course: "",
      department: "",
      semester: "",
    }

    setFormValues(emptyFilters)

    // Clear all filters in parent
    Object.keys(emptyFilters).forEach((key) => {
      onFilterChange(key, "")
    })
  }

  // Get count of active filters
  const activeFilterCount = Object.values(formValues).filter((value) => value && value !== "").length

  // Helper component for loading state
  const LoadingState = ({ color, text }) => (
    <div className="flex justify-center items-center px-4 py-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100">
      <Loader2 className={`mr-3 animate-spin ${color}`} />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  )

  // Helper component for empty state
  const EmptyState = ({ message }) => (
    <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100">
      <p className="text-sm text-center text-gray-500">{message}</p>
    </div>
  )

  // Helper component for filter input with clear button
  const FilterInput = ({ id, name, value, onChange, placeholder, icon: Icon, iconColor, focusColor }) => (
    <div className="relative group">
      <Icon
        className={`absolute left-4 top-1/2 z-10 w-4 h-4 transform -translate-y-1/2 pointer-events-none ${iconColor}`}
      />
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 ${focusColor}/20 focus:border-${focusColor.split("-")[1]}-500 transition-all duration-300 bg-white/80 hover:shadow-lg hover:border-gray-300 group-hover:bg-white`}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => clearIndividualFilter(name)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-${focusColor.split("-")[1]}-500 transition-colors rounded-full hover:bg-gray-100`}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )

  // Helper component for select dropdown with clear button
  const FilterSelect = ({
    id,
    name,
    value,
    onChange,
    options,
    placeholder,
    icon: Icon,
    iconColor,
    focusColor,
    loading,
    emptyMessage,
  }) => {
    if (loading) {
      return <LoadingState color={iconColor} text="Loading..." />
    }

    if (!options || options.length === 0) {
      return <EmptyState message={emptyMessage} />
    }

    return (
      <div className="relative group">
        <Icon
          className={`absolute left-4 top-1/2 z-10 w-4 h-4 transform -translate-y-1/2 pointer-events-none ${iconColor}`}
        />
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 ${focusColor}/20 focus:border-${focusColor.split("-")[1]}-500 transition-all duration-300 bg-white/80 hover:shadow-lg hover:border-gray-300 appearance-none cursor-pointer group-hover:bg-white`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        {value && (
          <button
            onClick={() => clearIndividualFilter(name)}
            className={`absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-${focusColor.split("-")[1]}-500 transition-colors rounded-full hover:bg-gray-100`}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Header with Active Count */}
      {activeFilterCount > 0 && (
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <Filter className="mr-2 w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-700">
              {activeFilterCount} Active Filter{activeFilterCount !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Trash2 className="mr-1 w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <label htmlFor="category" className="flex items-center text-sm font-bold text-gray-800">
          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
            <Tag className="w-4 h-4 text-white" />
          </div>
          Category
          {formValues.category && (
            <span className="px-2 py-0.5 ml-2 text-xs text-pink-600 bg-pink-100 rounded-full">Applied</span>
          )}
        </label>
        <FilterSelect
          id="category"
          name="category"
          value={formValues.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          options={categories}
          placeholder="All Categories"
          icon={Tag}
          iconColor="text-pink-500"
          focusColor="focus:ring-pink-500"
          loading={categoriesLoading}
          emptyMessage="No categories available"
        />
      </div>

      {/* Course Filter */}
      <div className="space-y-3">
        <label htmlFor="course" className="flex items-center text-sm font-bold text-gray-800">
          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          Course
          {formValues.course && (
            <span className="px-2 py-0.5 ml-2 text-xs text-blue-600 bg-blue-100 rounded-full">Applied</span>
          )}
        </label>
        <FilterSelect
          id="course"
          name="course"
          value={formValues.course}
          onChange={(e) => handleFilterChange("course", e.target.value)}
          options={courses}
          placeholder="All Courses"
          icon={GraduationCap}
          iconColor="text-blue-500"
          focusColor="focus:ring-blue-500"
          loading={coursesLoading}
          emptyMessage="No courses available"
        />
      </div>

      {/* Department Filter */}
      <div className="space-y-3">
        <label htmlFor="department" className="flex items-center text-sm font-bold text-gray-800">
          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Building className="w-4 h-4 text-white" />
          </div>
          Department
          {formValues.department && (
            <span className="px-2 py-0.5 ml-2 text-xs text-green-600 bg-green-100 rounded-full">Applied</span>
          )}
        </label>
        <FilterSelect
          id="department"
          name="department"
          value={formValues.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          options={departments}
          placeholder="All Departments"
          icon={Building}
          iconColor="text-green-500"
          focusColor="focus:ring-green-500"
          loading={departmentsLoading}
          emptyMessage="No departments available"
        />
      </div>

      {/* Semester Filter */}
      <div className="space-y-3">
        <label htmlFor="semester" className="flex items-center text-sm font-bold text-gray-800">
          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          Semester
          {formValues.semester && (
            <span className="px-2 py-0.5 ml-2 text-xs text-orange-600 bg-orange-100 rounded-full">Applied</span>
          )}
        </label>
        <FilterInput
          id="semester"
          name="semester"
          value={formValues.semester}
          onChange={(e) => handleFilterChange("semester", e.target.value)}
          placeholder="e.g., Fall 2024, Spring 2025"
          icon={Calendar}
          iconColor="text-orange-500"
          focusColor="focus:ring-orange-500"
        />
      </div>

      {/* Clear All Filters Button */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="flex justify-center items-center px-4 py-3 w-full font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border border-gray-300 shadow-sm transition-all duration-200 hover:from-gray-200 hover:to-gray-300 hover:shadow-md active:scale-95"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* Filter Tips */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h4 className="mb-2 text-sm font-semibold text-blue-800">💡 Filter Tips</h4>
        <ul className="space-y-1 text-xs text-blue-600">
          <li>• Use multiple filters to narrow down results</li>
          <li>• Semester field supports partial matches</li>
          <li>• Clear individual filters by clicking the ✕ icon</li>
          <li>• Filters work together with search and sorting</li>
        </ul>
      </div>
    </div>
  )
}

export default FilterSidebar
