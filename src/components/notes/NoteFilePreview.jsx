"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  Star,
  Download,
  MessageCircle,
  Heart,
  Bookmark,
  Share2,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { downloadNote } from "../../api/apiService/userService"
import { getFileType, supportsPreview } from "../../api/apiService/filePreviewService"
import CodePreview from "./CodePreview"
import { toast } from "react-toastify"

const NoteFilePreview = ({ note }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(6)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [previewLoaded, setPreviewLoaded] = useState(false)

  useEffect(() => {
    if (note?.file_name) {
      const detectedFileType = getFileType(note.file_name)
      setFileType(detectedFileType)
      loadPreview(detectedFileType)
    }
  }, [note])

  const loadPreview = async (type) => {
    if (!supportsPreview(type)) {
      setError("Preview not available for this file type")
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (type === "pdf") {
        // For PDF, use a PDF viewer or embed
        setPreviewUrl(
          "https://mozilla.github.io/pdf.js/web/viewer.html?file=https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        )
      } else if (type === "image") {
        setPreviewUrl("https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Image+Preview")
      } else if (type === "text" || type === "code") {
        const sampleContent =
          type === "code"
            ? `// Sample ${type} content\nfunction helloWorld() {\n    console.log("Hello, World!");\n    return "This is a sample code file";\n}\n\nconst example = {\n    language: "JavaScript",\n    framework: "React"\n};`
            : "This is a sample text file content.\n\nYou can preview text files here.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit."
        setPreviewUrl("data:text/plain;base64," + btoa(sampleContent))
      } else {
        setError("Preview not available for this file type")
      }
      setPreviewLoaded(true)
    } catch (err) {
      console.error("Error loading preview:", err)
      setError("Failed to load file preview")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      toast.info("Preparing download...")
      await downloadNote(note.id)
      toast.success("Download started!")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "Failed to download the file.")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note?.title || "Note from NoteBank",
          text: note?.description || "Check out this note!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 w-12 h-12 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Download to View
            </button>
          </div>
        </div>
      )
    }

    if (!previewLoaded || !previewUrl) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <FileText className="mx-auto mb-2 w-12 h-12 text-gray-400" />
            <p className="text-sm text-gray-600">Click to load preview</p>
          </div>
        </div>
      )
    }

    // Render based on file type
    switch (fileType) {
      case "pdf":
        return <iframe src={previewUrl} className="w-full h-full border-0" title="PDF Preview" />

      case "image":
        return (
          <div className="flex justify-center items-center p-4 h-full">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="File Preview"
              className="object-contain max-w-full max-h-full"
              onError={() => setError("Failed to load image")}
            />
          </div>
        )

      case "text":
        return (
          <div className="overflow-auto p-4 h-full">
            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {previewUrl && previewUrl.startsWith("data:text/plain;base64,")
                ? atob(previewUrl.split(",")[1])
                : "Loading content..."}
            </pre>
          </div>
        )

      case "code":
        return (
          <div className="h-full">
            <CodePreview
              content={
                previewUrl && previewUrl.startsWith("data:text/plain;base64,")
                  ? atob(previewUrl.split(",")[1])
                  : "Loading code..."
              }
              fileName={note?.file_name}
            />
          </div>
        )

      default:
        return (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <FileText className="mx-auto mb-2 w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-600">Preview not available</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 mt-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Download File
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h3 className="text-lg font-medium text-gray-800">Note Preview</h3>
      </div>

      {/* Preview Area - Now shows actual file content */}
      <div className="relative h-[720px] bg-gray-50">{renderPreviewContent()}</div>

     
    </div>
  )
}

export default NoteFilePreview
