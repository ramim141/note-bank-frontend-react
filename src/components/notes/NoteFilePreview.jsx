"use client"

import { useState, useEffect } from "react"
import {
  Download,
  FileText, // Generic icon for file
  AlertCircle,
} from "lucide-react"
import { downloadNote } from "../../api/apiService/userService"
import { getFileType } from "../../api/apiService/filePreviewService" // Only need getFileType for context
import filePreviewService from "../../api/apiService/filePreviewService"; // Import filePreviewService for direct file URL
import { toast } from "react-toastify"
import api from "../../api/apiService/axiosInstance"; // Import api for content fetching

const NoteFilePreview = ({ note }) => {
  const [fileType, setFileType] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false); // Added loading state for content fetching
  const [previewUrl, setPreviewUrl] = useState(null); // State to hold fetched content URL

  useEffect(() => {
    if (note?.file_name) {
      const detectedFileType = getFileType(note.file_name);
      setFileType(detectedFileType);
      if (detectedFileType === 'text' || detectedFileType === 'code') {
        fetchFileContentForPreview(note.id); // Fetch content if text or code
      } else if (detectedFileType === 'pdf') {
        // For PDF, we need the direct URL. Assuming backend provides it via get-file-url endpoint
        fetchDirectFileUrl(note.id);
      } else if (detectedFileType === 'image') {
        // For image, we also need the direct URL
        fetchDirectFileUrl(note.id);
      } else if (['document', 'spreadsheet', 'presentation'].includes(detectedFileType)) {

        setError("Preview not available. Download to view.");
      } else {
        setError("Preview not available for this file type.");
      }
    } else {
      setFileType(null)
      setError("No file associated with this note.")
    }
  }, [note])

  const fetchFileContentForPreview = async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/notes/${noteId}/content/`);
      if (response.data && response.data.content) {
        setPreviewUrl(`data:text/plain;base64,${btoa(response.data.content)}`);
      } else {
        throw new Error("Could not fetch file content.");
      }
    } catch (err) {
      console.error("Error fetching text/code file content:", err);
      let errorMessage = "Failed to load file content for preview.";
      if (err.response) errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectFileUrl = async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const { directFileUrl } = await filePreviewService.getDirectFileUrl(noteId);
      if (!directFileUrl) {
        throw new Error("Could not obtain a direct file URL.");
      }
      setPreviewUrl(directFileUrl);
    } catch (err) {
      console.error("Error fetching direct file URL:", err);
      let errorMessage = "Failed to get file preview URL.";
      if (err.response) errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage;
      // setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = async () => {
    if (!note || !note.id) {
      toast.error("Cannot download: Note ID is missing.")
      return
    }
    try {
      toast.info(`Preparing download for ${note.file_name || "file"}...`)
      await downloadNote(note.id)
      toast.success(`Download for "${note.file_name || "file"}" started!`)
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "Failed to download the file.")
    }
  }

  // Generic icon component
  const getIconComponent = () => {
    return <FileText className="w-8 h-8 transition-all duration-300 text-slate-500 group-hover:text-blue-500" />
  }

  // Renders the content for preview or download prompt
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <p className="mb-2 text-lg font-medium text-gray-600">{error}</p>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            Download to View
          </button>
        </div>
      )
    }

    // If no file or preview not supported, show download prompt
    if (!note?.id || !previewUrl || !['pdf', 'image', 'text', 'code'].includes(fileType)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <Download className="w-16 h-16 mb-4 text-blue-500 animate-bounce" />
          <h2 className="mb-2 text-2xl font-bold text-gray-700">Download to Preview</h2>
          <p className="mb-4 text-gray-500 text-md">
            Preview is not available for this file type.
          </p>
          <button
            onClick={handleDownload}
            className="px-6 py-3 text-lg font-semibold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            Download File
          </button>
        </div>
      )
    }

    // Render actual preview
    switch (fileType) {
      case "pdf":
        return (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="PDF Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onError={() => setError("Failed to load PDF preview.")}
          />
        )

      case "image":
        return (
          <div className="flex items-center justify-center h-full p-4 overflow-hidden">
            <img
              src={previewUrl}
              alt="File Preview"
              className="object-contain max-w-full max-h-full"
              onError={() => setError("Failed to load image")}
            />
          </div>
        )

      case "text":
      case "code":
        return (
          <div className="h-full p-4 overflow-auto">
            <pre className="font-mono text-sm text-gray-800 break-words whitespace-pre-wrap">
              {previewUrl && previewUrl.startsWith("data:text/plain;base64,")
                ? atob(previewUrl.split(",")[1])
                : "Loading content..."}
            </pre>
          </div>
        )

      default:
        // Fallback for any other supported types not explicitly handled
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Download className="w-16 h-16 mb-4 text-blue-500 animate-bounce" />
            <h2 className="mb-2 text-2xl font-bold text-gray-700">Download to Preview</h2>
            <p className="mb-4 text-gray-500 text-md">
              Preview is not available for this file type.
            </p>
            <button
              onClick={handleDownload}
              className="px-6 py-3 text-lg font-semibold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            >
              Download File
            </button>
          </div>
        )
    }
  }

  return (
    <div className="overflow-hidden transition-all duration-500 border bg-gradient-to-br from-white rounded-2xl backdrop-blur-sm to-slate-50 via-blue-50/30 border-slate-200/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-6 border-b bg-gradient-to-r backdrop-blur-sm sm:flex-nowrap from-slate-50/80 via-blue-50/50 to-purple-50/50 border-slate-200/60">
        <div className="flex items-center flex-1 min-w-0 gap-3 mr-4"> {/* flex-1 to allow shrinking */}
          <div className="p-2 transition-all duration-300 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl hover:bg-gradient-to-br">
            {getIconComponent()}
          </div>
          <h3
            className="text-lg font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] transition-colors duration-300 hover:text-blue-700"
            title={note?.file_name || "Unknown File"}
          >
           Note Preview
          </h3>
        </div>
        {/* Only show download button if there's a file and note ID */}
        {note?.id && (
          <button
            onClick={handleDownload}
            className="items-center flex-shrink-0 gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 active:scale-95 group"
            title="Download file"
          >
            <Download className="w-4 h-4 group-hover:animate-pulse" />
            <span className="hidden">Download</span>
          </button>
        )}
      </div>

      {/* Preview Area */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[720px] bg-gradient-to-br from-slate-100/50 via-blue-50/30 to-purple-50/30 flex justify-center items-center p-6 text-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default NoteFilePreview