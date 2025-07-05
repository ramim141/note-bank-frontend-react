// src/utils/fetchWrapper.js

// API_BASE_URL environment variable থেকে বা ডিফল্ট URL ব্যবহার করে
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Internal request handler function
async function request(url, options) {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('authToken');

    // Set default headers for the request
    const headers = {
        'Content-Type': 'application/json', // Default to JSON content type
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization header if token exists
        ...options?.headers, // Allow overriding default headers from options
    };

    try {
        // Make the request using the browser's fetch API
        const response = await fetch(url, { ...options, headers }); // Merge options and headers

        // Handle non-successful HTTP responses (e.g., 4xx or 5xx status codes)
        if (!response.ok) {
            let errorData = { message: `HTTP error! status: ${response.status}` }; // Default error message
            try {
                const jsonResponse = await response.json(); // Try to parse JSON error response
                errorData = jsonResponse; // Use backend's JSON error response
            } catch (e) {
                // If response is not JSON, use the plain text error
                errorData.message = await response.text();
            }
            throw errorData; // Throw an error object with more details
        }

        // Handle 204 No Content response specifically
        if (response.status === 204) {
            return null; // Return null for responses with no content
        }

        // Parse and return JSON response for successful requests
        return await response.json();
    } catch (error) {
        // Handle specific network errors (e.g., "Failed to fetch" due to no connection)
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw {
                message: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
                isNetworkError: true // Add a flag to identify network errors
            };
        }
        // Re-throw any other errors (including the ones thrown from !response.ok block)
        throw error;
    }
}

// Object containing wrapper functions for common HTTP methods
const fetchWrapper = {
    // GET request wrapper
    get: (url, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'GET' }),
    
    // POST request wrapper
    post: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
    // PUT request wrapper
    put: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
    // PATCH request wrapper
    patch: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    
    // DELETE request wrapper
    delete: (url, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'DELETE' }),
};

export { fetchWrapper }; // Export the fetchWrapper object