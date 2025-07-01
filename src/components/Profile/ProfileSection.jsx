// src/components/Profile/ProfileSection.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const ProfileSection = ({ title, icon: Icon, children, className }) => {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center mb-4">
        {Icon && <Icon className="mr-3 w-8 h-8 text-purple-400" />}
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;