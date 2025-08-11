"use client" 

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { getNoteById, downloadNote, toggleLikeNote, toggleBookmarkNote } from "../../api/apiService/userService";
import NoteDetailsHeader from "../../components/notes/NoteDetailsHeader"; 
import NoteDetailsActions from "../../components/notes/NoteDetailsActions"; 
import NoteFilePreview from "../../components/notes/NoteFilePreview"; 
import NoteComments from "../../components/notes/NoteComments"; 
import Spinner from "../../components/ui/Spinner";
import { FileText, AlertCircle, Download, Loader2, Heart, Bookmark, MessageCircle, Star, Calendar, User, Building, GraduationCap, RefreshCw, Share2 } from "lucide-react"; // প্রয়োজনীয় সব আইকন ইম্পোর্ট করা হয়েছে

const NoteDetailsPage = () => {
  const { noteId } = useParams(); 
  const navigate = useNavigate(); 
  const { isAuthenticated, user } = useAuth(); 

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);


  useEffect(() => {
    const fetchNoteDetails = async () => {
      if (!noteId) {
        setError("Note ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); 
        setError(null); 
        const response = await getNoteById(noteId); 
        const noteData = response.data || response; 

        setNote(noteData);

      
        setIsLiked(noteData.is_liked_by_current_user || false);
        setLikesCount(noteData.likes_count || 0); 
        setIsBookmarked(noteData.is_bookmarked_by_current_user || false); 
        setBookmarksCount(noteData.bookmarks_count || 0); 
        setDownloadCount(noteData.download_count || 0); 

      } catch (err) {
        console.error("Error fetching note details:", err);
        let errorMessage = "Failed to load note details.";
        if (err.response) {
          const status = err.response.status;
          if (status === 404) errorMessage = "Note not found."; 
          else if (status === 403) errorMessage = "You don't have permission to view this note."; 
          else errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage; 
        } else if (err.message) {
          errorMessage = err.message; 
        }
        setError(errorMessage); 
        toast.error(errorMessage); 
      } finally {
        setLoading(false); 
      }
    };

    fetchNoteDetails();
  }, [noteId]); 




  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like notes."); 
      return;
    }

    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;


    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await toggleLikeNote(noteId); 
      const updatedData = response.data || response; 

      setIsLiked(updatedData.liked !== undefined ? updatedData.liked : !isLiked);
      setLikesCount(updatedData.likes_count !== undefined ? updatedData.likes_count : likesCount);

      setNote((prevNote) => ({
        ...prevNote,
        is_liked_by_current_user: updatedData.liked !== undefined ? updatedData.liked : !isLiked,
        likes_count: updatedData.likes_count !== undefined ? updatedData.likes_count : likesCount,
      }));
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      console.error("Failed to toggle like:", error);
      toast.error(error.message || "Failed to update like status.");
    }
  };


  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark notes."); 
      return;
    }

    const originalIsBookmarked = isBookmarked; 
    const originalBookmarksCount = bookmarksCount;


    setIsBookmarked(!isBookmarked);
    setBookmarksCount((prev) => (isBookmarked ? prev - 1 : prev + 1));

    try {
      const response = await toggleBookmarkNote(noteId); 
      const updatedData = response.data || response; 

      setIsBookmarked(updatedData.bookmarked !== undefined ? updatedData.bookmarked : !isBookmarked);
      setBookmarksCount(updatedData.bookmarks_count !== undefined ? updatedData.bookmarks_count : bookmarksCount);

   
      setNote((prevNote) => ({
        ...prevNote,
        is_bookmarked_by_current_user: updatedData.bookmarked !== undefined ? updatedData.bookmarked : !isBookmarked,
        bookmarks_count: updatedData.bookmarks_count !== undefined ? updatedData.bookmarks_count : bookmarksCount,
      }));
    } catch (error) {
      setIsBookmarked(originalIsBookmarked);
      setBookmarksCount(originalBookmarksCount);
      console.error("Failed to toggle bookmark:", error);
      toast.error(error.message || "Failed to update bookmark status.");
    }
  };

  // ডাউনলোড করার ফাংশন
  const handleDownload = async () => {
    if (!noteId) {
      toast.error("Cannot download: Note ID is missing."); 
      return;
    }
    try {
      toast.info(`Preparing download for "${note?.file_name || 'file'}"...`); 
      await downloadNote(noteId); 
      setDownloadCount((prev) => prev + 1);
      setNote((prevNote) => ({
        ...prevNote,
        download_count: (prevNote?.download_count || 0) + 1, 
      }));

      toast.success(`Download for "${note?.file_name || 'file'}" started!`); 
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(error.message || "Failed to download the note."); 
    }
  };


  const handleBackToNotes = () => {
    navigate("/notes"); 
  };




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="p-8 text-center rounded-3xl border shadow-2xl backdrop-blur-sm bg-white/80 border-slate-200/50">
          <Loader2 className="mx-auto mb-4 w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-6 text-xl font-semibold text-slate-700">Loading note details...</p>
          <p className="text-slate-500">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }


  if (error || !note) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="p-8 mx-auto max-w-md text-center">
          <div className="p-12 rounded-3xl border shadow-2xl backdrop-blur-sm bg-white/90 border-slate-200/50">
            <div className="flex justify-center items-center p-6 mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-800">Note Not Found</h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              {error || "The note you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={handleBackToNotes} 
              className="px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={handleBackToNotes}
          className="flex gap-3 items-center px-6 py-3 mb-8 font-bold text-blue-700 rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 bg-white/80 border-blue-200/50 hover:bg-blue-50 hover:shadow-xl hover:scale-105 group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Notes</span>
        </button>

        {/* Note Details Card */}
        <div className="overflow-hidden gap-8 mb-8 rounded-3xl border shadow-2xl backdrop-blur-sm transition-all duration-500 bg-white/90 border-slate-200/50 hover:shadow-3xl">
          {/* Note Header */}
          <NoteDetailsHeader note={note} />

          {/* File Preview Section */}
          <div className="p-8">
            <NoteFilePreview note={note} />
          </div>

          {/* Action Buttons and Stats */}
          <NoteDetailsActions
            note={note}
            isLiked={isLiked}
            likesCount={likesCount}
            isBookmarked={isBookmarked}
            bookmarksCount={bookmarksCount}
            downloadCount={downloadCount}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onDownload={handleDownload}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-12"> 
          <NoteComments
            noteId={noteId}
            initialAverageRating={note.average_rating}
            noteDetail={note}
          />
        </div>
      </div>
    </div>
  );
}

export default NoteDetailsPage;