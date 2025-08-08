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
    <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 bg-white rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 bg-yellow-300 rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 bg-pink-300 rounded-full left-20 w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-16 py-20 mx-auto max-w-7xl md:flex-row ">
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
            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
            <p className="max-w-2xl text-xl leading-relaxed md:text-2xl text-white/90">
              Discover, share, and manage high-quality study notes from various courses and departments. Join
              thousands of students already excelling.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:justify-start">
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
          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link
              to="/notes" // Assuming the notes list page is at '/notes'
              className="relative px-8 py-4 overflow-hidden font-bold text-indigo-600 transition-all duration-300 transform bg-white shadow-2xl rounded-2xl group hover:shadow-3xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Browse Approved Notes
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:opacity-100"></div>
              <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 font-bold text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                Browse Approved Notes
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 font-bold text-gray-900 transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl group hover:shadow-3xl hover:scale-105 hover:from-yellow-300 hover:to-orange-300"
            >
              <span className="flex items-center justify-center gap-2">
                Join Now - It's Free!
                <FaStar className="transition-transform duration-300 group-hover:rotate-12" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex justify-center order-1 md:w-1/2 md:order-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-30 blur-2xl animate-pulse"></div>
            <img
              src={heroImage} // Use the imported image
              alt="Study materials"
              className="relative object-cover w-full max-w-lg transition-transform duration-500 transform shadow-2xl rounded-3xl hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;