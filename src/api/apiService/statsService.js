// src/api/apiService/statsService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://edumetro.onrender.com";

/**
 * সাইটের সামগ্রিক পরিসংখ্যান (মোট ব্যবহারকারী, নোট, কোর্স, বিভাগ) ফেচ করে।
 * 
 * @returns {Promise<object>} - একটি Promise যা সাইটের পরিসংখ্যান সহ একটি অবজেক্টে Resolve হবে।
 * @throws {Error} - যদি API কল ব্যর্থ হয় তবে একটি Error Throw করবে।
 */
export const getSiteStats = async () => {
    try {
        // Create a simple fetch request without authentication for public stats
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
        console.error('সাইটের পরিসংখ্যান ফেচ করতে সমস্যা হয়েছে:', error);
        // এররটি Throw করা হচ্ছে যাতে Calling Component এটি Catch করতে পারে।
        throw error;
    }
};