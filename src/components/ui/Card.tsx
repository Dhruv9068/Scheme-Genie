import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100';
  const hoverClasses = hover ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-200' : '';
  
  // Check if className explicitly sets overflow
  const hasOverflowClass = className.includes('overflow-');
  const overflowClass = hasOverflowClass ? '' : 'overflow-hidden';
  
  const classes = `${baseClasses} ${hoverClasses} ${overflowClass} ${className}`;

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={classes}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </MotionCard>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 border-b border-gray-100 rounded-t-2xl ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 py-4 border-t border-gray-100 rounded-b-2xl ${className}`}>
    {children}
  </div>
);