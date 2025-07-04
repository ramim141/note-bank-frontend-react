"use client"

// components/dashboard/StatCard.jsx

import { useState } from "react"
import { FloatingParticles, TrendingUpIcon } from "./DashboardIcons"

const StatCard = ({ icon: Icon, value, label, gradientFrom, gradientTo, trend, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className="overflow-hidden relative rounded-xl opacity-0 translate-y-8 group perspective-1000 animate-fade-in-up"
      style={{ 
        animationDelay: `${delay * 100}ms`,
        animationFillMode: 'forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-6 h-full bg-white rounded-xl border-2 border-gray-100 shadow-lg transition-all duration-500 cursor-pointer hover:shadow-2xl hover:border-transparent hover:-translate-y-2 hover:scale-105">
        <div className={`absolute inset-0 bg-gradient-to-br rounded-xl opacity-0 transition-opacity duration-500 ${gradientFrom} ${gradientTo} hover:opacity-20`} />
        {isHovered && <FloatingParticles />}
        
        <div className="flex relative justify-between items-start h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="transition-all duration-500 transform hover:scale-105">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 transition-all duration-300 hover:scale-105">
                  {label === "Average Rating" ? value : value.toLocaleString()}
                </p>
              </div>
              <p className="text-sm font-semibold tracking-wide text-gray-600 uppercase">{label}</p>
            </div>
            
            <div className="mt-2 h-5">
              {trend && (
                <div className="flex items-center text-xs font-semibold text-emerald-600 opacity-0 translate-x-4 animate-slide-in-left"
                     style={{ animationDelay: `${delay * 100 + 400}ms`, animationFillMode: 'forwards' }}>
                  <TrendingUpIcon size={14} className="mr-1" />
                  <span className="animate-pulse">
                    +{trend}% this week
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`p-4 bg-gradient-to-br rounded-2xl shadow-xl transition-all duration-300 ${gradientFrom} ${gradientTo} hover:scale-110 hover:rotate-3 hover:shadow-2xl`}>
            <Icon size={28} className="text-white" animated={isHovered} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
