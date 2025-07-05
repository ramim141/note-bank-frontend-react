// src/api/apiService/statsService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getSiteStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/site-stats/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to fetch site stats:', error);
        throw error;
    }
};