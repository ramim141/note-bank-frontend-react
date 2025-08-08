// src/pages/Notes/PublicNoteRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { publicNoteRequestService } from '../../api/apiService/publicNoteRequestService';
import NoteRequestCard from '../../components/notes/NoteRequestCard';
import FulfillRequestModal from '../../components/notes/FulfillRequestModal';
import { FaSpinner } from 'react-icons/fa';

const PublicNoteRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); 

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await publicNoteRequestService.getPublicNoteRequests({ status: 'PENDING' });
        
        // Add proper null checks and error handling
        if (response && response.data) {
          // Handle different possible response structures
          const requestsData = response.data.results || response.data || [];
          setRequests(Array.isArray(requestsData) ? requestsData : []);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching note requests:', error);
        toast.error('Failed to fetch note requests.');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleOpenFulfillModal = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseFulfillModal = () => {
    setSelectedRequest(null);
  };

  const handleRequestFulfilled = (updatedRequest) => {
    setRequests(prevRequests =>
      prevRequests.filter(req => req.id !== updatedRequest.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="text-4xl text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-32 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Community Note Requests</h1>
          <p className="mt-4 text-lg text-gray-600">Help your peers by fulfilling their note requests.</p>
        </div>

        {requests && requests.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {requests.map(request => (
              <NoteRequestCard key={request.id} request={request} onFulfill={handleOpenFulfillModal} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">No pending note requests at the moment. Great job, community!</p>
          </div>
        )}
      </div>

      {selectedRequest && (
        <FulfillRequestModal
          request={selectedRequest}
          onClose={handleCloseFulfillModal}
          onFulfilled={handleRequestFulfilled}
        />
      )}
    </div>
  );
};

export default PublicNoteRequestsPage;