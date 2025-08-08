// src/api/apiService/requestNoteService.js

import { fetchWrapper } from '../../utils/fetchWrapper'; // Fixed import path

export const createNoteRequest = async (requestData) => {
  try {
    // Use the correct endpoint for creating note requests
    const response = await fetchWrapper.post('/api/requests/my-note-requests/', requestData);
    return response;
  } catch (error) {
    console.error('Error creating note request:', error);
    throw error;
  }
};

export const testCreateNoteRequest = async (requestData) => {
  try {
    // Use the test endpoint for debugging
    const response = await fetchWrapper.post('/api/requests/test-note-request/', requestData);
    return response;
  } catch (error) {
    console.error('Error creating note request (test):', error);
    throw error;
  }
};

export const getUserNoteRequests = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: 1, 
      ...params,
    });
 
    // Use the correct endpoint for getting user note requests
    const response = await fetchWrapper.get(`/api/requests/my-note-requests/?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching user note requests:', error);
    throw error;
  }
};

export const getPublicNoteRequests = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: 1, 
      ...params,
    });
 
    // Use the correct endpoint for getting public note requests
    const response = await fetchWrapper.get(`/api/notes/public-note-requests/?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching public note requests:', error);
    throw error;
  }
};


