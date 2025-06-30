// components/AboutSection.jsx
"use client"

import { useEffect, useState } from "react"
import AboutHero from "../About/AboutHero"
import StatsSection from "../About/StatsSection"
import MainFeatures from "../About/MainFeatures"
import MissionSection from "../About/MissionSection"
import FaqSection from "../About/FaqSection"
import TeamSection from "../About/TeamSection"
import UpcomingFeatures from "../About/UpcomingFeatures"
import FinalCTA from "../About/FinalCTA"
import { FaShieldAlt, FaUsers, FaBookOpen, FaLightbulb, FaBolt, FaPlay, FaDownload, FaShareAlt, FaEye, FaHeart, FaStar, FaComments } from "react-icons/fa"

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="overflow-hidden relative mt-12 min-h-screen bg-gradient-to-br via-white to-blue-50 from-slate-50">
      {/* Animated Background Elements */}
      <div className="overflow-hidden absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br rounded-full blur-3xl animate-pulse from-blue-400/20 to-purple-600/20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br rounded-full blur-3xl animate-pulse from-purple-400/20 to-pink-600/20 animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 from-cyan-400/10 to-blue-600/10 animate-spin-slow"></div>
      </div>

      <div className="relative z-10 py-20">
        {/* Hero Section */}
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <AboutHero />
          <StatsSection />
        </div>

        {/* Main Features Section */}
        <MainFeatures />

        {/* Mission Section */}
        <MissionSection />

        {/* FAQ Section */}
        <FaqSection />

        {/* Team Section */}
        <TeamSection />

        {/* Upcoming Features Section */}
        <UpcomingFeatures />

        {/* Final CTA Section */}
        <FinalCTA />
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}

export default AboutSection