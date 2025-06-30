"use client"

import { Award, Users, GraduationCap, Rocket } from "lucide-react"
import { missionVisual } from '../../assets/images';

const MissionSection = () => {
  return (
    <div className="px-4 py-8 mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-inner sm:px-6 sm:py-12 sm:mb-16 lg:px-12 lg:py-16 lg:mb-24 lg:rounded-3xl">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Content Section */}
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Mission
              </span>
            </h2>

            <p className="text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl xl:text-2xl xl:leading-relaxed">
              Our mission is to democratize access to quality educational resources by fostering a collaborative
              environment where students can easily share and discover notes, leading to a more effective and engaging
              learning experience for everyone.
            </p>

            {/* Mission Values */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6 lg:gap-8">
              <div className="flex gap-2 items-center text-gray-600 sm:gap-3">
                <Award className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-sm font-medium sm:text-base lg:text-lg">Excellence in Education</span>
              </div>

              <div className="flex gap-2 items-center text-gray-600 sm:gap-3">
                <Users className="w-4 h-4 text-purple-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-sm font-medium sm:text-base lg:text-lg">Community Driven</span>
              </div>

              <div className="flex gap-2 items-center text-gray-600 sm:gap-3">
                <GraduationCap className="w-4 h-4 text-green-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-sm font-medium sm:text-base lg:text-lg">Student Success</span>
              </div>
            </div>

            {/* Call to Action - Only visible on larger screens */}
            <div className="hidden pt-4 lg:block">
              <button className="inline-flex gap-3 items-center px-6 py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 lg:px-8 lg:py-4 lg:rounded-2xl">
                <span className="text-sm lg:text-base">Learn More</span>
                <Rocket className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative mt-8 lg:mt-0">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-br rounded-xl blur-xl from-blue-400/20 to-purple-600/20 sm:rounded-2xl sm:blur-2xl"></div>

            {/* Main Image Container */}
            <div className="overflow-hidden relative rounded-xl shadow-xl sm:rounded-2xl sm:shadow-2xl">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/3]">
                <img
                  src={missionVisual}
                  alt="Students working together on laptops"
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t to-transparent from-blue-900/20"></div>

                {/* Innovation Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <div className="flex gap-2 items-center px-2.5 py-1.5 rounded-lg backdrop-blur-sm bg-white/90 sm:gap-3 sm:px-3 sm:py-2">
                    <Rocket className="w-3 h-3 text-blue-600 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Innovation</span>
                  </div>
                </div>

                {/* Stats Overlay - Only visible on larger screens */}
                <div className="hidden absolute right-4 bottom-4 lg:block">
                  <div className="p-3 rounded-lg backdrop-blur-sm bg-white/90">
                    <div className="flex gap-4 items-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">10k+</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">50k+</div>
                        <div className="text-xs text-gray-600">Notes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden absolute -top-3 -right-3 justify-center items-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg animate-bounce sm:flex sm:w-10 sm:h-10 lg:-top-4 lg:-right-4 lg:w-12 lg:h-12">
              <Award className="w-4 h-4 text-white sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>

            <div className="hidden absolute -bottom-3 -left-3 justify-center items-center w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg animate-pulse sm:flex sm:w-10 sm:h-10 lg:-bottom-4 lg:-left-4 lg:w-12 lg:h-12">
              <Users className="w-4 h-4 text-white sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        {/* Mobile Call to Action */}
        <div className="flex justify-center mt-8 lg:hidden">
          <button className="inline-flex gap-2 items-center px-6 py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:gap-3 sm:px-8 sm:py-4">
            <span className="text-sm sm:text-base">Learn More</span>
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MissionSection
