// src/components/Button.jsx
import React from 'react';
import { cn } from "../../utils/cn";


const Button = ({
  children,
  className = '',
  variant = 'default', // 'default', 'outline'
  type = 'button',
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'flex items-center justify-center px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    // Add more variants if needed
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:shadow-lg';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], disabledClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;