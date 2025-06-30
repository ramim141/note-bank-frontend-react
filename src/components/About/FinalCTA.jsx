// components/About/FinalCTA.jsx
import { FaGraduationCap, FaRocket } from "react-icons/fa"

const FinalCTA = () => {
  return (
    <div className="overflow-hidden relative p-12 mt-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl md:p-16">
      <div className="absolute inset-0 opacity-10">
        <img
          src={"../../assets/images/collaboration.jpg"} // Placeholder for actual image import
          alt="Students collaborating"
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="relative z-10 text-center">
        <div className="flex gap-3 justify-center items-center mb-6">
          <FaGraduationCap className="w-12 h-12 text-white" />
          <h3 className="text-4xl font-black text-white md:text-5xl">Ready to Transform Your Learning?</h3>
        </div>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
          Join thousands of students who are already benefiting from our collaborative learning platform.
        </p>
        <a href="/">
          <button className="inline-flex gap-3 items-center px-12 py-4 text-xl font-bold text-purple-600 bg-white rounded-2xl shadow-xl transition-all duration-300 group hover:shadow-2xl hover:scale-105 hover:bg-slate-50">
            <FaRocket className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Get Started Today</span>
          </button>
        </a>
      </div>
    </div>
  )
}

export default FinalCTA