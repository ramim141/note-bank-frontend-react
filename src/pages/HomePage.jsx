"use client";

// কম্পোনেন্টগুলি ইম্পোর্ট করুন
import HeroSection from "../components/section/HeroSection"; // হিরো সেকশন
import FeaturesSection from "../components/section/FeaturesSection"; // ফিচার সেকশন
import RequestNoteSection from "../components/section/RequestNoteSection"; // নোট রিকোয়েস্ট সেকশন
import StrengthSection from "../components/section/StrengthSection";
const HomePage = () => {
  // Since NotesSection handles its own data fetching, we don't need these states
  // const [popularNotes, setPopularNotes] = useState([]);
  // const [notesLoading, setNotesLoading] = useState(true);
  // const [notesError, setNotesError] = useState(null);

  // This useEffect is no longer needed since NotesSection handles its own data fetching
  // useEffect(() => {
  //   const fetchPopularNotes = async () => {
  //     setNotesLoading(true);
  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 1000)); 
  //       const response = await api.get("/api/notes/?ordering=-created_at&limit=4");
  //       setPopularNotes(response.data.results || []);
  //     } catch (err) {
  //       console.error("হোমপেজের জন্য নোট ফেচ করতে সমস্যা হয়েছে:", err);
  //       setNotesError(err.message || "নোট লোড করতে ব্যর্থ। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
  //     } finally {
  //       setNotesLoading(false);
  //     }
  //   };

  //   fetchPopularNotes();
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* হিরো সেকশন */}
      <HeroSection />

      {/* ফিচার সেকশন */}
      <FeaturesSection />
      <StrengthSection />

      {/* রিকোয়েস্ট নোট সেকশন */}
      {/* এটি শুধুমাত্র লগইন করা ব্যবহারকারীদের জন্য প্রদর্শিত হবে */}
      <RequestNoteSection />
    </div>
  );
};

export default HomePage;