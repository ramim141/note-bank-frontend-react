// src/api/apiService/noteService.js

const API_BASE_URL = "http://127.0.0.1:8000";
export const noteService = {
    uploadNote,
    getMyNotes,
    getNotes,
    getAllNotes,
};


async function getNotes(params = {}, token = null) {
  // Create a new URLSearchParams object and remove any empty values
  const validParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const query = new URLSearchParams(validParams).toString();
  const url = `${API_BASE_URL}/api/notes/?${query}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    let errorData = { message: `HTTP error! status: ${response.status}` };
    try {
      // Try to parse the error response as JSON
      errorData = await response.json();
    } catch {
      // Fallback to text if it's not JSON
      errorData.message = await response.text();
    }
    throw errorData;
  }
  
  // Return the parsed JSON response
  return await response.json();
}

async function getMyNotes(token) {
    const response = await fetch(`${API_BASE_URL}/api/notes/my-notes/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw errorData;
    }

    return await response.json();
}

async function uploadNote(formData, token) {
    const response = await fetch(`${API_BASE_URL}/api/notes/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    // We need to read the response body once, either as JSON or text
    // Let's try to read it as JSON first, then fall back to text if it fails.

    let responseData = null;
    let responseError = null;

    try {
        // Attempt to parse response as JSON
        responseData = await response.json();
    } catch {
        // If parsing as JSON fails, try reading as text
        try {
            const textResponse = await response.text();
            responseError = { message: textResponse || `HTTP error! status: ${response.status}` };
        } catch {
            responseError = { message: `HTTP error! status: ${response.status}` };
        }
    }

    if (!response.ok) {
        // If response status is not OK (e.g., 4xx or 5xx)
        // responseData might contain error details if it was JSON
        // Otherwise, use the text error we captured
        throw responseData || responseError;
    }

    // If response is OK and parsing was successful
    return responseData;
}

async function getAllNotes(token) {
    const response = await fetch(`${API_BASE_URL}/api/notes/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw errorData;
    }

    return await response.json();
}
