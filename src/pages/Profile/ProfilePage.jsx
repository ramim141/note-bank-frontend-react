// src/components/Profile/ProfilePage.jsx
import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import ProfileDetails from "../../components/Profile/ProfileDetails";
import ProfileEditForm from "../../components/Profile/ProfileEditForm";
import ProfileSection from "../../components/Profile/ProfileSection";
import Button from "../../components/ui/Button";
import { FaBookmark } from 'react-icons/fa';

// Import icons for sections
import { User, Mail, Phone, GraduationCap, Building, Book, Calendar, MapPin, Award, BookOpen } from 'lucide-react';

// Assuming your apiService is available
import { getUserProfile } from '/src/api/apiService/userService.js';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null); // To pass down to EditForm
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getUserProfile();
        setProfileData(profile);
      } catch (err) {
        console.error("Error fetching profile for page:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    // Optionally refetch profile data after editing
    // fetchProfile();
  };

  // --- Function to render different sections ---
  const renderContactInfo = () => (
    <>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-green-400 to-teal-400 rounded-lg">
        <Mail className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Email</span>
          <span className="text-lg font-bold">{profileData?.email || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
        <Phone className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Mobile</span>
          <span className="text-lg font-bold">{profileData?.mobile_number || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
        <User className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Username</span>
          <span className="text-lg font-bold">@{profileData?.username || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-lg">
        <User className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Name</span>
          <span className="text-lg font-bold">{profileData?.first_name || ''} {profileData?.last_name || ''}</span>
        </div>
      </div>
    </>
  );

  const renderEducationInfo = () => (
    <>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg">
        <GraduationCap className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">University</span>
          <span className="text-lg font-bold">{profileData?.university || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
        <Building className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Department</span>
          <span className="text-lg font-bold">{profileData?.department_name || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
        <Calendar className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Student ID</span>
          <span className="text-lg font-bold">{profileData?.student_id || 'Not set'}</span>
        </div>
      </div>
      <div className="flex items-center p-3 text-white bg-gradient-to-r from-green-500 to-lime-500 rounded-lg">
        <User className="mr-3 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Batch(Section)</span>
          <span className="text-lg font-bold">{profileData?.batch || ''}({profileData?.section || ''})</span>
        </div>
      </div>
    </>
  );

  const renderAcademicActivity = () => (
    <>
      <ProfileSection title="Skills">
        {profileData?.skills && profileData.skills.length > 0 ? (
          profileData.skills.map((skill, index) => (
            <div key={index} className="flex items-center p-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Award className="mr-3 w-6 h-6" />
              <span className="text-lg font-bold capitalize">{skill}</span>
            </div>
          ))
        ) : (
          <div className="p-3 italic text-white/80">No skills added yet.</div>
        )}
      </ProfileSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center p-4 space-y-2 text-center rounded-lg backdrop-blur-sm bg-white/20">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <div className="text-3xl font-bold text-white">{profileData?.total_notes_uploaded ?? 0}</div>
          <div className="text-sm font-medium text-purple-200">Notes Uploaded</div>
        </div>
        <div className="flex flex-col items-center p-4 space-y-2 text-center rounded-lg backdrop-blur-sm bg-white/20">
          <FaBookmark className="w-8 h-8 text-purple-400" />
          <div className="text-3xl font-bold text-white">{profileData?.total_bookmarked_notes_by_user ?? 0}</div>
          <div className="text-sm font-medium text-purple-200">Bookmarks</div>
        </div>
        <div className="flex flex-col items-center p-4 space-y-2 text-center rounded-lg backdrop-blur-sm bg-white/20">
          <Award className="w-8 h-8 text-purple-400" />
          <div className="text-3xl font-bold text-white">{profileData?.total_notes_liked_by_others ?? 0}</div>
          <div className="text-sm font-medium text-purple-200">Total Likes</div>
        </div>
        {/* Add other stats like Total Reviews, Avg Rating if available */}
      </div>
    </>
  );

  // --- Main Page Layout ---
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="p-6 mb-8 bg-gradient-to-br rounded-xl border backdrop-blur-xl from-purple-700/50 to-blue-700/50 border-purple-600/40">
          <h2 className="mb-2 text-4xl font-extrabold text-white">Profile Dashboard</h2>
          <p className="text-xl text-purple-200">Welcome back, <span className="font-bold text-purple-400">{profileData?.first_name || 'User'}!</span></p>
        </div>

        {/* Content Area */}
        {!isEditing ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Sidebar - User Details */}
            <div className="lg:col-span-1">
              <ProfileDetails />
              <div className="flex justify-center mt-8">
                <Button onClick={handleEditClick} className="px-8 py-3 text-lg">
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Right Content - Information Sections */}
            <div className="lg:col-span-2">
              <ProfileSection title="Contact Information" icon={Mail}>
                {renderContactInfo()}
              </ProfileSection>

              <ProfileSection title="Education" icon={GraduationCap}>
                {renderEducationInfo()}
              </ProfileSection>

              <ProfileSection title="Academic Activity" icon={Book}>
                {renderAcademicActivity()}
              </ProfileSection>
            </div>
          </div>
        ) : (
          // Edit Form View
          <div className="mx-auto max-w-3xl">
            <ProfileEditForm initialData={profileData} onClose={handleCloseEdit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;