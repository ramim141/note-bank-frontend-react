"use client"

// components/dashboard/EnhancedLoadingDashboard.jsx

const EnhancedLoadingDashboard = () => (
  <div className="flex overflow-hidden relative justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    {/* Floating Background Elements */}
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-gradient-to-r rounded-full blur-xl from-blue-400/20 to-purple-400/20 animate-float"
        style={{
          width: Math.random() * 300 + 100,
          height: Math.random() * 300 + 100,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 4 + 3}s`,
        }}
      />
    ))}
    
    <div className="z-10 text-center">
      <div className="relative mb-8">
        <div className="mx-auto w-20 h-20 rounded-full border-4 border-transparent animate-spin border-t-white border-r-white"></div>
      </div>
      
      <div className="opacity-0 translate-y-5 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <h2 className="mb-4 text-2xl font-bold text-white animate-pulse">
          Crafting Your Amazing Dashboard
        </h2>
        <p className="font-medium text-blue-200 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          Preparing something extraordinary...
        </p>
      </div>
    </div>
  </div>
)

export default EnhancedLoadingDashboard
