"use client";

import { motion } from 'framer-motion';
import { EndpointStatus } from '@/types/syntx';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/config/endpoints';

interface EndpointStatsPanelProps {
  statuses: Record<string, EndpointStatus>;
  totalEndpoints: number;
  checkingAll: boolean;
  onCheckAll: () => void;
}

export function EndpointStatsPanel({ statuses, totalEndpoints, checkingAll }: EndpointStatsPanelProps) {
  const [syntxScore, setSyntxScore] = useState<number | null>(null);
  const [normalScore, setNormalScore] = useState<number | null>(null);

  const statusValues = Object.values(statuses);
  const online = statusValues.filter(s => s.online === true).length;
  const offline = statusValues.filter(s => s.online === false).length;
  const checked = online + offline;
  const successRate = checked > 0 ? Math.round((online / checked) * 100) : 0;

  useEffect(() => {
    fetch(`${BASE_URL}/evolution/syntx-vs-normal`)
      .then(res => res.json())
      .then(d => {
        setSyntxScore(d.syntx_prompts?.avg_score || 0);
        setNormalScore(d.normal_prompts?.avg_score || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0f141a] to-[#111820]" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      
      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ 
          background: 'linear-gradient(90deg, #00ffff, #00ff88, #00ffff)',
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude'
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative p-5">
        {/* Glowing Orbs Background */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffff]/20 to-[#00ff88]/20 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-xl">⚡</span>
            </motion.div>
            <div>
              <h3 className="text-sm font-bold text-white">System Status</h3>
              <p className="text-[10px] text-[#4a5568]">Real-time monitoring</p>
            </div>
          </div>
          {checkingAll && (
            <motion.div
              className="px-3 py-1 rounded-full bg-[#ffaa00]/20 text-[#ffaa00] text-[10px] font-semibold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              SCANNING...
            </motion.div>
          )}
        </div>

        {/* Big Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Online */}
          <motion.div
            className="relative p-4 rounded-xl bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/20 text-center overflow-hidden"
            whileHover={{ scale: 1.03, borderColor: 'rgba(0,255,136,0.4)' }}
          >
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00ff88]"
              animate={{ opacity: [1, 0.3, 1], boxShadow: ['0 0 5px #00ff88', '0 0 15px #00ff88', '0 0 5px #00ff88'] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="text-3xl font-black text-[#00ff88]"
              style={{ fontFamily: 'Orbitron' }}
              key={online}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {online}
            </motion.div>
            <div className="text-[9px] text-[#00ff88]/60 uppercase tracking-wider mt-1">Online</div>
          </motion.div>

          {/* Offline */}
          <motion.div
            className="relative p-4 rounded-xl bg-gradient-to-br from-[#ff4466]/10 to-transparent border border-[#ff4466]/20 text-center overflow-hidden"
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,68,102,0.4)' }}
          >
            {offline > 0 && (
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff4466]"
                animate={{ opacity: [1, 0.3, 1], boxShadow: ['0 0 5px #ff4466', '0 0 15px #ff4466', '0 0 5px #ff4466'] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            <motion.div
              className="text-3xl font-black text-[#ff4466]"
              style={{ fontFamily: 'Orbitron' }}
            >
              {offline}
            </motion.div>
            <div className="text-[9px] text-[#ff4466]/60 uppercase tracking-wider mt-1">Offline</div>
          </motion.div>

          {/* Total */}
          <motion.div
            className="relative p-4 rounded-xl bg-gradient-to-br from-[#00ffff]/10 to-transparent border border-[#00ffff]/20 text-center"
            whileHover={{ scale: 1.03, borderColor: 'rgba(0,255,255,0.4)' }}
          >
            <motion.div
              className="text-3xl font-black"
              style={{ 
                fontFamily: 'Orbitron',
                background: 'linear-gradient(135deg, #00ffff, #00ff88)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {totalEndpoints}
            </motion.div>
            <div className="text-[9px] text-[#00ffff]/60 uppercase tracking-wider mt-1">Total</div>
          </motion.div>
        </div>

        {/* Success Rate */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">Health Score</span>
            <motion.span
              className="text-lg font-bold"
              style={{ color: successRate > 80 ? '#00ff88' : successRate > 50 ? '#ffaa00' : '#ff4466' }}
            >
              {successRate}%
            </motion.span>
          </div>
          <div className="h-3 bg-[#1a2030] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{ 
                background: successRate > 80 
                  ? 'linear-gradient(90deg, #00ff88, #00ffff)' 
                  : successRate > 50 
                  ? 'linear-gradient(90deg, #ffaa00, #ff8800)'
                  : 'linear-gradient(90deg, #ff4466, #ff6688)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>

        {/* SYNTX vs Normal Score */}
        {syntxScore !== null && (
          <div className="p-4 rounded-xl bg-[#0a0d12] border border-[#1a2030]">
            <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-3">SYNTX Performance</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#00ffff]/60 mb-1">SYNTX Avg</div>
                <motion.div
                  className="text-2xl font-black text-[#00ffff]"
                  style={{ fontFamily: 'Orbitron' }}
                >
                  {syntxScore?.toFixed(1)}
                </motion.div>
              </div>
              <div className="text-2xl text-[#2a3040]">vs</div>
              <div className="text-right">
                <div className="text-[10px] text-[#4a5568] mb-1">Normal Avg</div>
                <div className="text-2xl font-bold text-[#4a5568]" style={{ fontFamily: 'Orbitron' }}>
                  {normalScore?.toFixed(1)}
                </div>
              </div>
            </div>
            {syntxScore && normalScore && (
              <motion.div
                className="mt-3 text-center py-2 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-[#00ff88] font-bold">+{(syntxScore - normalScore).toFixed(1)}</span>
                <span className="text-[10px] text-[#00ff88]/60 ml-2">better performance</span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
