// src/api/apiService/likeService.js
import api from './axiosInstance';

export const likeService = {
  toggleLikeNote: (noteId) => api.post(`api/notes/${noteId}/toggle-like/`),
};