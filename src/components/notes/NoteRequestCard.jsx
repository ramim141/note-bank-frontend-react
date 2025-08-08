// src/components/notes/NoteRequestCard.jsx
import React from 'react';
import { FaUser, FaBook, FaBuilding, FaClock } from 'react-icons/fa';

const NoteRequestCard = ({ request, onFulfill }) => {
  const {
    user_full_name,
    course_name,
    department_name,
    message,
    created_at,
    status,
    fulfilled_by_username,
    fulfilled_note_id,
  } = request;

  const timeAgo = new Date(created_at).toLocaleDateString();

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{course_name}</h3>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full
                ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
            >
              {status}
            </span>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center"><FaBuilding className="mr-2 text-violet-500" />{department_name}</p>
            <p className="flex items-center"><FaUser className="mr-2 text-purple-500" />Requested by: {user_full_name}</p>
            <p className="flex items-center"><FaClock className="mr-2 text-indigo-500" />{timeAgo}</p>
          </div>
          <p className="p-3 mt-4 text-gray-700 bg-gray-100 rounded-lg border-l-4 border-gray-300">{message}</p>
        </div>
        <div className="mt-6">
          {status === 'PENDING' ? (
            <button
              onClick={() => onFulfill(request)}
              className="px-4 py-2 w-full font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg transition-all duration-300 hover:from-violet-600 hover:to-purple-700"
            >
              Fulfill Request
            </button>
          ) : (
            <a
              href={`/${fulfilled_note_id}`} // NoteDetailsPage-এর URL
              className="block px-4 py-2 w-full font-bold text-center text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-lg transition-all duration-300 hover:from-green-600 hover:to-teal-700"
            >
              View Uploaded Note
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteRequestCard;