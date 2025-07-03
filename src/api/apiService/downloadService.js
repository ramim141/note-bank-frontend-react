// src/api/apiService/downloadService.js


const API_BASE_URL = "https://edumetro.onrender.com";

export async function getSecureDownloadUrl(noteId, accessToken) {
  // নিশ্চিত করুন যে এখানেও https ব্যবহৃত হচ্ছে
  const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}/download/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to get secure download URL.');
  }
  
  // এই URL টিও এখন https সহ আসবে, যা খুবই জরুরি
  return data.secure_download_url;
}

export async function downloadNoteFile(secureUrl, accessToken) {
  // secureUrl টি ব্যাকএন্ড থেকে https সহ আসবে, তাই এখানে পরিবর্তনের প্রয়োজন নেই
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
  

  const disposition = response.headers.get('Content-Disposition');
  let filename = 'downloaded_note';
  if (disposition && disposition.includes('filename=')) {

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  // লিঙ্কটি পরিষ্কার করুন
  window.URL.revokeObjectURL(url);
  a.remove();
}