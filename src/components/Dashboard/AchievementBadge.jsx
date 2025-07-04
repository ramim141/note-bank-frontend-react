"use client"

// components/dashboard/AchievementBadge.jsx

import { TrophyIcon, FireIcon, StarIcon, LightbulbIcon } from "./DashboardIcons"

const AchievementBadge = ({ type, title, description, progress, delay = 0 }) => {
  const getIcon = () => {
    switch (type) {
      case "trophy":
        return TrophyIcon
      case "fire":
        return FireIcon
      case "star":
        return StarIcon
      case "lightbulb":
        return LightbulbIcon
      default:
        return StarIcon
    }
  }

  const getGradient = () => {
    switch (type) {
      case "trophy":
        return "from-yellow-400 to-orange-500"
      case "fire":
        return "from-red-400 to-pink-500"
      case "star":
        return "from-purple-400 to-indigo-500"
      case "lightbulb":
        return "from-green-400 to-teal-500"
      default:
        return "from-blue-400 to-purple-500"
    }
  }

  const Icon = getIcon()

  return (
    <div
      className="overflow-hidden relative p-4 bg-white rounded-2xl border border-gray-100 shadow-lg opacity-0 transition-all duration-300 scale-90 translate-y-5 cursor-pointer group animate-fade-in-up hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
      style={{ 
        animationDelay: `${delay * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${getGradient()} group-hover:opacity-10`} />

      <div className="flex relative gap-3 items-center">
        <div className={`p-3 bg-gradient-to-br rounded-xl shadow-lg transition-all duration-300 ${getGradient()} hover:rotate-6 hover:scale-110`}>
          <Icon size={20} className="text-white" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 opacity-0 -translate-x-2 animate-slide-in-left"
              style={{ animationDelay: `${delay * 100 + 200}ms`, animationFillMode: 'forwards' }}>
            {title}
          </h4>
          <p className="mt-1 text-xs text-gray-600 opacity-0 -translate-x-2 animate-slide-in-left"
             style={{ animationDelay: `${delay * 100 + 300}ms`, animationFillMode: 'forwards' }}>
            {description}
          </p>

          {progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${progress}%`,
                    animationDelay: `${delay * 100 + 500}ms`
                  }}
                />
              </div>
              <span className="block mt-1 text-xs text-gray-500 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay * 100 + 700}ms`, animationFillMode: 'forwards' }}>
                {progress}% Complete
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementBadge
