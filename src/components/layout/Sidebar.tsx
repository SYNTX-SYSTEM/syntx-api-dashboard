"use client";

import { motion } from 'framer-motion';
import { endpoints, Endpoint } from '@/config/endpoints';
import { EndpointStatus } from '@/types/syntx';

interface SidebarProps {
  statuses: Record<string, EndpointStatus>;
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (ep: Endpoint) => void;
  onCheckAll: () => void;
  checkingAll: boolean;
}

export function Sidebar({ statuses, selectedEndpoint, onSelectEndpoint, onCheckAll, checkingAll }: SidebarProps) {
  const onlineCount = Object.values(statuses).filter(s => s.online === true).length;
  const offlineCount = Object.values(statuses).filter(s => s.online === false).length;

  return (
    <aside className="h-full flex flex-col bg-[#0a0e14] rounded-2xl border border-[#1a2535] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#1a2535]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">API Endpoints</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-[#00ff88]"
                animate={{ boxShadow: ['0 0 5px #00ff88', '0 0 15px #00ff88', '0 0 5px #00ff88'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-base text-[#00ff88] font-bold">{onlineCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff4466]" style={{ boxShadow: offlineCount > 0 ? '0 0 10px #ff4466' : 'none' }} />
              <span className="text-base text-[#ff4466] font-bold">{offlineCount}</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onCheckAll}
          disabled={checkingAll}
          className="w-full py-4 rounded-xl font-bold text-lg relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00ffff, #00ff88)' }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,255,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative text-[#0a0e14] flex items-center justify-center gap-3">
            {checkingAll ? (
              <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>⚡</motion.span> Scanning...</>
            ) : (
              <>🚀 Check All Endpoints</>
            )}
          </span>
        </motion.button>
      </div>

      {/* Endpoint Cards - Grid Layout */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {endpoints.map((ep, i) => {
            const status = statuses[ep.path];
            const isSelected = selectedEndpoint?.path === ep.path;
            const isOnline = status?.online === true;
            const isOffline = status?.online === false;
            const isLoading = status?.loading;

            return (
              <motion.button
                key={ep.path}
                onClick={() => onSelectEndpoint(ep)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`relative w-full p-4 rounded-xl text-left transition-all border ${
                  isSelected 
                    ? 'bg-[#00ffff]/10 border-[#00ffff]/50' 
                    : 'bg-[#080b10] border-[#1a2535] hover:border-[#2a3545] hover:bg-[#0c1018]'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Status Light - Top Right */}
                <div className="absolute top-4 right-4">
                  {isLoading ? (
                    <motion.div
                      className="w-4 h-4 rounded-full bg-[#ffaa00]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ boxShadow: '0 0 15px #ffaa00' }}
                    />
                  ) : isOnline ? (
                    <motion.div
                      className="w-4 h-4 rounded-full bg-[#00ff88]"
                      animate={{ boxShadow: ['0 0 5px #00ff88', '0 0 20px #00ff88', '0 0 5px #00ff88'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ) : isOffline ? (
                    <motion.div
                      className="w-4 h-4 rounded-full bg-[#ff4466]"
                      animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 5px #ff4466', '0 0 15px #ff4466', '0 0 5px #ff4466'] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#2a3545] border-2 border-[#3a4555]" />
                  )}
                </div>

                {/* Method + Path */}
                <div className="flex items-center gap-3 mb-2 pr-8">
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    ep.method === 'GET' 
                      ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                      : 'bg-[#00ffff]/20 text-[#00ffff]'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-base text-[#00ffff] font-mono font-medium">
                    {ep.path}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#8a95a5] mb-2 pr-8">
                  {ep.description}
                </p>

                {/* Status Text */}
                <div className="text-sm font-semibold">
                  {isLoading ? (
                    <span className="text-[#ffaa00]">Checking...</span>
                  ) : isOnline ? (
                    <span className="text-[#00ff88]">OK</span>
                  ) : isOffline ? (
                    <span className="text-[#ff4466]">✗ Error</span>
                  ) : (
                    <span className="text-[#5a6575]">Not checked</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
