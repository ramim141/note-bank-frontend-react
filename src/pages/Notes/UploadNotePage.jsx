// src/pages/Notes/UploadNotePage.jsx
import React from 'react';
import NoteForm from '../../components/notes/NoteForm';
import ProtectedRoute from '../../routes/ProtectedRoute'; // Import ProtectedRoute

const UploadNotePage = () => {
  return (
    <ProtectedRoute> {/* Protect this page */}
      <div className="container mx-auto px-4 py-8">
        <NoteForm />
      </div>
    </ProtectedRoute>
  );
};

export default UploadNotePage;