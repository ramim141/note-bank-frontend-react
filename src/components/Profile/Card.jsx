// src/components/ui/Card.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className, title, icon: Icon }) => {
  return (
    <div
      className={cn(
        'p-6 rounded-xl border shadow-lg backdrop-blur-lg bg-white/10 border-white/20',
        className
      )}
    >
      {title && (
        <div className="flex items-center mb-4">
          {Icon && <Icon className="mr-3 w-8 h-8 text-purple-400" />}
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

const CardHeader = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const CardContent = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const CardFooter = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export default Card;

export { Card, CardHeader, CardContent, CardFooter };