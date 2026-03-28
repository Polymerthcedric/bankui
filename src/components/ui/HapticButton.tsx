'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HapticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const HapticButton: React.FC<HapticButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  disabled = false 
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative active:opacity-90 ${className}`}
    >
      {children}
    </motion.button>
  );
};
