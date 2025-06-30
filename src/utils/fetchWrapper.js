// src/utils/fetchWrapper.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(url, options) {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add auth header if token exists
        ...options?.headers, // Allow overriding headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        // Try to parse error response from backend
        let errorData = { message: `HTTP error! status: ${response.status}` };
        try {
            const jsonResponse = await response.json();
            errorData = jsonResponse;
        } catch (e) {
            // If response is not JSON, use the plain text error
            errorData.message = await response.text();
        }
        throw errorData; // Throw an error object with more details
    }

    return await response.json();
}

const fetchWrapper = {
    get: (url, options) => request(`${API_BASE_URL}${url}`, { ...options, method: 'GET' }),
    post: (url, body, options) => request(`${API_BASE_URL}${url}`, { ...options, method: 'POST', body: JSON.stringify(body) }),
    // Add put, delete etc. if needed later
};

export { fetchWrapper };