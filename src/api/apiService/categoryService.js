// src/api/apiService/categoryService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const categoryService = {
    getAllCategories,
};

async function getAllCategories() {
    const response = await fetch(`${API_BASE_URL}/api/categories/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // If authentication is needed for categories, add token here
            // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    });

    if (!response.ok) {
        let errorData = { message: `HTTP error! status: ${response.status}` };
        try {
            const jsonResponse = await response.json();
            errorData = jsonResponse;
        } catch (e) {
            errorData.message = await response.text();
        }
        throw errorData;
    }
    return await response.json();
}