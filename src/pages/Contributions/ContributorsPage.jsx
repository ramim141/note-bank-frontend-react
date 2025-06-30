// src/pages/Contributions/ContributorsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchContributors } from '../../api/apiService/contributorsService'; // আমাদের সার্ভিস ফাইল

// পেজিনেশন কন্ট্রোল কম্পোনেন্ট (যদি আপনার প্রজেক্টে থাকে বা তৈরি করতে চান)
// আপাতত আমরা একটি সাধারণ বাটন দিয়ে নেভিগেট করব।
// আপনি চাইলে একটি সুন্দর পেজিনেশন কম্পোনেন্ট ব্যবহার করতে পারেন।

const CACHE_KEY = 'contributorsData';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 মিনিট

const ContributorsPage = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // পেজিনেশন স্টেট
    const [currentPage, setCurrentPage] = useState(1); // বর্তমান পৃষ্ঠা
    const [totalPages, setTotalPages] = useState(1); // মোট পৃষ্ঠা সংখ্যা
    const [totalCount, setTotalCount] = useState(0); // মোট কন্ট্রিবিউটরের সংখ্যা

    // ডেটা ফেচ করার ফাংশন
    const loadContributors = useCallback(async (page = 1) => { // পেজ নম্বর প্যারামিটার যোগ করা হয়েছে
        setLoading(true);
        setError(null);

        try {
            // localStorage ক্যাশিং লজিক (আগের মতোই)
            const cacheKey = `${CACHE_KEY}_page_${page}`; // প্রতি পেজের জন্য আলাদা ক্যাশে
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                    console.log(`Loading contributors page ${page} from cache.`);
                    setContributors(data.results || data);
                    // পেজিনেটেড ডেটার জন্য totalPages এবং totalCount সেট করা দরকার
                    if (data.count !== undefined && data.results) {
                        setTotalCount(data.count);
                        setTotalPages(Math.ceil(data.count / 10)); // ধরে নিচ্ছি প্রতি পেজে 10 টি আইটেম
                    }
                    setLoading(false);
                    return;
                } else {
                    console.log(`Cache expired for page ${page}. Fetching fresh data.`);
                }
            }

            // API থেকে ফেচ করা হচ্ছে
            console.log(`Fetching contributors page ${page} from API.`);
            const responseData = await fetchContributors({ page: page }); // API কলে পেজ নম্বর পাস করা হচ্ছে

            let processedData = [];
            if (responseData && Array.isArray(responseData.results)) {
                processedData = responseData.results;
                // পেজিনেটেড ডেটার জন্য totalPages এবং totalCount সেট করা হচ্ছে
                setTotalCount(responseData.count);
                // Assuming default items per page is 10, adjust if your API returns it
                setTotalPages(Math.ceil(responseData.count / 10)); 
            } else if (Array.isArray(responseData)) {
                processedData = responseData;
                setTotalCount(responseData.length);
                setTotalPages(1); // যদি পেজিনেটেড না হয়
            } else {
                console.error("API response is not in the expected format:", responseData);
                setError('Received invalid data format from the server.');
                setLoading(false);
                return;
            }

            setContributors(processedData);
            // localStorage এ ডেটা সেভ করা হচ্ছে
            localStorage.setItem(cacheKey, JSON.stringify({ data: responseData, timestamp: Date.now() }));
            
        } catch (err) {
            setError('Failed to fetch contributors. Please try again later.');
            console.error('Error fetching contributors:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect দিয়ে loadContributors কে কল করা হচ্ছে
    useEffect(() => {
        loadContributors(currentPage); // ইনিশিয়ালি বর্তমান পেজ লোড করবে
    }, [loadContributors, currentPage]); // currentPage পরিবর্তন হলে আবার লোড করবে

    // পেজ পরিবর্তনের হ্যান্ডেলার
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // পেজিনেশন বাটনগুলো রেন্ডার করার জন্য একটি ফাংশন
    const renderPagination = () => {
        if (totalPages <= 1) return null; // যদি মাত্র একটি পেজ থাকে, তবে পেজিনেশন দেখানোর প্রয়োজন নেই

        const pageButtons = [];
        const maxPageButtons = 5; // সর্বোচ্চ কয়টি পেজ বাটন দেখাবে

        // Page number buttons logic
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxPageButtons / 2));

        if (currentPage < Math.floor(maxPageButtons / 2) + 1) {
            endPage = Math.min(totalPages, maxPageButtons);
        }
        if (currentPage > totalPages - Math.floor(maxPageButtons / 2)) {
            startPage = Math.max(1, totalPages - maxPageButtons + 1);
        }

        // Previous button
        pageButtons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 rounded-md border ${currentPage === 1 ? 'border-gray-300 text-gray-500 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
                « পূর্ববর্তী
            </button>
        );

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded-md border ${i === currentPage ? 'bg-blue-500 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                    {i}
                </button>
            );
        }

        // Next button
        pageButtons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 rounded-md border ${currentPage === totalPages ? 'border-gray-300 text-gray-500 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
                পরবর্তী »
            </button>
        );

        return (
            <div className="flex justify-center mt-8">
                {pageButtons}
            </div>
        );
    };

    // মূল JSX রেন্ডারিং
    return (
        <div className="p-4 pt-24 mt-12 min-h-screen bg-gray-50 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-center items-center mt-12 mb-10 text-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Our Top <span className="text-yellow-500 transition-colors duration-300 hover:text-yellow-400">Contributors</span>
                        </h1>
                    </div>
                    <p className="mt-4 max-w-2xl text-xl leading-relaxed text-gray-600">
                        Huge thanks to everyone contributing to enrich our community!
                    </p>
                </div>

                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Full Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Batch
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                                    Notes
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                                    Avg. Rating
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contributors.map((contributor) => (
                                <tr key={contributor.email || contributor.id} className="transition-colors duration-200 hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{contributor.full_name}</div>
                                                <div className="text-sm text-gray-500">{contributor.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{contributor.department_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                            {contributor.batch_with_section || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-center text-gray-700 whitespace-nowrap">
                                        {contributor.note_contribution_count}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                                        <div className="flex justify-center items-center">
                                            <span className="mr-1 font-semibold text-yellow-500">
                                                {typeof contributor.average_star_rating === 'number' ? contributor.average_star_rating.toFixed(2) : '0.00'}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* পেজিনেশন কন্ট্রোল */}
                {renderPagination()}

            </div>
        </div>
    );
};

export default ContributorsPage;