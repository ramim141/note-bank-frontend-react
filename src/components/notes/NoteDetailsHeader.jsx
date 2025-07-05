import { FileText, Star, Calendar, User, Building } from "lucide-react"

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
      : note?.uploader_username || "notebank"

  const courseName = note?.course_name || "Course"
  const category = note?.category_name || "Note"
  const roundedRating = note?.average_rating ? Math.round(note.average_rating) : 0
  const noteCategory = note?.category_name || "Note"
  const fileName = note?.file_name || "file"
  const fileExtension = fileName?.split(".").pop() || "file"
  const facultyName = note?.faculty_name || "Faculty"
  const createdAt = note?.created_at ? formatDate(note.created_at) : "N/A"
  return (
    <div className="p-8 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600">
      <div className="flex gap-6 items-start">
        {/* File Icon */}
        <div className="flex-shrink-0 p-4 rounded-2xl backdrop-blur-sm bg-white/20">
          <FileText className="w-12 h-12 text-white" />
          <div className="mt-2 text-center">
            <span className="text-xs font-bold">{fileExtension}</span>
          </div>
        </div>

        {/* Note Information */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight">{note?.title || "TOC note final"}</h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex gap-1 items-center px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm bg-white/20">
              <Building className="w-3 h-3" />
              {noteCategory}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm bg-white/20">
              {courseName}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm bg-white/20">
             {facultyName}
            </span>
          </div>

          {/* Rating */}
          <div className="flex gap-2 items-center mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= roundedRating ? "text-yellow-300 fill-current" : "text-white/30"}`}
                />
              ))}
            </div>
            <span className="text-sm text-white/90">
              {note?.average_rating ? note.average_rating.toFixed(1) : "0.0"} (0 ratings)
            </span>
          </div>

          {/* Upload Info */}
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <div className="flex gap-1 items-center">
              <User className="w-4 h-4" />
              <span>By {uploaderName}</span>
            </div>
            <div className="flex gap-1 items-center">
              <FileText className="w-4 h-4" />
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
