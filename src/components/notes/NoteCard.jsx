// src/components/notes/NoteCard.jsx
"use client" // If using Next.js or similar, otherwise remove

import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Download, FileText, Star, FileImage, File, Presentation, User, Building, Tag, Edit, CloudUpload, CheckCircle } from 'lucide-react'; // Icons from lucide-react
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate if needed for navigation
import { useAuth } from '../../context/useAuth'; // Import useAuth hook

// --- Constants for Styling ---
const ICON_SIZE = 20; // Icon size in pixels
const ICON_CLASS = `w-${ICON_SIZE / 4} h-${ICON_SIZE / 4}`; // Tailwind units (4px per unit)

const NoteCard = ({ note, onClick }) => {
  // Initialize state based on the incoming 'note' prop's boolean flags
  const [isLiked, setIsLiked] = useState(note?.is_liked_by_current_user || false);
  const [isBookmarked, setIsBookmarked] = useState(note?.is_bookmarked_by_current_user || false);

  const navigate = useNavigate(); // For navigation

  // Effect to update local state if the incoming 'note' prop changes
  useEffect(() => {
    setIsLiked(note?.is_liked_by_current_user || false);
    setIsBookmarked(note?.is_bookmarked_by_current_user || false);
  }, [note?.is_liked_by_current_user, note?.is_bookmarked_by_current_user]);

  // Safely extract a string value from a field. Handles objects, strings, and null/undefined.
  const getStringValue = (field, fallback = "") => {
    if (!field) return fallback;
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      if (field.name) return field.name;
      if (field.title) return field.title;
      if (field.username) return field.username;
      // If it's an object but doesn't match expected patterns, convert to string with a warning
      console.warn("getStringValue: Encountered unexpected object structure for a simple field:", field);
      return String(field);
    }
    return String(field);
  };

  // Safely get uploader details
  const uploaderName =
    note?.uploader_first_name && note?.uploader_last_name
      ? `${note.uploader_first_name} ${note.uploader_last_name}`
      : note?.uploader_username || "Anonymous";
  const uploaderInitial = uploaderName.charAt(0).toUpperCase() || 'U'; // Use the combined name for initial

  // Determine file icon, background, border, and text based on file extension
  const getFileDisplay = (fileName) => {
    if (!fileName) {
      return { icon: <File className={`text-gray-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-200', text: 'FILE' };
    }

    const actualFileName = fileName.split("/").pop()?.split("\\").pop();
    if (!actualFileName) return { icon: <File className={`text-gray-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-200', text: 'FILE' };
    const ext = actualFileName.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf": return { icon: <FileText className={`text-red-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-red-100 to-red-200', border: 'border-red-200', text: 'PDF' };
      case "docx": return { icon: <FileText className={`text-blue-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-blue-100 to-blue-200', border: 'border-blue-200', text: 'DOCX' };
      case "doc": return { icon: <FileText className={`text-blue-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-blue-100 to-blue-200', border: 'border-blue-200', text: 'DOC' };
      case "jpg": case "jpeg": case "png": case "gif":
        return { icon: <FileImage className={`text-green-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-green-100 to-green-200', border: 'border-green-200', text: ext.toUpperCase() };
      case "ppt":
        return { icon: <Presentation className={`text-orange-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-orange-100 to-orange-200', border: 'border-orange-200', text: 'PPT' };
      case "pptx":
        return { icon: <Presentation className={`text-orange-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-orange-100 to-orange-200', border: 'border-orange-200', text: 'PPTX' };
      case "txt":
        return { icon: <File className={`text-gray-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-200', text: 'TXT' };
      case "xlsx":
      case "xls":
        return { icon: <FileText className={`text-green-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-green-100 to-green-200', border: 'border-green-200', text: ext.toUpperCase() };
      default:
        return { icon: <File className={`text-gray-600 ${ICON_CLASS}`} />, bg: 'bg-gradient-to-br from-gray-100 to-gray-200', border: 'border-gray-200', text: 'FILE' };
    }
  };

  // Safely get displayable values from note prop
  const courseName = getStringValue(note?.course_name || note?.course);
  const departmentName = getStringValue(note?.department_name || note?.uploader_department);
  const categoryName = getStringValue(note?.category_name || note?.category);
  const semesterName = getStringValue(note?.semester);
  const fileName = note?.file || note?.file_name || note?.original_filename || note?.filename; // Safely get filename for icon

  const fileDisplay = getFileDisplay(fileName);

  // Handlers for user interactions (Like, Bookmark, Download)
  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsLiked((prev) => !prev);
    console.log(`Toggling like for note ${note?.id}: ${!isLiked}`);
    // TODO: Call API to like/unlike the note
  };

  const handleBookmarkToggle = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsBookmarked((prev) => !prev);
    console.log(`Toggling bookmark for note ${note?.id}: ${!isBookmarked}`);
    // TODO: Call API to bookmark/unbookmark the note
  };

  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (note?.file_url) {
      // Open download URL in a new tab
      window.open(note.file_url, "_blank");
    } else {
      console.warn(`No file_url available for download for note ${note?.id}`);
      toast.warn("Download link not available.");
    }
    console.log(`Initiating download for note ${note?.id}`);
  };

  const handleCardClick = () => {
    if (note?.id) {
      navigate(`/notes/${note.id}`); // Navigate to note details page
    } else {
      console.warn("Cannot navigate: Note ID is missing.");
    }
  };

  return (
    <div
      className="flex flex-col p-4 w-full max-w-none rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer bg-white/70 border-white/30 hover:shadow-xl hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left side: File Type Display */}
        <div className="flex flex-shrink-0 justify-center items-center">
          <div className={`w-16 h-20 rounded-xl ${fileDisplay.bg} flex flex-col items-center justify-center border-2 ${fileDisplay.border} shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105`}>
            {fileDisplay.icon}
            <span className="mt-1 text-xs font-semibold text-gray-700">{fileDisplay.text}</span>
          </div>
        </div>

        {/* Right side: Content Details */}
        <div className="flex-grow space-y-2 min-w-0 sm:space-y-3">
          {/* Title and Course Tag */}
          <div className="flex gap-2 justify-between items-start sm:gap-3">
            <h3 className="flex-1 text-base font-semibold leading-tight text-gray-800 sm:text-lg line-clamp-2">
              {note?.title || "Untitled Note"}
            </h3>
            {courseName && (
              <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm">
                {courseName}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">{note?.description || 'No description provided.'}</p>

          {/* Uploader and Department Info */}
          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 sm:gap-3 sm:text-sm">
            <div className="flex gap-1 items-center sm:gap-2">
              <User className={`text-gray-400 ${ICON_CLASS}`} />
              <span className="font-medium truncate">{uploaderName}</span>
            </div>
            {departmentName && (
              <>
                <span className="hidden text-gray-300 sm:inline">•</span>
                <div className="flex gap-1 items-center">
                  <Building className={`text-gray-400 ${ICON_CLASS}`} />
                  <span className="truncate">{departmentName}</span>
                </div>
              </>
            )}
          </div>

          {/* Average Star Rating */}
          {note?.average_star_rating !== undefined && note.average_star_rating !== null && (
            <div className="flex gap-2 items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
                      star <= Math.round(note.average_star_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600 sm:text-sm">
                {typeof note.average_star_rating === "number" ? note.average_star_rating.toFixed(1) : note.average_star_rating}
                {` (${note.star_ratings_count || 0})`}
              </span>
            </div>
          )}

          {/* Semester Tag */}
          {semesterName && (
            <div className="flex flex-wrap gap-2 items-center text-sm sm:gap-3">
              <span className="px-2 py-1 text-xs text-orange-700 bg-gradient-to-r from-orange-100 to-amber-100 rounded-md border border-orange-200 sm:text-sm">
                {semesterName}
              </span>
            </div>
          )}

          {/* Tags */}
          {note?.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mt-2 text-xs text-gray-500">
              {note.tags.map((tag, index) => (
                <span key={index} className="flex items-center px-2 py-1 text-cyan-800 bg-cyan-100 rounded-md">
                  <Tag className="mr-1 w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions: Likes, Downloads */}
      <div className="flex justify-between items-center pt-3 mt-4 border-t border-gray-100 sm:pt-4 sm:mt-4">
        {/* Stats Display */}
        <div className="flex gap-3 items-center text-xs text-gray-500 sm:gap-6 sm:text-sm">
          <span className="flex gap-1 items-center font-medium sm:gap-2">
            <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isBookmarked ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
            <span className="hidden sm:inline">{note?.bookmarks_count || 0}</span>
          </span>
          <span className="flex gap-1 items-center font-medium sm:gap-2">
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${isLiked ? "text-red-500 scale-110 fill-current" : "text-red-500"}`} />
            <span className="hidden sm:inline">{note?.likes_count || 0}</span>
          </span>
          <span className="flex gap-1 items-center font-medium sm:gap-2">
            <Download className={`w-3 h-3 text-green-500 sm:w-4 sm:h-4`} />
            <span className="hidden sm:inline">{note?.download_count || 0}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 items-center sm:gap-2">
          <button
            onClick={handleLikeToggle}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 ${isLiked ? "text-red-600 bg-red-100 shadow-md" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${isLiked ? "scale-110 fill-current" : ""}`} />
          </button>
          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 ${isBookmarked ? "text-yellow-600 bg-yellow-100 shadow-md" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${isBookmarked ? "scale-110 fill-current" : ""}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 sm:p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md transition-all duration-200 transform hover:from-blue-600 hover:to-indigo-700 hover:scale-110 active:scale-95 hover:shadow-lg"
            title="Download"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;