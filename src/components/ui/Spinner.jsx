// src/components/ui/Spinner.jsx
import React from 'react';
import { cn } from '../../utils/cn'; // Assuming cn is available in src/utils/cn

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const spinnerClass = `animate-spin rounded-full border-t-2 border-t-blue-500 border-solid border-blue-200 ${sizeClasses[size]} ${className}`;

  return (
    <div className={cn(spinnerClass)} role="status" aria-label="loading spinner">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;