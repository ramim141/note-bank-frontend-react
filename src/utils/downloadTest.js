// src/utils/downloadTest.js
// Utility to test download endpoints and help debug download issues

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Test different download endpoints to see which ones work
 */
export async function testDownloadEndpoints(noteId) {
  const accessToken = localStorage.getItem('authToken');
  const results = {
    noteId,
    timestamp: new Date().toISOString(),
    endpoints: {}
  };

  const endpoints = [
    `/api/notes/${noteId}/download/`,
    `/api/notes/${noteId}/file/`,
    `/api/notes/${noteId}/download-file/`,
    `/api/notes/${noteId}/secure-download-url/`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      results.endpoints[endpoint] = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: response.headers.get('content-type'),
        contentDisposition: response.headers.get('content-disposition'),
      };

      if (response.ok) {
        // Try to read the response to see if it's JSON or binary
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const jsonData = await response.json();
            results.endpoints[endpoint].data = jsonData;
          } catch (e) {
            results.endpoints[endpoint].jsonError = e.message;
          }
        } else {
          // It's likely a binary file
          const blob = await response.blob();
          results.endpoints[endpoint].fileSize = blob.size;
          results.endpoints[endpoint].fileType = blob.type;
        }
      } else {
        // Try to get error details
        try {
          const errorData = await response.text();
          results.endpoints[endpoint].errorData = errorData;
        } catch (e) {
          results.endpoints[endpoint].errorReadError = e.message;
        }
      }
    } catch (error) {
      results.endpoints[endpoint] = {
        error: error.message,
        type: error.name,
      };
    }
  }

  console.log('Download endpoint test results:', results);
  return results;
}

/**
 * Test note verification
 */
export async function testNoteVerification(noteId) {
  const accessToken = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const noteData = await response.json();
      console.log('Note verification successful:', noteData);
      return {
        success: true,
        note: noteData,
        hasFile: !!noteData.file_name,
        fileName: noteData.file_name,
      };
    } else {
      const errorData = await response.text();
      console.log('Note verification failed:', {
        status: response.status,
        error: errorData
      });
      return {
        success: false,
        status: response.status,
        error: errorData
      };
    }
  } catch (error) {
    console.log('Note verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Comprehensive download test
 */
export async function comprehensiveDownloadTest(noteId) {
  console.log(`Starting comprehensive download test for note ${noteId}`);
  
  // First verify the note exists
  const verification = await testNoteVerification(noteId);
  if (!verification.success) {
    console.error('Note verification failed:', verification);
    return { verification, endpoints: null };
  }
  
  if (!verification.hasFile) {
    console.error('Note has no file attached');
    return { verification, endpoints: null, error: 'No file attached' };
  }
  
  // Test download endpoints
  const endpoints = await testDownloadEndpoints(noteId);
  
  return { verification, endpoints };
} 