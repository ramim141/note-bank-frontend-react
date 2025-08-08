"use client"

import { Linkedin, Github, Mail, MapPin, Star } from "lucide-react"
import { teamMember1, teamMember2, teamMember3 } from '../../assets/images';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Ramim Ahmed",
      role: "Backend Developer",
      location: "Metropolitan University, Sylhet",
      image: teamMember1,
      linkedin: "#",
      github: "#",
      email: "ahramu584@gmail.com",
      skills: ["Django", "DRF", "PostgreSQL", "React"],
      rating: 4.8,
      projects: 12,
      cardGradient: "from-blue-400 via-purple-500 to-indigo-600",
    },
    {
      name: "Abu Taher Chy",
      role: "UI/UX Designer",
      location: "Metropolitan University, Sylhet",
      image: teamMember2,
      linkedin: "#",
      github: "#",
      email: "abu615584@gmail.com",
      skills: ["Figma", "Graphics Design"],
      rating: 4.3,
      projects: 5,
      cardGradient: "from-pink-400 via-rose-500 to-red-600",
    },
    {
      name: "Mahinur Rahman Pamel",
      role: "Frontend Developer",
      location: "Metropolitan University, Sylhet",
      image: teamMember3,
      linkedin: "#",
      github: "#",
      email: "mahi333nur@gmail.com",
      skills: ["CSS", "TailwindCSS", "JS", "React"],
      rating: 4.5,
      projects: 5,
      cardGradient: "from-green-400 via-emerald-500 to-teal-600",
    },

    {
      name: "Jahid Hasan",
      role: "Frontend Developer",
      location: "Metropolitan University, Sylhet",
      image: teamMember3,
      linkedin: "#",
      github: "#",
      email: "mahi333nur@gmail.com",
      skills: [ "TailwindCSS", "JS", "React"],
      rating: 4.2,
      projects: 3,
      cardGradient: "from-green-400 via-emerald-500 to-teal-600",
    },

  
   
  ]

  return (
    <section className="relative px-4 py-12 mb-12 overflow-hidden sm:px-6 sm:py-16 sm:mb-16 lg:px-8 lg:py-20 lg:mb-24">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t via-transparent from-white/80 to-white/40"></div>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-32 h-32 rounded-full top-10 left-10 bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl animate-pulse"></div>
        <div className="absolute w-24 h-24 delay-1000 rounded-full right-20 top-32 bg-gradient-to-r from-pink-400 to-rose-500 blur-2xl animate-pulse"></div>
        <div className="absolute w-40 h-40 rounded-full bottom-20 left-1/4 bg-gradient-to-r from-emerald-400 to-teal-500 blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute delay-500 rounded-full right-10 bottom-32 w-28 h-28 bg-gradient-to-r from-violet-400 to-purple-500 blur-2xl animate-pulse"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-black text-gray-900 sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Dream Team
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg lg:text-xl xl:text-2xl xl:max-w-3xl">
            Passionate innovators and creators working together to revolutionize the learning experience for students
            worldwide.
          </p>
        </div>

        {/* Enhanced Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative overflow-hidden transition-all duration-500 bg-white shadow-xl rounded-3xl group hover:shadow-2xl hover:scale-105"
            >
              {/* Card Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${member.cardGradient} opacity-0 transition-all duration-500 group-hover:opacity-10`}
              ></div>

              {/* Animated Border */}
              <div className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-r from-transparent to-transparent rounded-3xl via-white/20 group-hover:opacity-100 group-hover:animate-pulse"></div>

              <div className="relative p-6 sm:p-8 lg:p-10">
                {/* Profile Section */}
                <div className="relative mb-6 text-center lg:mb-8">
                  {/* Profile Image with Enhanced Effects */}
                  <div className="relative w-24 h-24 mx-auto sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${member.cardGradient} rounded-full blur-md opacity-30 transition-all duration-500 group-hover:opacity-60 group-hover:blur-lg`}
                    ></div>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="relative object-cover w-full h-full transition-all duration-500 border-4 border-white rounded-full shadow-2xl group-hover:scale-110 group-hover:shadow-3xl"
                      loading="lazy"
                    />
                    {/* Floating Ring Animation */}
                    <div
                      className={`absolute inset-0 rounded-full border-2 border-gradient-to-r ${member.cardGradient} opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:animate-spin`}
                    ></div>
                  </div>

                  {/* Enhanced Status Indicator */}
                  <div className="absolute flex items-center justify-center w-8 h-8 border-4 border-white rounded-full shadow-lg -right-2 -bottom-2 bg-gradient-to-r from-green-400 to-emerald-500 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>

                  
                </div>

                {/* Member Info */}
                <div className="text-center">
                  <h3 className="mb-1 text-xl font-black text-gray-900 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 sm:text-2xl lg:text-3xl">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">{member.role}</p>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 mb-4 text-xs text-gray-500 sm:text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{member.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-4 mb-6 text-center">
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900">{member.projects}</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900">{member.rating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>

                  {/* Enhanced Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mb-8">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r ${member.cardGradient} rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:px-4 sm:text-sm`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Enhanced Social Links */}
                  <div className="flex justify-center gap-3">
                    <a
                      href={member.linkedin}
                      className="relative p-3 transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl group/social hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:p-4"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <div className="absolute inset-0 transition-all duration-300 opacity-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl group-hover/social:opacity-100 group-hover/social:scale-110"></div>
                      <Linkedin className="relative w-5 h-5 text-white transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-12 sm:w-6 sm:h-6" />
                    </a>

                    <a
                      href={member.github}
                      className="relative p-3 transition-all duration-300 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl group/social hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:p-4"
                      aria-label={`${member.name}'s GitHub profile`}
                    >
                      <div className="absolute inset-0 transition-all duration-300 opacity-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl group-hover/social:opacity-100 group-hover/social:scale-110"></div>
                      <Github className="relative w-5 h-5 text-white transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-12 sm:w-6 sm:h-6" />
                    </a>

                    <a
                      href={`mailto:${member.email}`}
                      className={`group/social relative p-3 bg-gradient-to-r ${member.cardGradient} rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 sm:p-4`}
                      aria-label={`Email ${member.name}`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${member.cardGradient} rounded-2xl opacity-0 transition-all duration-300 group-hover/social:opacity-100 group-hover/social:scale-110 brightness-110`}
                      ></div>
                      <Mail className="relative w-5 h-5 text-white transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-12 sm:w-6 sm:h-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Shine Effect */}
              <div className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                <div className="absolute top-0 left-0 w-full h-full transition-transform duration-1000 transform -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent to-transparent via-white/10 group-hover:translate-x-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Join Team CTA */}
        <div className="mt-12 text-center sm:mt-16 lg:mt-20">
          <div className="relative p-8 overflow-hidden border shadow-2xl bg-gradient-to-br rounded-3xl backdrop-blur-xl from-white/80 to-white/60 border-white/50 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative">
              <h3 className="mb-4 text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Join Us?
                </span>
              </h3>
              <p className="mb-8 text-base text-gray-600 sm:text-lg lg:text-xl">
                {"We're always looking for talented individuals who share our passion for innovation and education."}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button className="relative px-8 py-4 overflow-hidden font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl group hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:opacity-100"></div>
                  <span className="relative text-lg">View Open Positions</span>
                </button>
                <button className="relative px-8 py-4 font-bold text-purple-600 transition-all duration-300 bg-white border-2 border-purple-600 shadow-xl rounded-2xl group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300">
                  <span className="relative text-lg">Send Your Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamSection
