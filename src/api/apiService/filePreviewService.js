import api from './axiosInstance';

export const filePreviewService = {
  /**
   * Get file preview URL for a note
   * @param {string|number} noteId - The ID of the note
   * @param {string} fileType - The type of file (pdf, image, text)
   */
  getFilePreviewUrl: (noteId, fileType = 'pdf') => {
    if (!noteId) return Promise.reject(new Error("Note ID is required."));
    return api.get(`/api/notes/${noteId}/preview/`, {
      params: { file_type: fileType }
    });
  },

  /**
   * Get Office document preview URL using Microsoft Office Online or Google Docs
   * @param {string|number} noteId - The ID of the note
   * @param {string} fileName - The file name
   */
  getOfficePreviewUrl: (noteId, fileName) => {
    if (!noteId || !fileName) return Promise.reject(new Error("Note ID and file name are required."));
    
    // Try to get the actual file URL first
    const fileUrl = `${api.defaults.baseURL}/api/notes/${noteId}/download/`;
    
    // Use Microsoft Office Online Viewer
    const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    
    // Fallback to Google Docs Viewer
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    
    return Promise.resolve({
      officeOnline: officeOnlineUrl,
      googleDocs: googleDocsUrl,
      directUrl: fileUrl
    });
  },

  /**
   * Get file content for text files
   * @param {string|number} noteId - The ID of the note
   */
  getFileContent: (noteId) => {
    if (!noteId) return Promise.reject(new Error("Note ID is required."));
    return api.get(`/api/notes/${noteId}/content/`, {
      responseType: 'text'
    });
  },

  /**
   * Get file metadata
   * @param {string|number} noteId - The ID of the note
   */
  getFileMetadata: (noteId) => {
    if (!noteId) return Promise.reject(new Error("Note ID is required."));
    return api.get(`/api/notes/${noteId}/metadata/`);
  },

  /**
   * Check if file preview is available
   * @param {string|number} noteId - The ID of the note
   */
  checkPreviewAvailability: (noteId) => {
    if (!noteId) return Promise.reject(new Error("Note ID is required."));
    return api.get(`/api/notes/${noteId}/preview-availability/`);
  }
};

// Helper function to determine file type from filename
export const getFileType = (fileName) => {
  if (!fileName) return 'unknown';
  
  const fileNameLower = fileName.toLowerCase();
  
  // PDF files
  if (fileNameLower.endsWith('.pdf')) {
    return 'pdf';
  }
  
  // Image files
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff', '.tif', '.ico'].some(ext => fileNameLower.endsWith(ext))) {
    return 'image';
  }
  
  // Text and code files
  if (['.txt', '.md', '.json', '.xml', '.csv', '.log', '.ini', '.conf', '.cfg'].some(ext => fileNameLower.endsWith(ext))) {
    return 'text';
  }
  
  // Code files
  if (['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass', '.less', '.php', '.py', '.java', '.cpp', '.c', '.cs', '.rb', '.go', '.rs', '.swift', '.kt', '.dart', '.r', '.sql', '.sh', '.bat', '.ps1', '.yaml', '.yml', '.toml', '.env'].some(ext => fileNameLower.endsWith(ext))) {
    return 'code';
  }
  
  // Document files
  if (['.doc', '.docx', '.docm', '.rtf', '.odt', '.pages'].some(ext => fileNameLower.endsWith(ext))) {
    return 'document';
  }
  
  // Spreadsheet files
  if (['.xls', '.xlsx', '.ods', '.numbers'].some(ext => fileNameLower.endsWith(ext))) {
    return 'spreadsheet';
  }
  
  // Presentation files
  if (['.ppt', '.pptx', '.odp', '.key'].some(ext => fileNameLower.endsWith(ext))) {
    return 'presentation';
  }
  
  // Archive files
  if (['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'].some(ext => fileNameLower.endsWith(ext))) {
    return 'archive';
  }
  
  // Audio files
  if (['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'].some(ext => fileNameLower.endsWith(ext))) {
    return 'audio';
  }
  
  // Video files
  if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'].some(ext => fileNameLower.endsWith(ext))) {
    return 'video';
  }
  
  // Font files
  if (['.ttf', '.otf', '.woff', '.woff2', '.eot'].some(ext => fileNameLower.endsWith(ext))) {
    return 'font';
  }
  
  return 'other';
};

// Helper function to check if file type supports preview
export const supportsPreview = (fileType) => {
  return ['pdf', 'image', 'text', 'code', 'document', 'spreadsheet', 'presentation', 'archive', 'audio', 'video'].includes(fileType);
};

// Helper function to check if file type supports embedded preview
export const supportsEmbeddedPreview = (fileType) => {
  return ['pdf', 'image', 'text', 'code', 'audio', 'video'].includes(fileType);
};

// Helper function to check if file type needs external viewer
export const needsExternalViewer = (fileType) => {
  return ['document', 'spreadsheet', 'presentation'].includes(fileType);
};

// Helper function to get file icon based on type
export const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf':
      return '📄';
    case 'image':
      return '🖼️';
    case 'text':
      return '📝';
    case 'code':
      return '💻';
    case 'document':
      return '📄';
    case 'spreadsheet':
      return '📊';
    case 'presentation':
      return '📈';
    case 'archive':
      return '📦';
    case 'audio':
      return '🎵';
    case 'video':
      return '🎬';
    case 'font':
      return '🔤';
    default:
      return '📁';
  }
};

// Helper function to get file type display name
export const getFileTypeName = (fileType) => {
  switch (fileType) {
    case 'pdf':
      return 'PDF Document';
    case 'image':
      return 'Image File';
    case 'text':
      return 'Text File';
    case 'code':
      return 'Code File';
    case 'document':
      return 'Word Document';
    case 'spreadsheet':
      return 'Spreadsheet';
    case 'presentation':
      return 'Presentation';
    case 'archive':
      return 'Archive File';
    case 'audio':
      return 'Audio File';
    case 'video':
      return 'Video File';
    case 'font':
      return 'Font File';
    default:
      return 'File';
  }
};

export default filePreviewService; 