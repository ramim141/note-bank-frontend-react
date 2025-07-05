import React from 'react';
import { Heart, Bookmark, Download, Share2, MessageCircle, Star } from 'lucide-react';

const NoteDetailsActions = ({
  note,
  isLiked,
  likesCount,
  isBookmarked,
  bookmarksCount,
  downloadCount,
  onLikeToggle,
  onBookmarkToggle,
  onDownload
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note?.title || 'Note from NoteBank',
          text: note?.description || 'Check out this note!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You might want to show a toast notification here
        console.log('Link copied to clipboard');
      } catch (error) {
        console.log('Failed to copy link:', error);
      }
    }
  };

  const roundedRating = note?.average_rating ? Math.round(note.average_rating) : 0;

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Stats and Rating */}
        <div className="flex flex-wrap gap-6 items-center">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= roundedRating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 font-medium">
              {note?.average_rating ? note.average_rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-gray-500 text-sm">
              ({note?.total_ratings || 0} ratings)
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {downloadCount} downloads
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {note?.comments?.length || 0} comments
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Like Button */}
          <button
            onClick={onLikeToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: isLiked ? '#fef2f2' : '#f8fafc',
              color: isLiked ? '#dc2626' : '#64748b'
            }}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked
                  ? "fill-current text-red-500 group-hover:text-red-600"
                  : "group-hover:text-red-500"
              }`}
            />
            <span className="font-medium">{likesCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onBookmarkToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: isBookmarked ? '#fefce8' : '#f8fafc',
              color: isBookmarked ? '#ca8a04' : '#64748b'
            }}
          >
            <Bookmark
              className={`w-5 h-5 transition-all duration-300 ${
                isBookmarked
                  ? "fill-current text-yellow-500 group-hover:text-yellow-600"
                  : "group-hover:text-yellow-500"
              }`}
            />
            <span className="font-medium">{bookmarksCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl transition-all duration-300 hover:bg-gray-200 hover:scale-105 group"
          >
            <Share2 className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
            <span className="font-medium">Share</span>
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-700 hover:scale-105 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>File: {note?.file_name || 'N/A'}</span>
          <span>Size: {note?.file_size ? `${(note.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
          <span>Type: {note?.file_name ? note.file_name.split('.').pop().toUpperCase() : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsActions; 