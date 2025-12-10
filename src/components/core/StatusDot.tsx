"use client";

import { motion } from 'framer-motion';

interface StatusDotProps {
  status: 'online' | 'offline' | 'loading' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusDot({ status, size = 'md' }: StatusDotProps) {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  
  const colors = {
    online: 'bg-[#00ff88]',
    offline: 'bg-[#ff4466]',
    loading: 'bg-[#ffaa00]',
    unknown: 'bg-[#666]'
  };

  return (
    <motion.div
      className={`rounded-full ${sizes[size]} ${colors[status]}`}
      animate={
        status === 'online' 
          ? { opacity: [1, 0.4, 1], boxShadow: ['0 0 8px #00ff88', '0 0 16px #00ff88', '0 0 8px #00ff88'] }
          : status === 'offline'
          ? { opacity: [1, 0.4, 1], boxShadow: ['0 0 8px #ff4466', '0 0 16px #ff4466', '0 0 8px #ff4466'] }
          : status === 'loading'
          ? { opacity: [1, 0.3, 1] }
          : {}
      }
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        boxShadow: status === 'online' ? '0 0 10px #00ff88' : status === 'offline' ? '0 0 10px #ff4466' : 'none'
      }}
    />
  );
}
