// src/api/apiService/userService.js

import api from './axiosInstance';


// =================================================================
// --- SERVICE FUNCTIONS ---
// =================================================================

// --- Authentication ---

/**
 * Logs in a user.
 * @param {object} credentials - { email, password }
 */
export const loginUser = (credentials) => api.post('/api/users/login/', credentials);

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data from the form.
 */
export const registerUser = (userData) => {
  // This function maps the camelCase frontend field names
  // to the snake_case names expected by the Django backend.
  const formattedData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    username: userData.username,
    email: userData.email,
    student_id: userData.studentId,
    password: userData.password,
    password2: userData.confirmPassword, // Assumes your form has 'confirmPassword'
    department: userData.department, // Assuming department ID is passed
    batch: userData.batch,
    section: userData.section,
  };
  return api.post('/api/users/register/', formattedData);
};


// --- User Profile & Data ---
/**
 * Fetches the profile of the currently logged-in user.
 */
export const getUserProfile = () => api.get('/api/users/profile/');

/**
 * Updates the profile of the currently logged-in user.
 * @param {object} userData - The user data to update.
 */
export const updateUserProfile = (userData) => api.patch('/api/users/profile/', userData);


// --- General App Data (Departments, Courses, etc.) ---
/**
 * Fetches all departments.
 */
export const getDepartments = () => api.get('/api/departments/');

/**
 * Fetches courses, optionally filtered by department.
 * @param {string|number} [departmentId] - Optional ID of the department to filter courses.
 */
export const getCourses = (departmentId) => {
    return api.get('/api/courses/', {
        params: departmentId ? { department: departmentId } : {}
    });
};

/**
 * Fetches all note categories.
 */
export const getNoteCategories = () => api.get('/api/categories/');


// --- Note & User Activity ---
/**
 * Fetches the notes uploaded by the current user.
 * @param {object} [params] - Optional query parameters for filtering, pagination, etc.
 */
export const getMyNotes = (params) => api.get('/api/notes/my-notes/', { params });

/**
 * Fetches the notes bookmarked by the current user.
 * @param {object} [params] - Optional query parameters for filtering, pagination, etc.
 */
export const getBookmarkedNotes = (params) => api.get('/api/users/user-activity/bookmarked-notes/', { params });

/**
 * Toggles the like status for a specific note.
 * @param {string|number} noteId - The ID of the note to like/unlike.
 */
export const toggleLikeNote = (noteId) => {
    if (!noteId) return Promise.reject(new Error("Note ID is required to toggle like."));
    return api.post(`/api/notes/${noteId}/toggle-like/`);
};

/**
 * Toggles the bookmark status for a specific note.
 * @param {string|number} noteId - The ID of the note to bookmark/unbookmark.
 */
export const toggleBookmarkNote = (noteId) => {
    if (!noteId) return Promise.reject(new Error("Note ID is required to toggle bookmark."));
    return api.post(`/api/notes/${noteId}/toggle-bookmark/`);
};

/**
 * Gets a specific note by ID.
 * @param {string|number} noteId - The ID of the note to fetch.
 */
export const getNoteById = (noteId) => {
  if (!noteId) return Promise.reject(new Error("Note ID is required."));
  return api.get(`/api/notes/${noteId}/`);
};

/**
 * Downloads the file for a specific note.
 * @param {string|number} noteId - The ID of the note to download.
 */
export const downloadNote = async (noteId) => {
  if (!noteId) {
    throw new Error("Note ID is required to download.");
  }

  try {
    const response = await api.get(`/api/notes/${noteId}/download/`, {
      responseType: 'blob', // Important: we expect binary data
    });

    // Get filename from 'Content-Disposition' header
    const disposition = response.headers['content-disposition'];
    let filename = 'download'; // Default filename
    if (disposition && disposition.includes('filename=')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };

  } catch (error) {
    console.error('Download error:', error);

    // --- উন্নত এরর হ্যান্ডলিং ---
    if (error.response) {
      const status = error.response.status;
      // Try to parse error message from blob if it exists
      if (error.response.data instanceof Blob) {
        try {
          const errorJson = JSON.parse(await error.response.data.text());
          throw new Error(errorJson.detail || `Server error: ${status}`);
        } catch (e) {
          // Fallback if parsing fails
          throw new Error(`Failed to download file. Server responded with status ${status}.`);
        }
      }
      throw new Error(error.response.data?.detail || `Request failed with status ${status}`);
    } else {
      throw new Error(error.message || 'An unknown error occurred during download.');
    }
  }
};


// Export the configured axios instance for advanced use cases if needed
export default api;