// src/api/apiService/contributorsService.js

// Assume fetchWrapper is correctly set up to handle headers and API calls.
// Import your actual fetchWrapper here.
import { fetchWrapper } from '../../utils/fetchWrapper'; 

/**
 * সকল কন্ট্রিবিউটরদের একটি তালিকা ফেচ করে।
 * এটি পেজিনেটেড ডেটাও হ্যান্ডেল করতে পারে।
 * 
 * @param {object} [params={}] - ঐচ্ছিক প্যারামিটার, যেমন পেজিনেশন বা সর্টিংয়ের জন্য।
 * @param {number} [params.page=1] - যে পেজের ডেটা আনা হবে।
 * @returns {Promise<object>} - একটি Promise যা কন্ট্রিবিউটরদের ডেটা সহ একটি অবজেক্টে Resolve হবে।
 * @throws {Error} - যদি API কল ব্যর্থ হয় তবে একটি Error Throw করবে।
 */
export const fetchContributors = async (params = {}) => {
    try {
        // Query parameters তৈরি করা হচ্ছে।
        const queryParams = new URLSearchParams({
            page: 1, // ডিফল্ট পেজ নম্বর
            ...params, // অন্য কোনো প্যারামিটার (যেমন: ordering, search ইত্যাদি) যুক্ত করা যেতে পারে
        });
        
        // '/api/notes/contributors/' এন্ডপয়েন্টে GET রিকোয়েস্ট পাঠানো হচ্ছে।
        // fetchWrapper ব্যবহার করে ডেটা আনা হচ্ছে।
        // queryParams স্ট্রিংটি URL এর সাথে যুক্ত হবে।
        const response = await fetchWrapper.get(`/api/notes/contributors/?${queryParams}`);

        // API রেসপন্স ডেটা রিটার্ন করা হচ্ছে।
        // fetchWrapper সাধারণত JSON পার্স করে দেয়, তাই সরাসরি response ব্যবহার করা হচ্ছে।
        return response; 

    } catch (error) {
        console.error('কন্ট্রিবিউটরদের ডেটা ফেচ করতে সমস্যা হয়েছে:', error);
        // এররটি Throw করা হচ্ছে যাতে Calling Component এটি Catch করতে পারে।
        throw error;
    }
};

// ... অন্যান্য ফাংশন (যদি থাকে)