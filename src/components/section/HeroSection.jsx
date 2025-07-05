"use client";

import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaDownload,
  FaStar,
  FaUpload,
  FaUsers,
} from "react-icons/fa";
import heroImage from "../../assets/images/home-hero-img.png";

const HeroSection = () => {
  return (
    <section className="overflow-hidden relative pt-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex relative flex-col gap-16 justify-center items-center px-4 py-20 mx-auto max-w-7xl md:flex-row md:px-8 lg:px-12">
        {/* Left Side: Text Content and CTAs */}
        <div className="order-2 space-y-8 text-center md:w-1/2 md:text-left md:order-1">
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
              <span className="text-white">Unlock Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Academic
              </span>
              <br />
              <span className="text-white">Potential</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
            <p className="max-w-2xl text-xl leading-relaxed md:text-2xl text-white/90">
              Discover, share, and manage high-quality study notes from various courses and departments. Join
              thousands of students already excelling.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center md:justify-start">
            <div className="text-center">
              <FaUsers className="mx-auto text-3xl text-yellow-400" />
              <div className="mt-1 text-sm font-bold text-white/80">Share</div>
            </div>
            <div className="text-center">
              <FaDownload className="mx-auto text-3xl text-yellow-400" />
              <div className="mt-1 text-sm font-bold text-white/80">Downloads</div>
            </div>
            <div className="text-center">
              <FaUpload className="mx-auto text-3xl text-yellow-400" />
              <div className="mt-1 text-sm font-bold text-white/80">Upload</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 justify-center sm:flex-row md:justify-start">
            <Link
              to="/notes" // Assuming the notes list page is at '/notes'
              className="overflow-hidden relative px-8 py-4 font-bold text-indigo-600 bg-white rounded-2xl shadow-2xl transition-all duration-300 transform group hover:shadow-3xl hover:scale-105"
            >
              <span className="flex relative z-10 gap-2 justify-center items-center">
                Browse Approved Notes
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="flex absolute inset-0 z-10 gap-2 justify-center items-center font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Browse Approved Notes
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-2xl transition-all duration-300 transform group hover:shadow-3xl hover:scale-105 hover:from-yellow-300 hover:to-orange-300"
            >
              <span className="flex gap-2 justify-center items-center">
                Join Now - It's Free!
                <FaStar className="transition-transform duration-300 group-hover:rotate-12" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex order-1 justify-center md:w-1/2 md:order-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-30 blur-2xl animate-pulse"></div>
            <img
              src={heroImage} // Use the imported image
              alt="Study materials"
              className="object-cover relative w-full max-w-lg rounded-3xl shadow-2xl transition-transform duration-500 transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;