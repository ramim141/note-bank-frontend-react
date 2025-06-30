"use client";

import { Link } from "react-router-dom";
import { FaArrowRight, FaSearch, FaStar, FaUpload } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <section className="overflow-hidden relative px-4 py-24 mx-auto max-w-7xl bg-white md:px-8 lg:px-8">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute left-10 top-20 w-72 h-72 bg-indigo-600 rounded-full"></div>
        <div className="absolute right-10 bottom-20 w-96 h-96 bg-purple-600 rounded-full"></div>
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-5xl font-black text-gray-900 md:text-6xl">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              NoteBank?
            </span>
          </h2>
          <div className="mx-auto mb-6 w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            Join thousands of students who are already transforming their academic journey with our comprehensive
            note-sharing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Feature 1 */}
          <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 transform group hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                <FaSearch className="text-3xl text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                Find Notes Easily
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Quickly search and filter notes by course, department, and rating with our advanced search system.
              </p>
              <Link
                to="/notes" // Link to the notes list page
                className="flex items-center font-semibold text-indigo-600 transition-all duration-300 group-hover:gap-2"
              >
                <span>Learn More</span>
                <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 transform group hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                <FaUpload className="text-3xl text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                Share Your Knowledge
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Upload your own notes and contribute to the community while earning recognition and rewards.
              </p>
              <Link
                to="/upload-note" // Assuming upload page is at '/upload-note'
                className="flex items-center font-semibold text-blue-600 transition-all duration-300 group-hover:gap-2"
              >
                <span>Start Sharing</span>
                <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 transform group hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                <FaStar className="text-3xl text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-yellow-600">
                Review & Rate
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Provide valuable feedback on notes and help others discover the best study materials available.
              </p>
              <Link
                to="/notes" // Link to notes list where rating can be done
                className="flex items-center font-semibold text-yellow-600 transition-all duration-300 group-hover:gap-2"
              >
                <span>Join Community</span>
                <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;