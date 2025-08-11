// src/components/Profile/ProfileDetails.jsx
import React from 'react';
import ProfileAvatar from '../../components/Profile/Avatar'; 
import { Badge } from './badge.jsx'; 
import { BookOpen, Bookmark, User, Mail, Phone, Wifi, Calendar, MapPin, GraduationCap, Building, Award, Book } from 'lucide-react'; // Assuming you have these icons

// Import your apiService
import { getUserProfile, updateUserProfile } from '/src/api/apiService/userService.js';

const ProfileDetails = () => {
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* You might have a Spinner component from UI */}
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const userInitials = profileData?.first_name
    ? `${profileData.first_name[0]}${profileData.last_name ? profileData.last_name[0] : ''}`
    : 'RA'; 

  return (
    <div className="flex flex-col gap-6 items-center mb-8 md:flex-row">
      <ProfileAvatar
        profilePictureUrl={profileData?.profile_picture_url}
        initials={userInitials}
        rating={profileData?.total_notes_liked_by_others !== undefined ? profileData.total_notes_liked_by_others : 0} 
        className="w-32 h-32 md:w-40 md:h-40"
      />
      <div className="text-center md:text-left">
        <h1 className="mb-2 text-4xl font-bold text-white">{profileData?.first_name} {profileData?.last_name}</h1>
        <p className="mb-3 text-xl text-purple-300">@{profileData?.username}</p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Badge label="Notes Uploaded" value={profileData?.total_notes_uploaded ?? 0} icon={BookOpen} />
          <Badge label="Bookmarks" value={profileData?.total_bookmarked_notes_by_user ?? 0} icon={Bookmark} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;