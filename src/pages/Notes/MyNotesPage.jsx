// src/pages/Notes/MyNotesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth'; // Import useAuth
import ProtectedRoute from '../../routes/ProtectedRoute'; // Import ProtectedRoute
import NoteCard from '../../components/notes/NoteCard'; // Fixed import path
import { noteService } from '../../api/apiService/noteService'; // Fixed import path
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

const MyNotesPage = () => {
  const { token, logout } = useAuth(); // Get token and logout function
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyNotes = async () => {
      if (!token) {
        // If no token, it means user is not logged in, ProtectedRoute should handle this
        // But for safety, we can add a check here too.
        setError("You are not authenticated.");
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const data = await noteService.getMyNotes(token);
        setNotes(data.results || data); // API might return {results: [...]} or just [...]
        setLoading(false);
      } catch (err) {
        console.error("Error fetching my notes:", err);
        let errorMessage = "Failed to fetch your notes.";
        
        // Handle specific token validation errors
        if (err.code === 'token_not_valid' || err.detail?.includes('token not valid')) {
          errorMessage = "Your session has expired. Please login again.";
          // Clear the invalid token and redirect to login
          logout();
          navigate('/login');
        } else if (err.status === 401) {
          errorMessage = "You are not authenticated. Please login.";
          logout();
          navigate('/login');
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.detail) {
          errorMessage = err.detail;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        
        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchMyNotes();
  }, [token, navigate, logout]); // Dependency on token, navigate, and logout

  return (
    <ProtectedRoute>
      <div className="px-4 py-8 mx-auto max-w-7xl md:px-8 lg:px-12 mt-16">
        <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 text-center">My Uploaded Notes</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-purple-500" />
            <span className="text-xl ml-3 text-gray-600">Loading your notes...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl">Error: {error}</div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={() => console.log('Note clicked:', note.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p className="text-xl font-medium mb-3">No notes uploaded yet!</p>
            <p>Upload your first note to get started.</p>
            <button
              onClick={() => navigate('/upload-note')}
              className="mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
            >
              Upload Your First Note
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MyNotesPage;