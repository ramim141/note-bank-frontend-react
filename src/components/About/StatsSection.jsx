// components/About/StatsSection.jsx
import { div } from "framer-motion/client"
import { FaUsers, FaBookOpen, FaAward, FaChartLine } from "react-icons/fa"

const StatsSection = () => {
  const stats = [
    { icon: FaUsers, value: "10K+", label: "Active Students" },
    { icon: FaBookOpen, value: "50K+", label: "Notes Shared" },
    { icon: FaAward, value: "95%", label: "Success Rate" },
    { icon: FaChartLine, value: "24/7", label: "Support" },
  ]

  return (
    <div className="px-8 sm:">
      <div className="grid grid-cols-2 gap-6 pb-8 mx-auto mb-12 max-w-4xl md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 group bg-white/80 hover:shadow-xl hover:scale-105"
        >
          <stat.icon className="mx-auto mb-3 w-8 h-8 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
          <div className="mb-1 text-3xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
    </div>
    
  )
}

export default StatsSection