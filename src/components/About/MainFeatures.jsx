"use client"

import { useState } from "react"
import {
  Shield,
  Users,
  BookOpen,
  Lightbulb,
  Zap,
  Play,
  Download,
  Share,
  Eye,
  Heart,
  Star,
  MessageCircle,
} from "lucide-react"
import { studentsStudying } from '../../assets/images';

const MainFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Our platform is secure, and we ensure the quality of all uploaded notes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with thousands of students, share notes, and help each other succeed.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Easy Resource Discovery",
      description: "Easily find your required notes by course, department, or tags.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Lightbulb,
      title: "Share Your Knowledge",
      description: "Upload your best notes to contribute to the community and gain recognition.",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section className="px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 items-stretch lg:flex-row lg:gap-16">
          {/* Text Content Section */}
          <div className="flex flex-col flex-1 justify-center space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                NoteBank?
              </span>
            </h2>
            <p className="text-base text-gray-600 sm:text-lg lg:text-xl lg:leading-relaxed">
              We believe that the right resources and a supportive community are keys to academic success. NoteBank
              brings both of these to your fingertips, allowing you to focus more on your studies.
            </p>
            <div className="flex flex-col justify-center space-y-4 lg:space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className={`group p-4 rounded-2xl transition-all duration-500 cursor-pointer sm:p-5 lg:p-6 ${
                      activeFeature === index
                        ? "bg-white shadow-2xl scale-105 border-2 border-blue-200"
                        : "bg-white/50 hover:bg-white/80 shadow-lg hover:shadow-xl"
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex gap-3 items-start sm:gap-4">
                      <div
                        className={`p-2.5 rounded-xl sm:p-3 lg:p-4 bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-5 h-5 text-white sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 sm:mb-2 sm:text-xl lg:text-2xl">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <a
              href="/register"
              className="inline-flex gap-2 items-center self-start px-6 py-3 font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-xl transition-all duration-300 group hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:gap-3 sm:px-8 sm:py-4 lg:rounded-2xl"
            >
              <span className="text-sm sm:text-base lg:text-lg">Join Us Now!</span>
              <Zap className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-12 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Interactive Visual Section */}
          <div className="flex flex-1 justify-center items-center mt-8 lg:mt-0">
            <div className="overflow-hidden relative p-4 w-full max-w-lg rounded-3xl shadow-2xl backdrop-blur-sm bg-white/90 sm:p-6 lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-br rounded-3xl blur-3xl animate-pulse from-blue-400/30 to-purple-500/30"></div>
              <div className="relative w-full h-80 rounded-2xl overflow-hidden flex items-center justify-center sm:h-96 lg:h-[500px] xl:h-[600px]">
                <img
                  src={studentsStudying}
                  alt="Students Studying"
                  className="object-cover w-full h-full rounded-2xl transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-2xl from-black/20"></div>

                {/* Floating Action Buttons */}
                <div className="flex absolute top-3 right-3 gap-2 sm:top-4 sm:right-4">
                  <button className="p-1.5 rounded-full shadow-lg backdrop-blur-sm transition-transform duration-200 bg-white/90 hover:scale-110 sm:p-2">
                    <Play className="w-3 h-3 text-blue-600 sm:w-4 sm:h-4" />
                  </button>
                  <button className="p-1.5 rounded-full shadow-lg backdrop-blur-sm transition-transform duration-200 bg-white/90 hover:scale-110 sm:p-2">
                    <Download className="w-3 h-3 text-green-600 sm:w-4 sm:h-4" />
                  </button>
                  <button className="p-1.5 rounded-full shadow-lg backdrop-blur-sm transition-transform duration-200 bg-white/90 hover:scale-110 sm:p-2">
                    <Share className="w-3 h-3 text-purple-600 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute right-3 bottom-3 left-3 p-2.5 rounded-lg backdrop-blur-sm bg-white/90 sm:right-4 sm:bottom-4 sm:left-4 sm:p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Users className="w-3 h-3 text-blue-600 sm:w-4 sm:h-4" />
                      <span className="text-xs font-medium text-gray-700 sm:text-sm">Active Study Session</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1 items-center">
                        <Eye className="w-2.5 h-2.5 text-gray-500 sm:w-3 sm:h-3" />
                        <span className="text-xs text-gray-600">1.2k</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Heart className="w-2.5 h-2.5 text-red-500 sm:w-3 sm:h-3" />
                        <span className="text-xs text-gray-600">89</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse sm:w-2 sm:h-2"></div>
                        <span className="text-xs text-gray-600">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Only visible on larger screens */}
              <div className="hidden absolute -top-4 -right-4 justify-center items-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg animate-bounce lg:flex lg:w-12 lg:h-12">
                <Star className="w-5 h-5 text-white lg:w-6 lg:h-6" />
              </div>
              <div className="hidden absolute -bottom-4 -left-4 justify-center items-center w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg animate-pulse lg:flex lg:w-12 lg:h-12">
                <MessageCircle className="w-5 h-5 text-white lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainFeatures
