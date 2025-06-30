// components/About/UpcomingFeatures.jsx
import { FaRocket, FaQuestionCircle, FaCalendarAlt, FaCog, FaBolt } from "react-icons/fa"
import { studentsStudying, homeHero, navLogo } from '../../assets/images';

const UpcomingFeatures = () => {
  const upcomingFeatures = [
    { icon: FaRocket, title: "Enhanced Collaboration Tools", color: "text-blue-500" },
    { icon: FaQuestionCircle, title: "Interactive Q&A Forums", color: "text-purple-500" },
    { icon: FaCalendarAlt, title: "Study Group Scheduling", color: "text-green-500" },
    { icon: FaCog, title: "Personalized Learning Paths", color: "text-red-500" },
  ]

  return (
    <div className="overflow-hidden relative p-12 mx-auto text-white bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl from-blue-400/10 to-purple-500/10"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch min-h-[500px] max-w-7xl mx-auto">
        <div className="flex flex-col justify-center">
          <div className="flex gap-3 items-center mb-6">
            <FaRocket className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl font-black md:text-5xl">
              Upcoming{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Features
              </span>
            </h2>
          </div>
          <p className="mb-8 text-xl leading-relaxed text-gray-300">
            We are constantly working to improve NoteBank. Here are some features you can look forward to:
          </p>

          <div className="space-y-6">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 items-center p-4 rounded-xl backdrop-blur-sm transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-105 group"
              >
                <div className="p-2 rounded-lg transition-transform duration-300 bg-white/20 group-hover:scale-110">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <span className="text-lg font-medium">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex relative justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-br rounded-2xl blur-2xl from-blue-400/20 to-purple-500/20"></div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl w-full h-full min-h-[400px] flex items-center justify-center">
            <div className="flex relative justify-center items-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600">
              <FaRocket className="w-64 h-64 text-white drop-shadow-2xl animate-pulse" />

              {/* Floating particles effect */}
              <div className="absolute top-8 left-8 w-4 h-4 rounded-full animate-bounce bg-white/30"></div>
              <div className="absolute right-12 top-16 w-3 h-3 rounded-full animate-pulse bg-blue-300/40"></div>
              <div className="absolute bottom-12 left-16 w-2 h-2 rounded-full animate-ping bg-purple-300/50"></div>
              <div className="absolute right-8 bottom-8 w-5 h-5 rounded-full animate-bounce bg-white/20 animation-delay-1000"></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t to-transparent from-blue-900/40"></div>
            <div className="absolute right-4 bottom-4 left-4">
              <div className="p-3 rounded-lg backdrop-blur-sm bg-white/90">
                <div className="flex gap-2 items-center">
                  <FaBolt className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Innovation in Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcomingFeatures