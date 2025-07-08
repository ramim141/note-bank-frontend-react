"use client" // এই ডিরেক্টিভটি দরকার যদি আপনি Next.js ব্যবহার করেন এবং এটি ক্লায়েন্ট কম্পোনেন্ট হয়। React App-এর জন্য এটি বাদ দেওয়া যেতে পারে।

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // react-router-dom v6 ধরে নেওয়া হয়েছে
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { getNoteById, downloadNote, toggleLikeNote, toggleBookmarkNote } from "../../api/apiService/userService"; // প্রয়োজনীয় সার্ভিস ফাংশন ইম্পোর্ট করা হয়েছে
import NoteDetailsHeader from "../../components/notes/NoteDetailsHeader"; // নোটের হেডার কম্পোনেন্ট
import NoteDetailsActions from "../../components/notes/NoteDetailsActions"; // নোটের অ্যাকশন বাটন কম্পোনেন্ট
import NoteFilePreview from "../../components/notes/NoteFilePreview"; // নোটের ফাইল প্রিভিউ কম্পোনেন্ট
import NoteComments from "../../components/notes/NoteComments"; // কমেন্ট এবং রেটিং কম্পোনেন্ট
import Spinner from "../../components/ui/Spinner"; // লোডিং স্পিনার
import { FileText, AlertCircle, Download, Loader2, Heart, Bookmark, MessageCircle, Star, Calendar, User, Building, GraduationCap, RefreshCw, Share2 } from "lucide-react"; // প্রয়োজনীয় সব আইকন ইম্পোর্ট করা হয়েছে

