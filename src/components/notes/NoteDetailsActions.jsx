"use client"
import { useState, useEffect } from "react" 
import { Heart, Bookmark, Download, Share2, MessageCircle, Star, RefreshCw, FileText, AlertCircle, Loader2 } from "lucide-react" 
import { toast } from "react-toastify" 

const NoteDetailsActions = ({
  note,
  isLiked,
  likesCount,
  isBookmarked,
  bookmarksCount,
  downloadCount,
  onLikeToggle,
  onBookmarkToggle,
  onDownload,
}) => {

  const [isSharing, setIsSharing] = useState(false)


  const roundedRating = note?.average_rating ? Math.round(note.average_rating * 10) / 10 : 0 
  const totalRatings = note?.star_ratings ? note.star_ratings.length : 0
  // Handle share functionality
  const handleShare = async () => {
    if (!note || !note.id) {
      toast.error("Cannot share: Note ID is missing.")
      return
    }
    if (navigator.share) {
      setIsSharing(true)
      try {
        await navigator.share({
          title: note?.title || "Note from NoteBank",
          text: `Check out this note: "${note?.title || 'note'}"`,
          url: window.location.href,
        })
        toast.success("Note shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
        toast.error("Failed to share note.")
      } finally {
        setIsSharing(false)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        console.error("Failed to copy link:", error)
        toast.error("Failed to copy link.")
      }
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br border-t border-slate-200/50 from-slate-50/80 via-blue-50/30 to-purple-50/30">
      <div className="flex flex-col gap-8 justify-between items-center xl:flex-row">
        {/* Stats and Rating */}
        <div className="flex flex-wrap gap-6 justify-center items-center xl:justify-start">
          {/* Rating */}
          <div className="flex gap-4 items-center p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 border-slate-200/50">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 transition-all duration-300 ${
                    star <= roundedRating
                      ? "text-yellow-400 fill-current drop-shadow-sm"
                      : "text-slate-300 hover:text-yellow-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800">
                {note?.average_rating ? note.average_rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-slate-500">({totalRatings} ratings)</span>
            </div>
          </div>

          {/* Other Stats */}
          <div className="flex flex-wrap gap-6 justify-center xl:justify-start text-slate-600">
            <div className="flex gap-2 items-center p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border-slate-200/50 group">
              <Download className="w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">{downloadCount}</span>
              <span className="hidden sm:inline">Downloads</span>
            </div>
            <div className="flex gap-2 items-center p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border-slate-200/50 group">
              <MessageCircle className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">{note?.comments?.length || 0}</span>
              <span className="hidden sm:inline">Reviews</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center xl:justify-end">
          {/* Like Button */}
          <button
            onClick={onLikeToggle}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group ${
              isLiked
                ? "text-red-600 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200"
                : "border-2 bg-white/80 text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked
                  ? "text-red-500 animate-pulse fill-current group-hover:text-red-600"
                  : "group-hover:text-red-500 group-hover:scale-110"
              }`}
            />
            <span className="hidden sm:inline">{likesCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onBookmarkToggle}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group ${
              isBookmarked
                ? "text-yellow-600 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-200"
                : "border-2 bg-white/80 text-slate-600 border-slate-200 hover:border-yellow-200 hover:text-yellow-500"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 transition-all duration-300 ${
                isBookmarked
                  ? "text-yellow-500 animate-pulse fill-current group-hover:text-yellow-600"
                  : "group-hover:text-yellow-500 group-hover:scale-110"
              }`}
            />
            <span className="hidden sm:inline">{bookmarksCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex gap-3 items-center px-6 py-3 font-bold bg-gradient-to-r rounded-2xl border-2 shadow-lg transition-all duration-300 from-slate-100 to-slate-200 text-slate-700 border-slate-200 hover:from-slate-200 hover:to-slate-300 hover:scale-105 hover:shadow-xl active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="flex gap-3 items-center px-8 py-3 font-bold text-white bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl shadow-xl transition-all duration-300 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl active:scale-95 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="pt-6 mt-8 border-t border-slate-200/50">
        <div className="flex flex-wrap gap-4 justify-center text-sm xl:justify-start">
          <div className="flex gap-2 items-center px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 border-slate-200/50">
            <span className="font-semibold text-slate-600">File:</span>
            <span className="font-bold text-slate-800 truncate max-w-[200px]">{note?.file_name || "N/A"}</span>
          </div>
          <div className="flex gap-2 items-center px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 border-slate-200/50">
            <span className="font-semibold text-slate-600">Size:</span>
            <span className="font-bold text-slate-800">
              {note?.file_size ? `${(note.file_size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
            </span>
          </div>
          <div className="flex gap-2 items-center px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 0 border-slate-200/50">
            <span className="font-semibold text-slate-600">Type:</span>
            <span className="font-bold text-slate-800">
              {note?.file_name ? note.file_name.split(".").pop()?.toUpperCase() || "N/A" : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailsActions