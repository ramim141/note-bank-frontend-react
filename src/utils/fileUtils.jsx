import {
  FileText,
  FileImage,
  File,
  Presentation,
  FileArchive,
  Sheet,
} from "lucide-react"

export const getFileDisplay = (fileName) => {
  if (!fileName || typeof fileName !== "string") {
    return {
      icon: (
        <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
      ),
      text: "FILE",
    }
  }
  const parts = fileName.split(".")
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : ""
  switch (ext) {
    case "pdf":
      return {
        icon: (
          <FileText className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-red-600 group-hover/file:scale-110" />
        ),
        text: "PDF",
      }
    case "docx":
    case "doc":
      return {
        icon: (
          <FileText className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-blue-600 group-hover/file:scale-110" />
        ),
        text: ext.toUpperCase(),
      }
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return {
        icon: (
          <FileImage className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-green-600 group-hover/file:scale-110" />
        ),
        text: ext.toUpperCase(),
      }
    case "ppt":
    case "pptx":
      return {
        icon: (
          <Presentation className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-orange-600 group-hover/file:scale-110" />
        ),
        text: "PPTX",
      }
    case "txt":
      return {
        icon: (
          <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
        ),
        text: "TXT",
      }
    case "xlsx":
    case "xls":
      return {
        icon: (
          <Sheet className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-emerald-600 group-hover/file:scale-110" />
        ),
        text: "XLSX",
      }
    case "zip":
    case "rar":
      return {
        icon: (
          <FileArchive className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-purple-600 group-hover/file:scale-110" />
        ),
        text: ext.toUpperCase(),
      }
    default:
      return {
        icon: (
          <File className="w-8 h-8 text-gray-600 transition-all duration-300 sm:w-10 sm:h-10 group-hover/file:text-gray-800 group-hover/file:scale-110" />
        ),
        text: ext ? ext.toUpperCase() : "FILE",
      }
  }
} 