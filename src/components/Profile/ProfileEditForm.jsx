// src/components/Profile/ProfileEditForm.jsx
import React, { useState } from 'react';
import { cn } from '../../utils/cn'; // Utility for conditional class merging
import Button from '../ui/Button'; // Reusable Button component
import { toast } from 'react-hot-toast'; // For displaying notifications

// Import API service function for updating profile
import { updateUserProfile } from '../../api/apiService/userService'; // Correctly import updateUserProfile

const ProfileEditForm = ({ initialData, onClose, departments }) => { // Receive departments prop
  // State to manage form data, initialized with initialData
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    bio: initialData?.bio || '',
    mobile_number: initialData?.mobile_number || '',
    website: initialData?.website || '',
    // Ensure birthday is in YYYY-MM-DD format for the input type="date"
    birthday: initialData?.birthday ? initialData.birthday.split('T')[0] : '',
    gender: initialData?.gender || '',
    university: initialData?.university || '',
    // Use 'department' key, matching the formatted data from EditProfilePage
    // Check for both 'department' and 'department_name' for flexibility
    department: initialData?.department || initialData?.department_name || '',
    batch: initialData?.batch || '',
    section: initialData?.section || '',
  });

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Call the API to update the profile with the current formData
      const response = await updateUserProfile(formData); // Assuming API returns the updated user data on success
      toast.success('Profile updated successfully!'); // Show success message
      onClose(); // Close the form or modal after successful update
    } catch (err) {
      console.error('Error updating profile:', err);
      // Extract and display specific error messages from the API response
      // Check common error structures: err.response.data.detail, err.response.data.message, or generic
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-xl border shadow-lg backdrop-blur-lg bg-white/10 border-white/20">
      <h3 className="mb-4 text-2xl font-bold text-white">Edit Profile</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input Fields */}
        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-1 text-sm font-medium text-purple-300">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-purple-300">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-purple-300">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-purple-300">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Bio (Textarea) */}
        <div className="md:col-span-2">
          <label htmlFor="bio" className="block mb-1 text-sm font-medium text-purple-300">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          ></textarea>
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile_number" className="block mb-1 text-sm font-medium text-purple-300">Mobile Number</label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block mb-1 text-sm font-medium text-purple-300">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Birthday */}
        <div>
          <label htmlFor="birthday" className="block mb-1 text-sm font-medium text-purple-300">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block mb-1 text-sm font-medium text-purple-300">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select Gender</option>
            {/* Assuming backend expects capitalized strings for gender */}
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* University */}
        <div>
          <label htmlFor="university" className="block mb-1 text-sm font-medium text-purple-300">University</label>
          <input
            type="text"
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Department - Now a Dropdown */}
        <div>
          <label htmlFor="department" className="block mb-1 text-sm font-medium text-purple-300">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department} // Value should be the department ID
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select Department</option>
            {/* Safely render options only if departments is a non-empty array */}
            {Array.isArray(departments) && departments.length > 0 ? (
              departments.map(dept => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))
            ) : (
              // Show a message if departments are still loading or no departments are available
              <option value="" disabled>
                {'No departments available'}
              </option>
            )}
          </select>
        </div>

        {/* Batch */}
        <div>
          <label htmlFor="batch" className="block mb-1 text-sm font-medium text-purple-300">Batch</label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block mb-1 text-sm font-medium text-purple-300">Section</label>
          <input
            type="text"
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="p-2 w-full text-white rounded-lg border border-purple-500 bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

      </div>

      {/* Action Buttons: Cancel and Save Changes */}
      <div className="flex gap-4 justify-end mt-6">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;