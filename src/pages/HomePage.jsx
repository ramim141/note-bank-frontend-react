"use client";

import HeroSection from "../components/section/HeroSection"; 
import FeaturesSection from "../components/section/FeaturesSection"; 
import RequestNoteSection from "../components/section/RequestNoteSection"; 
import StrengthSection from "../components/section/StrengthSection";
const HomePage = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      <HeroSection />
      <FeaturesSection />
      <StrengthSection />
      <RequestNoteSection />
    </div>
  );
};

export default HomePage;