// components/About/AboutHero.jsx
"use client"

import { FaStar } from "react-icons/fa"

const AboutHero = () => {
  return (
    <div className="px-12 py-12 mx-auto mb-20 max-w-7xl text-center lg:px-8 sm:px-8">
      <div className="inline-flex gap-2 items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
        <FaStar className="w-4 h-4 text-yellow-500" />
        Trusted by thousands of students
      </div>

      <h1 className="mb-6 text-5xl font-black leading-tight text-gray-900 md:text-7xl">
        About{" "}
        <span className="relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
            NoteBank
          </span>
          <div className="absolute right-0 left-0 -bottom-2 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse"></div>
        </span>
      </h1>

      <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-600 md:text-2xl">
        NoteBank is a specialized platform for students, where you can find your essential notes, upload your own,
        and connect with a vibrant academic community. We aim to make learning accessible and collaborative for
        everyone.
      </p>
    </div>
  )
}

export default AboutHero