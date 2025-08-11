// src/components/notes/FulfillRequestModal.jsx
import React from 'react';
import { toast } from 'react-toastify';
import NoteForm from './NoteForm';
import { publicNoteRequestService } from '../../api/apiService/publicNoteRequestService';

const FulfillRequestModal = ({ request, onClose, onFulfilled }) => {
  const handleFulfillSubmit = async (formDataToSend) => {
    try {
      const response = await publicNoteRequestService.fulfillNoteRequest(request.id, formDataToSend);
      toast.success('Request fulfilled successfully!');
      onFulfilled(response.data.note_request); 
      onClose();
    } catch (error) {
      console.error('Fulfillment error:', error);
      toast.error(error.response?.data?.detail || 'Failed to fulfill request.');
      throw error; 
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-500">&times;</button>
        <div className="p-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Fulfill Request For:</h2>
          <p className="mb-6 text-lg text-violet-600">{request.course_name}</p>
          <NoteForm
            initialData={{
              title: `Notes for ${request.course_name}`,
            }}
            onUploadSuccess={handleFulfillSubmit}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FulfillRequestModal;