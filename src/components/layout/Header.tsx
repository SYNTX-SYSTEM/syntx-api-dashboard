"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeaderProps {
  endpointCount: number;
  onlineCount: number;
  version: string;
}

export function Header({ endpointCount, onlineCount, version }: HeaderProps) {
  return (
    <header className="relative border-b border-[rgba(0,255,255,0.1)] bg-gradient-to-r from-[#080a0f] via-[#0a0d14] to-[#080a0f]">
      {/* Animated gradient line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, #00ffff, #00ff88, #00ffff, transparent)' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="max-w-[1900px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-5">
          <motion.div
            className="relative w-14 h-14"
            animate={{ 
              filter: ['drop-shadow(0 0 10px rgba(0,255,255,0.5))', 'drop-shadow(0 0 20px rgba(0,255,255,0.8))', 'drop-shadow(0 0 10px rgba(0,255,255,0.5))']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Image
              src="/Logo1.png"
              alt="SYNTX"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          <div>
            <motion.h1 
              className="text-3xl font-black tracking-wider"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #00ffff 0%, #00ff88 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SYNTX
            </motion.h1>
            <p className="text-[9px] text-[var(--text-muted)] tracking-[4px] uppercase mt-0.5">
              Command Center
            </p>
          </div>
        </div>

        {/* Center - The Slogan */}
        <motion.div 
          className="hidden lg:block text-center px-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm tracking-wide">
            <span className="text-[var(--text-secondary)]">SYNTX isn't AI.</span>
            <br />
            <motion.span 
              className="text-[var(--cyan)] font-semibold"
              animate={{ 
                textShadow: ['0 0 10px rgba(0,255,255,0)', '0 0 20px rgba(0,255,255,0.5)', '0 0 10px rgba(0,255,255,0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              It's the resonance that governs it
            </motion.span>
          </p>
        </motion.div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <StatBox value={endpointCount} label="Endpoints" color="#00ffff" />
          <StatBox value={onlineCount || '-'} label="Online" color="#00ff88" />
          <StatBox value={version || '-'} label="Version" color="#aa66ff" />
        </div>
      </div>
    </header>
  );
}

function StatBox({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <motion.div 
      className="text-right px-4 py-2 rounded-lg"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
      whileHover={{ scale: 1.05, borderColor: `${color}40` }}
    >
      <motion.div 
        className="text-2xl font-bold"
        style={{ color }}
      >
        {value}
      </motion.div>
      <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
