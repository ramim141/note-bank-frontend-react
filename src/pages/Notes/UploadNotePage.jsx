// src/pages/Notes/UploadNotePage.jsx
import React from 'react';
import NoteForm from '../../components/notes/NoteForm';
import ProtectedRoute from '../../routes/ProtectedRoute'; // Import ProtectedRoute

const UploadNotePage = () => {
  return (
    <ProtectedRoute> {/* Protect this page */}
      <div className="mx-auto">
        <NoteForm />
      </div>
    </ProtectedRoute>
  );
};

export default UploadNotePage;