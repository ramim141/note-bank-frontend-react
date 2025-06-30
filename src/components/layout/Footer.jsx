"use client"

import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Lightbulb,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Send,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("animated-footer");
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
      observer.disconnect();
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="animated-footer" className="overflow-hidden relative mt-20 font-sans text-white bg-gradient-to-br via-blue-900 from-slate-900 to-slate-900">
      <div className="overflow-hidden absolute inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse bg-blue-500/10"></div>
        <div className="absolute -right-40 -bottom-40 w-80 h-80 rounded-full blur-3xl delay-1000 animate-pulse bg-purple-500/10"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500/5 animate-spin-slow"></div>
      </div>

      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative px-6 py-16 lg:px-32">
        <div className={`px-4 mx-auto max-w-7xl md:px-8 lg:px-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex flex-col gap-8 justify-between items-center mx-auto md:flex-row">
            <div className="flex items-center text-center md:text-left group">
              <div className="relative mr-4">
                <div className="absolute inset-0 rounded-full blur-xl transition-all duration-500 bg-yellow-400/20 group-hover:blur-2xl"></div>
                <Lightbulb className="relative z-10 w-16 h-16 text-yellow-400 transition-transform duration-300 group-hover:scale-110" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 md:text-3xl sm: lg:text-4xl">
                  Subscribe to our Newsletter
                </h3>
                <p className="mt-2 text-xl text-blue-200">Get the latest updates and exclusive content</p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto group">
              <div className="relative flex-1 md:w-80">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-6 py-4 w-full placeholder-blue-200 text-white rounded-l-2xl border backdrop-blur-sm transition-all duration-300 bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent group-hover:bg-white/15"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r rounded-l-2xl opacity-0 transition-opacity duration-300 pointer-events-none from-blue-500/20 to-purple-500/20 group-hover:opacity-100"></div>
              </div>
              <button
                type="submit"
                className="flex gap-2 items-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-2xl transition-all duration-300 transform hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative px-6 pt-16 pb-8 lg:px-32">
        <div className="px-4 mx-auto max-w-7xl md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="flex items-center mb-6 group">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl opacity-75 blur-sm transition-all duration-300 animate-pulse group-hover:opacity-100"></div>
                  <div className="flex relative justify-center items-center w-12 h-12 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl shadow-lg transition-all duration-300 transform group-hover:rotate-12">
                    <span className="text-xl font-black text-white drop-shadow-lg">N</span>
                  </div>
                </div>
                <h5 className="text-3xl font-bold tracking-wide">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">NOTE</span>
                  <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">BANK</span>
                </h5>
              </div>
              <p className="mb-6 text-lg leading-relaxed text-blue-200">
                Fulfill your study goals with NoteBank. Advanced resources and expert guidance.
              </p>
              <h6 className="mb-4 font-semibold text-white">Follow us:</h6>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600", url: "https://www.facebook.com/ramim141" },
                  { icon: Twitter, color: "hover:bg-sky-500", url: "#" },
                  { icon: Linkedin, color: "hover:bg-blue-700", url: "https://www.linkedin.com/company/ramim-ahmed" },
                  { icon: Youtube, color: "hover:bg-red-600", url: "https://www.youtube.com/@codewithramuu" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                  >
                    <social.icon className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h6 className="relative pb-3 mb-6 text-2xl font-semibold text-white">
                Useful Links
                <span className="block absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
              </h6>
              <ul className="space-y-3">
                {["Home", "About Us", "Courses", "Category", "Pricing", "Contact"].map((link, index) => (
                  <li key={index} className="group">
                    <a
                      href="#"
                      className="flex items-center text-blue-200 transition-all duration-300 hover:text-white group-hover:translate-x-2"
                    >
                      <span className="w-0 h-0.5 bg-blue-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h6 className="relative pb-3 mb-6 text-2xl font-semibold text-white">
                Resources
                <span className="block absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
              </h6>
              <ul className="space-y-3">
                {["Community", "Support", "Video Guide", "Terms", "Blog", "Security"].map((link, index) => (
                  <li key={index} className="group">
                    <a
                      href="#"
                      className="flex items-center text-blue-200 transition-all duration-300 hover:text-white group-hover:translate-x-2"
                    >
                      <span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h6 className="relative pb-3 mb-6 text-2xl font-semibold text-white">
                Contact
                <span className="block absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
              </h6>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <MapPin className="flex-shrink-0 mt-1 mr-3 w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-blue-200 transition-colors duration-300 group-hover:text-white">
                    5 Arambagh
                    <br />
                    Sylhet, Bangladesh
                  </span>
                </li>
                <li className="flex items-center group">
                  <Phone className="flex-shrink-0 mr-3 w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-blue-200 transition-colors duration-300 group-hover:text-white">
                    +880 1768628911
                  </span>
                </li>
                <li className="flex items-center group">
                  <Mail className="flex-shrink-0 mr-3 w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-blue-200 transition-colors duration-300 group-hover:text-white">
                    notebanksupport@gmail.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`relative pt-8 pb-8 mt-8 text-center border-t border-white/10 backdrop-blur-sm transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-blue-300">© Copyright 2024 NoteBank. All rights reserved.</p>
        <button
          onClick={scrollToTop}
          className="flex fixed right-8 bottom-8 z-50 justify-center items-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transition-all duration-300 transform hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-y-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