const NoteDetailsPage = () => {
  const { noteId } = useParams(); // URL থেকে নোটের আইডি পাওয়া হচ্ছে
  const navigate = useNavigate(); // নেভিগেশনের জন্য
  const { isAuthenticated, user } = useAuth(); // Authentication এবং ব্যবহারকারীর তথ্য পাওয়া হচ্ছে

  const [note, setNote] = useState(null); // নোটের বিস্তারিত তথ্য রাখার জন্য স্টেট
  const [loading, setLoading] = useState(true); // নোট লোডিং হচ্ছে কিনা তা জানার জন্য স্টেট
  const [error, setError] = useState(null); // কোনো এরর হলে তা রাখার জন্য স্টেট

  // লাইক, বুকমার্ক, ডাউনলোড এবং কমেন্টের জন্য স্টেট
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  // কমেন্টের সংখ্যা যদি এখানে দেখাতে চান, তাহলে NoteComments থেকে পাস করতে হবে অথবা আলাদাভাবে ফেচ করতে হবে।

  // নোটের বিস্তারিত তথ্য লোড করার জন্য useEffect
  useEffect(() => {
    const fetchNoteDetails = async () => {
      // যদি noteId না থাকে তাহলে এরর দেখানো হচ্ছে
      if (!noteId) {
        setError("Note ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // লোডিং শুরু
        setError(null); // আগের এরর মুছে ফেলা হচ্ছে
        const response = await getNoteById(noteId); // API কল করে নোটের তথ্য আনা হচ্ছে
        const noteData = response.data || response; // API থেকে পাওয়া ডেটা সেট করা হচ্ছে

        setNote(noteData); // নোটের তথ্য স্টেট-এ সেট করা হচ্ছে

        // ইন্টারেকশন স্টেটগুলো ফেচ করা ডেটা দিয়ে ইনিশিয়ালাইজ করা হচ্ছে
        setIsLiked(noteData.is_liked_by_current_user || false); // লাইক স্টেট
        setLikesCount(noteData.likes_count || 0); // লাইকের সংখ্যা
        setIsBookmarked(noteData.is_bookmarked_by_current_user || false); // বুকমার্ক স্টেট
        setBookmarksCount(noteData.bookmarks_count || 0); // বুকমার্কের সংখ্যা
        setDownloadCount(noteData.download_count || 0); // ডাউনলোডের সংখ্যা

      } catch (err) {
        console.error("Error fetching note details:", err);
        let errorMessage = "Failed to load note details.";
        if (err.response) {
          const status = err.response.status;
          if (status === 404) errorMessage = "Note not found."; // 404 এরর
          else if (status === 403) errorMessage = "You don't have permission to view this note."; // 403 এরর
          else errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage; // অন্যান্য এরর
        } else if (err.message) {
          errorMessage = err.message; // নেটওয়ার্ক এরর ইত্যাদি
        }
        setError(errorMessage); // এরর স্টেট সেট করা হচ্ছে
        toast.error(errorMessage); // টোস্ট নোটিফিকেশন দেখানো হচ্ছে
      } finally {
        setLoading(false); // লোডিং শেষ
      }
    };

    fetchNoteDetails();
  }, [noteId]); // noteId পরিবর্তন হলে আবার ফেচ করা হবে

  // --- অ্যাকশন হ্যান্ডলার ফাংশন ---

  // লাইক টগল করার ফাংশন
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like notes."); // লগইন না থাকলে এরর
      return;
    }

    const originalIsLiked = isLiked; // অপটিমিস্টিক আপডেটের জন্য আগের ভ্যালু সেভ করা হচ্ছে
    const originalLikesCount = likesCount;

    // অপটিমিস্টিক আপডেট - ইউজার এক্সপেরিয়েন্স ভালো করার জন্য
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await toggleLikeNote(noteId); // API কল করা হচ্ছে
      const updatedData = response.data || response; // রেসপন্স ডেটা নেওয়া হচ্ছে

      // রেসপন্স থেকে স্টেট আপডেট করা হচ্ছে
      setIsLiked(updatedData.liked !== undefined ? updatedData.liked : !isLiked);
      setLikesCount(updatedData.likes_count !== undefined ? updatedData.likes_count : likesCount);

      // প্রধান নোট অবজেক্ট আপডেট করা হচ্ছে যদি অন্য কোথাও এর প্রয়োজন হয়
      setNote((prevNote) => ({
        ...prevNote,
        is_liked_by_current_user: updatedData.liked !== undefined ? updatedData.liked : !isLiked,
        likes_count: updatedData.likes_count !== undefined ? updatedData.likes_count : likesCount,
      }));
    } catch (error) {
      // এরর হলে অপটিমিস্টিক আপডেট রিভার্ট করা হচ্ছে
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      console.error("Failed to toggle like:", error);
      toast.error(error.message || "Failed to update like status.");
    }
  };

  // বুকমার্ক টগল করার ফাংশন
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark notes."); // লগইন না থাকলে এরর
      return;
    }

    const originalIsBookmarked = isBookmarked; // অপটিমিস্টিক আপডেটের জন্য আগের ভ্যালু সেভ করা হচ্ছে
    const originalBookmarksCount = bookmarksCount;

    // অপটিমিস্টিক আপডেট
    setIsBookmarked(!isBookmarked);
    setBookmarksCount((prev) => (isBookmarked ? prev - 1 : prev + 1));

    try {
      const response = await toggleBookmarkNote(noteId); // API কল করা হচ্ছে
      const updatedData = response.data || response; // রেসপন্স ডেটা নেওয়া হচ্ছে

      setIsBookmarked(updatedData.bookmarked !== undefined ? updatedData.bookmarked : !isBookmarked);
      setBookmarksCount(updatedData.bookmarks_count !== undefined ? updatedData.bookmarks_count : bookmarksCount);

      // প্রধান নোট অবজেক্ট আপডেট করা হচ্ছে
      setNote((prevNote) => ({
        ...prevNote,
        is_bookmarked_by_current_user: updatedData.bookmarked !== undefined ? updatedData.bookmarked : !isBookmarked,
        bookmarks_count: updatedData.bookmarks_count !== undefined ? updatedData.bookmarks_count : bookmarksCount,
      }));
    } catch (error) {
      // এরর হলে অপটিমিস্টিক আপডেট রিভার্ট করা হচ্ছে
      setIsBookmarked(originalIsBookmarked);
      setBookmarksCount(originalBookmarksCount);
      console.error("Failed to toggle bookmark:", error);
      toast.error(error.message || "Failed to update bookmark status.");
    }
  };

  // ডাউনলোড করার ফাংশন
  const handleDownload = async () => {
    if (!noteId) {
      toast.error("Cannot download: Note ID is missing."); // নোট আইডি না থাকলে এরর
      return;
    }
    try {
      toast.info(`Preparing download for "${note?.file_name || 'file'}"...`); // ডাউনলোড শুরু হওয়ার বার্তা
      await downloadNote(noteId); // ডাউনলোড ফাংশন কল করা হচ্ছে, যা Blob ডাউনলোড এবং সেভ হ্যান্ডেল করে

      // অপটিমিস্টিক আপডেট - ডাউনলোড সংখ্যা স্থানীয়ভাবে আপডেট করা হচ্ছে
      setDownloadCount((prev) => prev + 1);
      setNote((prevNote) => ({
        ...prevNote,
        download_count: (prevNote?.download_count || 0) + 1, // ডাউনলোডের সংখ্যা আপডেট করা হচ্ছে
      }));

      toast.success(`Download for "${note?.file_name || 'file'}" started!`); // ডাউনলোড সফল হওয়ার বার্তা
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(error.message || "Failed to download the note."); // ডাউনলোড ব্যর্থ হওয়ার বার্তা
    }
  };

  // নোটের লিস্টে ফেরত যাওয়ার ফাংশন
  const handleBackToNotes = () => {
    navigate("/notes"); // নোটের লিস্ট পেজে নেভিগেট করা হচ্ছে
  };

  // --- রেন্ডার লজিক ---

  // লোডিং স্টেট
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

  // এরর বা "Not Found" স্টেট
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
              onClick={handleBackToNotes} // নোটের লিস্টে ফেরত যাওয়ার বাটন
              className="px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // মূল কন্টেন্ট রেন্ডার
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
        <div className="mt-12"> {/* কমেন্ট সেকশনের জন্য অতিরিক্ত মার্জিন টপ */}
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