// src/components/Profile/Avatar.jsx
import React from 'react';
import { cn } from '../../utils/cn';
import { Star } from 'lucide-react'; // আপনি এখানে কোনো আইকন লাইব্রেরি ব্যবহার করতে পারেন, অথবা SVG থেকে ইম্পোর্ট করতে পারেন।

const ProfileAvatar = ({ profilePictureUrl, initials, rating, className }) => {
  return (
    <div className={cn('inline-block relative', className)}>
      <div
        className={cn(
          'flex overflow-hidden relative justify-center items-center w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg',
          className
        )}
      >
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt="Profile Picture"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-5xl font-bold text-white uppercase">
            {initials || '?'}
          </span>
        )}
      </div>
      {rating !== undefined && (
        <div className="absolute flex items-center px-2 py-1 text-white rounded-full shadow-lg -right-2 -bottom-2 bg-gradient-to-r from-green-400 to-teal-400">
          <Star className="w-4 h-4 mr-1" />
          <span className="text-lg font-bold">{rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;