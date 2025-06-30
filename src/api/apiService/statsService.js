// src/api/apiService/statsService.js

// আপনার fetchWrapper ইম্পোর্ট করুন
import { fetchWrapper } from '../../utils/fetchWrapper'; 

/**
 * সাইটের সামগ্রিক পরিসংখ্যান (মোট ব্যবহারকারী, নোট, কোর্স, বিভাগ) ফেচ করে।
 * 
 * @returns {Promise<object>} - একটি Promise যা সাইটের পরিসংখ্যান সহ একটি অবজেক্টে Resolve হবে।
 * @throws {Error} - যদি API কল ব্যর্থ হয় তবে একটি Error Throw করবে।
 */
export const getSiteStats = async () => {
    try {
        // '/api/users/site-stats/' এন্ডপয়েন্টে GET রিকোয়েস্ট পাঠানো হচ্ছে।
        const response = await fetchWrapper.get('/api/users/site-stats/');
        
        // API রেসপন্স ডেটা রিটার্ন করা হচ্ছে।
        return response; 

    } catch (error) {
        console.error('সাইটের পরিসংখ্যান ফেচ করতে সমস্যা হয়েছে:', error);
        // এররটি Throw করা হচ্ছে যাতে Calling Component এটি Catch করতে পারে।
        throw error;
    }
};