import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Calendar, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { toast } from 'react-toastify';

const NoteComments = ({ noteId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  // Mock comments data - replace with actual API call
  useEffect(() => {
    // Simulate loading comments
    setLoading(true);
    setTimeout(() => {
      setComments([
        {
          id: 1,
          text: "This is a very helpful note! Thanks for sharing.",
          user: {
            username: "john_doe",
            first_name: "John",
            last_name: "Doe"
          },
          created_at: "2024-01-15T10:30:00Z",
          is_owner: false
        },
        {
          id: 2,
          text: "Great content, exactly what I was looking for.",
          user: {
            username: "jane_smith",
            first_name: "Jane",
            last_name: "Smith"
          },
          created_at: "2024-01-14T15:45:00Z",
          is_owner: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [noteId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommentObj = {
        id: Date.now(),
        text: newComment.trim(),
        user: {
          username: user?.username || 'user',
          first_name: user?.first_name || 'User',
          last_name: user?.last_name || 'Name'
        },
        created_at: new Date().toISOString(),
        is_owner: true
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Please enter a comment.');
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: editText.trim() }
          : comment
      ));
      
      setEditingComment(null);
      setEditText('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  return (
    <div className="overflow-hidden mb-32 bg-white rounded-3xl shadow-xl">
      {/* Header */}
      <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="flex gap-2 items-center text-2xl font-bold">
          <MessageCircle className="w-6 h-6" />
          Reviews ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated && (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this note..."
                className="p-4 w-full rounded-xl border border-gray-300 transition-all duration-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                disabled={submitting}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex gap-2 items-center px-6 py-2 font-semibold text-white bg-blue-600 rounded-xl transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="p-6">
        {loading ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 w-8 h-8 rounded-full border-4 border-blue-600 animate-spin border-t-transparent" />
            <p className="text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageCircle className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl border border-gray-200 transition-shadow duration-300 hover:shadow-md">
                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="p-3 w-full rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className="flex justify-center items-center w-10 h-10 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                          {comment.user.first_name?.[0] || comment.user.username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.user.first_name && comment.user.last_name
                              ? `${comment.user.first_name} ${comment.user.last_name}`
                              : comment.user.username}
                          </p>
                          <p className="flex gap-1 items-center text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      {comment.is_owner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(comment)}
                            className="p-1 text-gray-500 transition-colors duration-300 hover:text-blue-600"
                            title="Edit comment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 text-gray-500 transition-colors duration-300 hover:text-red-600"
                            title="Delete comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="leading-relaxed text-gray-700">{comment.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="p-6 text-center bg-gray-50 border-t border-gray-200">
          <p className="mb-3 text-gray-600">
            Please log in to leave a comment.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-xl transition-colors duration-300 hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteComments; 