// src/components/notes/NoteComments.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, Calendar, Trash2, Edit, Loader2, AlertCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/useAuth'; // Adjust path as per your project structure
import { toast } from 'react-toastify';
import api from '../../api/apiService/axiosInstance'; // axiosInstance import

const NoteComments = ({ noteId, initialAverageRating, noteDetail }) => { // Added noteDetail prop
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  // Removed loadingComments, as comments are now part of noteDetail
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null); // For displaying API errors

  // --- Star Rating State ---
  const [selectedRating, setSelectedRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  // --- Add new state and handler logic at the top of the component ---
  const [userHasCommented, setUserHasCommented] = useState(false);

  // --- Initialize Comments and User Rating from noteDetail prop ---
  useEffect(() => {
    if (noteDetail) {
      // Set comments directly from the note detail
      setComments(noteDetail.comments || []);

      // Determine user's existing rating from the embedded star_ratings
      if (user && noteDetail.star_ratings) {
        const usersExistingRating = noteDetail.star_ratings.find(rating => rating.user === user.id); // Assuming comment.user is user ID
        if (usersExistingRating) {
          setUserRating(usersExistingRating.stars);
          setSelectedRating(usersExistingRating.stars); // Pre-select their existing rating
        }
      }

      // Check if the user has already commented
      if (user && noteDetail.comments) {
        setUserHasCommented(noteDetail.comments.some(c => c.user === user.id || c.user_id === user.id));
      }
    }
  }, [noteDetail, user]); // Re-run if noteDetail or user changes

  // --- Handle Star Rating Click ---
  const handleStarClick = (starValue) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this note.');
      return;
    }
    if (ratingLoading) return; // Prevent clicks while submitting
    setSelectedRating(starValue);
  };

  // --- Handle Submit Rating ---
  const handleRateSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this note.');
      return;
    }
    if (selectedRating === null) {
      toast.error('Please select a rating.');
      return;
    }

    setRatingLoading(true);
    setError(null); // Clear previous errors
    try {
      // Use POST to create a new rating. If the user already rated, the backend should handle it (e.g., throw an error we catch).
      await api.post('/api/star-ratings/', {
        note: noteId,
        stars: selectedRating,
      });

      setUserRating(selectedRating); // Update user's rating state locally
      toast.success(`You rated this note ${selectedRating} stars!`);
      // NOTE: The average_rating is from the prop 'initialAverageRating'.
      // If you need the average rating to update dynamically after a new rating,
      // you would need to re-fetch the note details or have a mechanism to update it.
    } catch (err) {
      console.error('Error submitting rating:', err);
      let errorMessage = 'Failed to submit rating. Please try again.';
      if (err.response && err.response.data) {
        if (err.response.data.detail === "You have already rated this note. You can update your existing rating by sending a PUT/PATCH request to its ID.") {
             toast.info("You have already rated this note. To change your rating, you might need to delete and re-rate or use an update feature if available.");
             // For now, we'll just inform the user.
        } else {
             errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setRatingLoading(false);
    }
  };

  // --- Format Date ---
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
          return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  }, []);

  // --- Start Editing Comment ---
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
    setEditRating(comment.stars || null);
  };

  // --- Cancel Editing ---
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
    setEditRating(null);
  };

  // --- Handle Update Comment ---
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim() || !editRating) {
      toast.error('Both comment and rating are required.');
      return;
    }
    setSubmittingComment(true);
    try {
      // Update comment
      await api.patch(`/api/comments/${commentId}/`, { text: editText.trim() });

      // Find the user's rating for this note
      const userRating = noteDetail.star_ratings.find(r => r.user === user.id);
      if (userRating) {
        await api.patch(`/api/star-ratings/${userRating.id}/`, { stars: editRating });
      }

      // Refresh comments and ratings
      const getResponse = await api.get(`/api/notes/${noteId}/`);
      setComments(getResponse.data.comments || []);
      cancelEditing();
      toast.success('Comment and rating updated!');
    } catch (err) {
      console.error('Error updating comment and rating:', err);
      let errorMessage = 'Failed to update comment and rating. Please try again.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  // --- Handle Delete Comment ---
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment and your rating?')) {
      return;
    }

    setSubmittingComment(true);
    try {
      // Delete the comment
      await api.delete(`/api/comments/${commentId}/`);

      // Try to delete the user's rating for this note
      try {
        await api.delete(`/api/star-ratings/`, { data: { note: noteId } });
      } catch (ratingErr) {
        // It's ok if the rating doesn't exist or can't be deleted
        console.warn('Rating delete error (may be expected):', ratingErr);
      }

      // Refresh comments and ratings
      const getResponse = await api.get(`/api/notes/${noteId}/`);
      setComments(getResponse.data.comments || []);
      setUserHasCommented(false);
      toast.success('Comment and rating deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment and rating:', err);
      let errorMessage = 'Failed to delete comment and rating. Please try again.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  // --- Render Function for Stars ---
  const renderStars = (ratingValue, isUserRatingDisplay = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-7 h-7 cursor-pointer transition-colors duration-300 ${
            // Determine star color:
            // 1. If it's the user's own submitted rating (userRating is set)
            // 2. OR if it's the currently selected rating (selectedRating) for input
            // 3. AND the current star number (i) is less than or equal to the relevant rating value
            (userRating && i <= userRating) || (!userRating && selectedRating && i <= selectedRating)
              ? 'fill-yellow-400 stroke-yellow-400' // Active star
              : 'fill-gray-300 stroke-gray-300' // Inactive star
          }`}
          onClick={() => !isUserRatingDisplay && !userRating && !ratingLoading && handleStarClick(i)} // Only allow clicking for input, not for display
          onMouseEnter={() => !isUserRatingDisplay && !userRating && !ratingLoading && setSelectedRating(i)} // Preview on hover (only if not already rated)
          onMouseLeave={() => !isUserRatingDisplay && !userRating && !ratingLoading && setSelectedRating(null)} // Reset on leave
        />
      );
    }
    return stars;
  };

  // --- Add the combined submit handler ---
  const handleCombinedSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRating || !newComment.trim()) {
      toast.error('Please provide both a rating and a comment.');
      return;
    }
    setSubmittingComment(true);
    try {
      // Submit comment
      await api.post('/api/comments/', { note: noteId, text: newComment.trim() });
      // Submit rating
      await api.post('/api/star-ratings/', { note: noteId, stars: selectedRating });
      // Refresh comments and ratings
      const getResponse = await api.get(`/api/notes/${noteId}/`);
      setComments(getResponse.data.comments || []);
      setUserHasCommented(true);
      setNewComment('');
      setSelectedRating(null);
      toast.success('Comment and rating submitted!');
    } catch (err) {
      console.error('Error submitting comment and rating:', err);
      let errorMessage = 'Failed to submit comment and rating. Please try again.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  // --- Add new state for editRating at the top of the component ---
  const [editRating, setEditRating] = useState(null);

  return (
    <div className="mb-32 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <MessageCircle className="w-6 h-6" />
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form Section */}
      <div className="p-6 border-b border-gray-200">
        {isAuthenticated ? (
          userHasCommented ? (
            <div className="p-4 text-center border border-gray-200 bg-gray-50 rounded-xl">
              <p className="mb-3 text-gray-600">You have already commented and rated this note.</p>
            </div>
          ) : (
            <form onSubmit={handleCombinedSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-700">Your Rating:</span>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className={`w-7 h-7 cursor-pointer transition-colors duration-300 ${selectedRating && star <= selectedRating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-300 stroke-gray-300'}`}
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setSelectedRating(star)}
                      onMouseLeave={() => setSelectedRating(selectedRating)}
                    />
                  ))}
                </div>
                {selectedRating && <span className="ml-2 font-bold text-blue-600">{selectedRating} star{selectedRating > 1 ? 's' : ''}</span>}
              </div>
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this note..."
                  className="w-full p-4 transition-all duration-300 border border-gray-300 shadow-sm resize-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  disabled={submittingComment}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim() || !selectedRating}
                  className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition-all duration-300 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <Loader2 className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submittingComment ? 'Posting...' : 'Submit'}
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="p-4 text-center border border-gray-200 bg-gray-50 rounded-xl">
            <p className="mb-3 text-gray-600">Please log in to leave a comment and rating.</p>
            <button
              onClick={() => { window.location.href = '/login'; }}
              className="px-6 py-2 font-semibold text-white transition-colors duration-300 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700"
            >
              Log In
            </button>
          </div>
        )}
      </div>

      {/* Comments List Section */}
      <div className="p-6">
   
        {error ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-5 transition-shadow duration-300 border border-gray-200 shadow-sm rounded-xl hover:shadow-md hover:border-gray-300">
                {editingCommentId === comment.id ? (
                  // --- Editing View ---
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Edit Rating:</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${editRating && star <= editRating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-300 stroke-gray-300'}`}
                            onClick={() => setEditRating(star)}
                            onMouseEnter={() => setEditRating(star)}
                            onMouseLeave={() => setEditRating(editRating)}
                          />
                        ))}
                      </div>
                      {editRating && <span className="ml-2 font-bold text-blue-600">{editRating} star{editRating > 1 ? 's' : ''}</span>}
                    </div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      disabled={submittingComment}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={submittingComment || !editText.trim() || !editRating}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {submittingComment ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={submittingComment}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- Display View ---
                  <>
                    <div className="flex items-start justify-between mb-3">
                      {/* Commenter Info */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full shadow bg-gradient-to-r from-blue-500 to-purple-500">
                          {comment.user_first_name?.[0] || comment.user_username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.user_first_name && comment.user_last_name
                              ? `${comment.user_first_name} ${comment.user_last_name}`
                              : comment.user_username || 'Anonymous'}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      {/* Edit/Delete Buttons (Owner only) */}
                      {comment.is_owner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(comment)}
                            className="flex items-center gap-1 p-1 text-gray-500 transition-colors duration-300 hover:text-blue-600"
                            title="Edit comment"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="flex items-center gap-1 p-1 text-gray-500 transition-colors duration-300 hover:text-red-600"
                            title="Delete comment"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Comment Text */}
                    <p className="leading-relaxed text-gray-700">{comment.text}</p>
                    {typeof comment.stars === 'number' && (
                      <div className="flex items-center mt-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= comment.stars ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-300 stroke-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-500">{comment.stars} / 5</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteComments;