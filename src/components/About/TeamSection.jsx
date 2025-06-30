"use client"

import { Linkedin, Github, Mail, MapPin, Star } from "lucide-react"
import { teamMember1, teamMember2, teamMember3 } from '../../assets/images';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Ramim Ahmed",
      role: "Lead Developer",
      location: "New York, USA",
      image: teamMember1,
      linkedin: "#",
      github: "#",
      email: "ramim@notebank.com",
      skills: ["React", "Node.js", "MongoDB"],
      rating: 4.9,
      projects: 45,
      cardGradient: "from-blue-400 via-purple-500 to-indigo-600",
    },
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      location: "London, UK",
      image: teamMember2,
      linkedin: "#",
      github: "#",
      email: "sarah@notebank.com",
      skills: ["Figma", "Design Systems", "User Research"],
      rating: 4.8,
      projects: 32,
      cardGradient: "from-pink-400 via-rose-500 to-red-600",
    },
    {
      name: "Alex Chen",
      role: "Backend Developer",
      location: "Tokyo, Japan",
      image: teamMember3,
      linkedin: "#",
      github: "#",
      email: "alex@notebank.com",
      skills: ["Python", "PostgreSQL", "AWS"],
      rating: 4.9,
      projects: 38,
      cardGradient: "from-green-400 via-emerald-500 to-teal-600",
    },

  
   
  ]

  return (
    <section className="overflow-hidden relative px-4 py-12 mb-12 sm:px-6 sm:py-16 sm:mb-16 lg:px-8 lg:py-20 lg:mb-24">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t via-transparent from-white/80 to-white/40"></div>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-20 top-32 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-2xl delay-1000 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute right-10 bottom-32 w-28 h-28 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-2xl delay-500 animate-pulse"></div>
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
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl xl:text-2xl xl:max-w-3xl">
            Passionate innovators and creators working together to revolutionize the learning experience for students
            worldwide.
          </p>
        </div>

        {/* Enhanced Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden relative bg-white rounded-3xl shadow-xl transition-all duration-500 group hover:shadow-2xl hover:scale-105"
            >
              {/* Card Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${member.cardGradient} opacity-0 transition-all duration-500 group-hover:opacity-10`}
              ></div>

              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent rounded-3xl opacity-0 transition-all duration-500 via-white/20 group-hover:opacity-100 group-hover:animate-pulse"></div>

              <div className="relative p-6 sm:p-8 lg:p-10">
                {/* Profile Section */}
                <div className="relative mb-6 text-center lg:mb-8">
                  {/* Profile Image with Enhanced Effects */}
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${member.cardGradient} rounded-full blur-md opacity-30 transition-all duration-500 group-hover:opacity-60 group-hover:blur-lg`}
                    ></div>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="object-cover relative w-full h-full rounded-full border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl"
                      loading="lazy"
                    />
                    {/* Floating Ring Animation */}
                    <div
                      className={`absolute inset-0 rounded-full border-2 border-gradient-to-r ${member.cardGradient} opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 group-hover:animate-spin`}
                    ></div>
                  </div>

                  {/* Enhanced Status Indicator */}
                  <div className="flex absolute -right-2 -bottom-2 justify-center items-center w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg sm:w-9 sm:h-9 lg:w-10 lg:h-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {/* Floating Star Rating */}
                  <div className="flex absolute -top-2 -right-2 gap-1 items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                    <Star className="w-3 h-3 text-white fill-current" />
                    <span className="text-xs font-bold text-white">{member.rating}</span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center">
                  <h3 className="mb-1 text-xl font-black text-gray-900 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 sm:text-2xl lg:text-3xl">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">{member.role}</p>

                  {/* Location */}
                  <div className="flex gap-1 justify-center items-center mb-4 text-xs text-gray-500 sm:text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{member.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 justify-center mb-6 text-center">
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
                  <div className="flex flex-wrap gap-2 justify-center mb-6 lg:mb-8">
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
                  <div className="flex gap-3 justify-center">
                    <a
                      href={member.linkedin}
                      className="relative p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg transition-all duration-300 group/social hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:p-4"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 transition-all duration-300 group-hover/social:opacity-100 group-hover/social:scale-110"></div>
                      <Linkedin className="relative w-5 h-5 text-white transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-12 sm:w-6 sm:h-6" />
                    </a>

                    <a
                      href={member.github}
                      className="relative p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-lg transition-all duration-300 group/social hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300 sm:p-4"
                      aria-label={`${member.name}'s GitHub profile`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl opacity-0 transition-all duration-300 group-hover/social:opacity-100 group-hover/social:scale-110"></div>
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
              <div className="absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 transform -translate-x-full -skew-x-12 via-white/10 group-hover:translate-x-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Join Team CTA */}
        <div className="mt-12 text-center sm:mt-16 lg:mt-20">
          <div className="overflow-hidden relative p-8 bg-gradient-to-br rounded-3xl border shadow-2xl backdrop-blur-xl from-white/80 to-white/60 border-white/50 lg:p-12">
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
              <div className="flex flex-col gap-4 justify-center sm:flex-row">
                <button className="overflow-hidden relative px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl transition-all duration-300 group hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative text-lg">View Open Positions</span>
                </button>
                <button className="relative px-8 py-4 font-bold text-purple-600 bg-white rounded-2xl border-2 border-purple-600 shadow-xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300">
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
