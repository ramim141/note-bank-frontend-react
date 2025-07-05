// src/api/apiService/requestNoteService.js

import { fetchWrapper } from '../../utils/fetchWrapper'; // Fixed import path

export const createNoteRequest = async (requestData) => {
  try {

    const response = await fetchWrapper.post('/api/notes/note-requests/', requestData);
    return response;
  } catch (error) {
    console.error('Error creating note request:', error);

    throw error;
  }
};


export const getUserNoteRequests = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: 1, 
      ...params,
    });
 
    const response = await fetchWrapper.get(`/api/note-requests/?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching user note requests:', error);
    throw error;
  }
};


