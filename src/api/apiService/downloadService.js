// src/api/apiService/downloadService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Comprehensive download service for notes
 */
export class DownloadService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Try to get a secure download URL for a note
   */
  async getSecureDownloadUrl(noteId) {
    const accessToken = this.getAuthToken();
    
    const response = await fetch(`${this.baseURL}/api/notes/${noteId}/secure-download-url/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to get secure download URL.');
    }

    const data = await response.json();
    return data.secure_download_url;
  }

  /**
   * Download file using secure URL
   */
  async downloadNoteFile(secureUrl, filename = 'downloaded_note') {
    const accessToken = this.getAuthToken();
    
    const response = await fetch(secureUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to download the file.');
    }

    const blob = await response.blob();
    
    // Get filename from Content-Disposition header
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('filename=')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Trigger download
    this.triggerDownload(blob, filename);
  }

  /**
   * Try direct download from various endpoints
   */
  async directDownload(noteId, filename = 'downloaded_note') {
    const accessToken = this.getAuthToken();
    
    // Try different endpoint patterns
    const endpoints = [
      `/api/notes/${noteId}/download/`,
      `/api/notes/${noteId}/file/`,
      `/api/notes/${noteId}/download-file/`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          
          // Get filename from Content-Disposition header
          const disposition = response.headers.get('Content-Disposition');
          if (disposition && disposition.includes('filename=')) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }

          this.triggerDownload(blob, filename);
          return true;
        }
      } catch (error) {
        console.log(`Direct download from ${endpoint} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All direct download endpoints failed.');
  }

  /**
   * Trigger file download in browser
   */
  triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  /**
   * Main download function that tries multiple approaches
   */
  async downloadNote(noteId, noteFileName = null) {
    try {
      // Approach 1: Try secure download URL
      try {
        const secureUrl = await this.getSecureDownloadUrl(noteId);
        await this.downloadNoteFile(secureUrl, noteFileName);
        return { success: true, method: 'secure' };
      } catch (secureError) {
        console.log('Secure download failed, trying direct download:', secureError);
      }

      // Approach 2: Try direct download
      try {
        await this.directDownload(noteId, noteFileName);
        return { success: true, method: 'direct' };
      } catch (directError) {
        console.log('Direct download failed:', directError);
      }

      // If all approaches fail
      throw new Error('All download approaches failed. Please contact support.');
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

// Create and export a default instance
const downloadService = new DownloadService();
export default downloadService;

// Legacy functions for backward compatibility
export async function getSecureDownloadUrl(noteId) {
  return downloadService.getSecureDownloadUrl(noteId);
}

export async function downloadNoteFile(secureUrl) {
  return downloadService.downloadNoteFile(secureUrl);
}