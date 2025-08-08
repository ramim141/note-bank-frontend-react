import api from './axiosInstance';

const getPublicNoteRequests = (params = {}) => {
  return api.get('/api/public-note-requests/', { params });
};

const fulfillNoteRequest = (requestId, noteFormData) => {
  return api.post(`/api/public-note-requests/${requestId}/fulfill/`, noteFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const publicNoteRequestService = {
  getPublicNoteRequests,
  fulfillNoteRequest,
};