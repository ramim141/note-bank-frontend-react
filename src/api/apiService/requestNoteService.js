// src/api/apiService/requestNoteService.js

import { fetchWrapper } from '../../utils/fetchWrapper'; // Fixed import path

/**
 * Submits a new note request to the backend.
 *
 * @param {object} requestData - The data for the note request.
 * @param {string} requestData.course_name - The name of the course.
 * @param {string} requestData.department_name - The name of the department.
 * @param {string} requestData.message - The message detailing the note request.
 * @returns {Promise<object>} - A promise that resolves with the API response.
 * @throws {Error} - Throws an error if the API request fails.
 */
export const createNoteRequest = async (requestData) => {
  try {
    // Let fetchWrapper handle the base URL construction
    const response = await fetchWrapper.post('/api/notes/note-requests/', requestData);
    return response; // fetchWrapper already returns the parsed JSON
  } catch (error) {
    console.error('Error creating note request:', error);
    // Re-throw the error to be caught by the calling component (e.g., RequestNoteSection)
    throw error;
  }
};

/**
 * Fetches a paginated list of note requests made by the current user.
 *
 * @param {object} [params={}] - Optional query parameters for pagination or filtering.
 * @param {number} [params.page=1] - The page number to fetch.
 * @returns {Promise<object>} - A promise that resolves with the paginated list of requests.
 * @throws {Error} - Throws an error if the API request fails.
 */
export const getUserNoteRequests = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: 1, // Default to page 1 if not provided
      ...params,
    });
    // Let fetchWrapper handle the base URL construction
    const response = await fetchWrapper.get(`/api/notes/note-requests/?${queryParams}`);
    return response; // fetchWrapper already returns the parsed JSON
  } catch (error) {
    console.error('Error fetching user note requests:', error);
    throw error;
  }
};

// You could add more functions here if there are other endpoints related to note requests,
// such as getting a specific request, updating its status (if admin functionality is added), etc.