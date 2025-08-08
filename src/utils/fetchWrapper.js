// src/utils/fetchWrapper.js

// API_BASE_URL environment variable থেকে বা ডিফল্ট URL ব্যবহার করে
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Internal request handler function
async function request(url, options) {
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });

        const isNoContent = response.status === 204;
        const responseText = isNoContent ? '' : await response.text();
        let parsedBody = null;
        try {
            parsedBody = responseText ? JSON.parse(responseText) : null;
        } catch (_) {
            parsedBody = responseText || null;
        }

        if (!response.ok) {
            const errorData = typeof parsedBody === 'object' && parsedBody !== null
                ? parsedBody
                : { message: parsedBody || `HTTP error! status: ${response.status}` };
            errorData.status = response.status;
            throw errorData;
        }

        return parsedBody;
    } catch (error) {
        if (error.name === 'TypeError' && String(error.message || '').includes('Failed to fetch')) {
            throw {
                message: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
                isNetworkError: true
            };
        }
        throw error;
    }
}

const fetchWrapper = {
    get: (url, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'GET' }),
    post: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: (url, body, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url, options = {}) => request(`${API_BASE_URL}${url}`, { ...options, method: 'DELETE' }),
};

export { fetchWrapper };