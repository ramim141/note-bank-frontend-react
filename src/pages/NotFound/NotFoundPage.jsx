// src/pages/NotFound/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen text-center bg-gray-100">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mb-6 text-3xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mb-8 text-lg text-gray-600">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/" // Link back to the homepage
        className="px-6 py-3 font-medium text-white bg-blue-600 rounded-md transition duration-300 ease-in-out hover:bg-blue-700"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;