// src/api/apiService/departmentService.js

import api from './axiosInstance'; 
import { toast } from 'react-toastify';

export const departmentService = {
    getAllDepartments,
};

async function getAllDepartments() {
    try {
        const response = await api.get('/api/departments/');
        return response.data; 

    } catch (error) {
        console.error("Error fetching departments:", error);

        if (!error.response && !error.message.includes("API configuration error")) {
             toast.error("Failed to fetch departments. Please check your network connection.");
        } else if (error.response && error.response.status === 401) {

            toast.error("Session expired. Please log in again.");
        } else if (error.response && error.response.data && error.response.data.detail) {
            // Show specific detail from the backend if available
             toast.error(error.response.data.detail);
        } else if (error.response && error.response.data && error.response.data.message) {
             toast.toast(error.response.data.message);
        } else {
             toast.error("An unexpected error occurred while fetching departments.");
        }
        throw error;
    }
}