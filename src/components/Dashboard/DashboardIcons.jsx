"use client"


export const BookIcon = ({ size = 24, className = "", animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 ${className} ${animated ? "animate-pulse" : ""}`}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
    <path d="M6 2h14v15H6z" />
  </svg>
)

export const DownloadIcon = ({ size = 24, className = "", animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:-translate-y-1 ${className} ${animated ? "animate-bounce" : ""}`}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const HeartIcon = ({ size = 24, className = "", animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 hover:scale-110 ${className} ${animated ? "animate-pulse" : ""}`}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const BookmarkIcon = ({ size = 24, className = "", animated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 hover:rotate-3 ${className} ${animated ? "animate-pulse" : ""}`}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

export const PlusIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:rotate-180 ${className}`}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const ArrowRightIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:translate-x-1 ${className}`}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
)

export const TrendingUpIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 ${className}`}
  >
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
)

export const SparklesIcon = ({ size = 24, className = "", animated = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 ${className} ${animated ? "animate-spin" : ""}`}
    style={{ animationDuration: animated ? "8s" : "none" }}
  >
    <path d="M12 0l1.09 3.09L16 2l-1.09 3.09L18 6l-3.09 1.09L16 10l-3.09-1.09L12 12l-1.09-3.09L8 10l1.09-3.09L6 6l3.09-1.09L8 2l3.09 1.09L12 0z" />
    <path d="M19 10l.5 1.5L21 11l-1.5.5L19 13l-.5-1.5L17 11l1.5-.5L19 10z" />
    <path d="M5 16l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 16z" />
  </svg>
)

export const AwardIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:scale-110 hover:rotate-3 ${className}`}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
  </svg>
)

export const StarIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 hover:rotate-12 hover:scale-110 ${className}`}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

export const UserIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:-translate-y-1 ${className}`}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const ActivityIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 animate-pulse ${className}`}
  >
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
)

export const TargetIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:scale-110 ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

export const UsersIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:scale-105 ${className}`}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const PieChartIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 animate-spin ${className}`}
    style={{ animationDuration: "20s" }}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

export const MessageSquareIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:-translate-y-1 ${className}`}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export const TrophyIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 hover:scale-110 hover:rotate-3 ${className}`}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

export const FireIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`transition-all duration-300 animate-pulse hover:scale-110 ${className}`}
  >
    <path d="M8.5 2c1.4 0 2.5 1.1 2.5 2.5S9.9 7 8.5 7 6 5.9 6 4.5 7.1 2 8.5 2zm7 4.5c0-1.4-1.1-2.5-2.5-2.5S10.5 5.1 10.5 6.5 11.6 9 13 9s2.5-1.1 2.5-2.5zM12 22c-4.4 0-8-3.6-8-8 0-2.8 1.5-5.4 4-6.8.3-.2.7-.1.9.2.2.3.1.7-.2.9-2 1.1-3.2 3.2-3.2 5.7 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2.5-1.2-4.6-3.2-5.7-.3-.2-.4-.6-.2-.9.2-.3.6-.4.9-.2 2.5 1.4 4 4 4 6.8 0 4.4-3.6 8-8 8z" />
  </svg>
)

export const LightbulbIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-all duration-300 animate-pulse ${className}`}
  >
    <path d="M9 21h6" />
    <path d="M12 17h.01" />
    <path d="M12 3a6 6 0 0 1 6 6c0 1.7-.7 3.2-1.8 4.3L15 15H9l-1.2-1.7C6.7 12.2 6 10.7 6 9a6 6 0 0 1 6-6z" />
  </svg>
)

export const FloatingParticles = () => (
  <div className="overflow-hidden absolute inset-0 pointer-events-none">
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
        }}
      />
    ))}
  </div>
)