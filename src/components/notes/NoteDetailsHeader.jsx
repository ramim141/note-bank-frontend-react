import { FileText, Star, Calendar, User, Building, GraduationCap } from "lucide-react"
import { getFileDisplay } from '../../utils/fileUtils.jsx' 

const NoteDetailsHeader = ({ note }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }


  const departmentName = note?.department_name || "Department"
  const uploaderName =
    note?.uploader_first_name && note?.uploader_last_name
      ? `${note.uploader_first_name} ${note.uploader_last_name}`
      : note?.uploader_username || "NoteBank User"

  const courseName = note?.course_name || "Course"
  const roundedRating = note?.average_rating ? Math.round(note.average_rating * 10) / 10 : 0 
  const noteCategory = note?.category_name || "General"
  const fileName = note?.file_name || "No File"
  const fileDisplay = getFileDisplay(fileName) 
  const facultyName = note?.faculty_name || "Faculty N/A"
  const createdAt = note?.created_at ? formatDate(note.created_at) : "N/A"
  const totalRatings = note?.star_ratings ? note.star_ratings.length : 0

  return (
    <div className="p-8 text-white bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-t-3xl">
      <div className="flex flex-wrap gap-6 items-start lg:flex-nowrap">
        {/* File Icon and Name */}
        <div className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36">
          <div className="flex flex-col justify-center items-center p-4 h-full bg-gradient-to-br rounded-2xl transition-all duration-300 from-blue-100/50 to-purple-100/50 hover:scale-105 hover:from-blue-100 hover:to-purple-100">
            {fileDisplay.icon}
            <span className="mt-2 text-xs font-bold text-center text-gray-700 transition-all duration-300 sm:text-sm hover:text-gray-900 hover:scale-110">
              {fileDisplay.text}
            </span>
          </div>
        </div>

        {/* Note Information */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1 className="mb-4 text-3xl font-extrabold leading-tight break-words sm:text-4xl">{note?.title}</h1>

          {/* Tags and Category */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="inline-flex gap-2 items-center px-4 py-2 text-purple-700 bg-purple-100 rounded-full shadow-sm transition-all duration-300 hover:bg-purple-200 hover:scale-105 group/faculty">
              <GraduationCap className="w-4 h-4 transition-transform duration-300 group-hover/faculty:rotate-12" />
              <span className="text-sm font-medium transition-all duration-300 group-hover/faculty:font-semibold">
                {facultyName}
              </span>
            </div>
            <div className="flex gap-1 items-center px-3 py-2 text-sm font-medium rounded-full shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/20 hover:bg-white/30 hover:scale-105">
              <FileText className="w-3 h-3" />
              <span>{noteCategory}</span>
            </div>
            <div className="px-3 py-2 text-sm font-medium rounded-full shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/20 hover:bg-white/30 hover:scale-105">
              {courseName}
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-2 items-center mb-4">
            <div className="flex gap-0.5"> 
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-all duration-300 ${
                    star <= roundedRating
                      ? "text-yellow-300 fill-current"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/90">
              <span className="">
                {note?.average_rating ? note.average_rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-white">({totalRatings} ratings)</span>
            </span>
          </div>

          {/* Upload Info */}
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <div className="flex gap-1 items-center">
              <User className="w-4 h-4" />
              <span>By {uploaderName}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Building className="w-4 h-4" />
              <span>{departmentName}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Calendar className="w-4 h-4" />
              <span>Uploaded {createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailsHeader