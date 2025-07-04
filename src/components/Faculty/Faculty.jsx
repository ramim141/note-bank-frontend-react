"use client"

import { useEffect, useState } from "react"
import { facultyService } from "../../api/apiService/facultyService"
import { departmentService } from "../../api/apiService/departmentService"
import { Search, Users, Mail, Building2, User, GraduationCap, Filter, Download } from "lucide-react"

const Faculty = () => {
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultyData, departmentData] = await Promise.all([
          facultyService.getAllFaculties(),
          departmentService.getAllDepartments()
        ])
        setFaculties(facultyData)
        setDepartments(departmentData)
        setLoading(false)
      } catch {
        setError("Failed to load faculties or departments.")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Map department ID to name
  const departmentMap = departments.reduce((acc, dept) => {
    acc[dept.id] = dept.name
    return acc
  }, {})

  // Filter faculties based on search query (name, department name, or email)
  const filteredFaculties = faculties.filter((faculty) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const deptName = departmentMap[faculty.department]?.toLowerCase() || ""
    return (
      faculty.name?.toLowerCase().includes(query) ||
      deptName.includes(query) ||
      faculty.email?.toLowerCase().includes(query)
    )
  })

  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent animate-spin border-t-purple-600"></div>
      </div>
      <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Loading faculty members...
      </p>
    </div>
  )

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="p-8 text-center bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl border border-red-100 shadow-lg">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-700">Error Loading Faculty</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 border-b shadow-sm backdrop-blur-xl border-purple-100/50">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title and Stats */}
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                  Faculty Directory
                </h1>
                <p className="flex gap-2 items-center font-medium text-gray-600">
                  <Users className="w-4 h-4 text-purple-500" />
                  {faculties.length} faculty members
                  {searchQuery && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-indigo-600">{filteredFaculties.length} matching</span>
                    </>
                  )}
                </p>
              </div>
            </div>

           
          </div>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-4 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-3 pr-4 pl-12 w-full placeholder-gray-500 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/70 border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 p-1 rounded-full transition-colors duration-200 transform -translate-y-1/2 hover:bg-gray-200"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {filteredFaculties.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100">
              <div className="flex justify-center items-center mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full">
                <Users className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-800">
                {searchQuery ? "No matching faculty found" : "No faculty members"}
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms or browse all faculty members."
                  : "Faculty information will appear here once available."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
           
            {/* Faculty Table */}
            <div className="overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm bg-white/60 border-purple-100/50">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r backdrop-blur-sm from-purple-500/10 to-indigo-500/10">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="flex gap-2 items-center text-sm font-bold text-purple-700">
                          <User className="w-4 h-4" />
                          Name
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex gap-2 items-center text-sm font-bold text-purple-700">
                          <Building2 className="w-4 h-4" />
                          Department
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex gap-2 items-center text-sm font-bold text-purple-700">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100/50">
                    {filteredFaculties.map((faculty, index) => (
                      <tr
                        key={faculty.id}
                        className="transition-all duration-300 group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: "fadeInUp 0.5s ease-out forwards",
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            <div className="flex justify-center items-center w-10 h-10 font-semibold text-white bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110">
                              {faculty.name?.charAt(0)?.toUpperCase() || "F"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 transition-colors duration-300 group-hover:text-purple-700">
                                {faculty.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                            <span className="font-medium text-gray-600 transition-colors duration-300 group-hover:text-indigo-600">
                              {departmentMap[faculty.department] || faculty.department}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${faculty.email}`}
                            className="flex gap-2 items-center font-medium text-blue-600 transition-all duration-300 group/email hover:text-blue-700"
                          >
                            <Mail className="w-4 h-4 transition-transform duration-300 group-hover/email:scale-110" />
                            <span className="group-hover/email:underline">{faculty.email}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All faculty members loaded</span>
              </div>
              <div className="flex gap-4 items-center">
                <span>Total: {faculties.length} members</span>
              </div>
            </div>
          </>
        )}

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
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

export default Faculty
