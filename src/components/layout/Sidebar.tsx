"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { endpoints, categories, Endpoint, BASE_URL } from '@/config/endpoints';
import { EndpointStatus } from '@/types/syntx';

interface SidebarProps {
  statuses: Record<string, EndpointStatus>;
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (ep: Endpoint) => void;
  onCheckAll: () => void;
  checkingAll: boolean;
}

interface EndpointMetrics {
  responseTime?: number;
  lastCheck?: Date;
  size?: number;
}

export function Sidebar({ statuses, selectedEndpoint, onSelectEndpoint, onCheckAll, checkingAll }: SidebarProps) {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Record<string, EndpointMetrics>>({});
  const [firingEndpoint, setFiringEndpoint] = useState<string | null>(null);

  async function fireEndpoint(ep: Endpoint, e: React.MouseEvent) {
    e.stopPropagation();
    setFiringEndpoint(ep.path);
    const start = performance.now();
    
    try {
      const res = await fetch(`${BASE_URL}${ep.path}`, { method: ep.method });
      const data = await res.json();
      const responseTime = Math.round(performance.now() - start);
      
      setMetrics(prev => ({
        ...prev,
        [ep.path]: {
          responseTime,
          lastCheck: new Date(),
          size: JSON.stringify(data).length
        }
      }));
      onSelectEndpoint(ep);
    } catch (err) {
      console.error(err);
    }
    
    setFiringEndpoint(null);
  }

  function toggleExpand(path: string) {
    setExpandedEndpoint(expandedEndpoint === path ? null : path);
  }

  return (
    <aside className="bg-[#080a0d] border border-[#151a22] rounded-2xl overflow-hidden flex flex-col">
      {/* Animated Header */}
      <div className="p-4 border-b border-[#151a22] relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/5 via-[#00ff88]/5 to-[#00ffff]/5"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.button
          onClick={onCheckAll}
          disabled={checkingAll}
          className="relative w-full py-4 rounded-xl font-bold text-sm overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #00ffff15, #00ff8815)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, #00ffff30, transparent)' }}
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative flex items-center justify-center gap-2 text-[#00ffff]">
            {checkingAll ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚡</motion.span>
                Scanning All...
              </>
            ) : (
              <>🚀 Fire All Endpoints</>
            )}
          </span>
        </motion.button>
      </div>

      {/* Scrollable Endpoint List */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((cat, catIndex) => {
          const catEndpoints = endpoints.filter(ep => ep.category === cat.id);
          if (catEndpoints.length === 0) return null;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.05 }}
              className="border-b border-[#151a22] last:border-b-0"
            >
              {/* Category Header */}
              <div className="px-4 py-3 flex items-center gap-2 bg-[#0a0d10]">
                <span className="text-base">{cat.icon}</span>
                <span className="text-[11px] text-[#3a4550] uppercase tracking-[2px] font-semibold">{cat.name}</span>
                <span className="ml-auto text-[10px] text-[#2a3040] bg-[#151a22] px-2 py-0.5 rounded-full">
                  {catEndpoints.length}
                </span>
              </div>

              {/* Endpoints */}
              <div className="px-2 py-2 space-y-1">
                {catEndpoints.map((ep, epIndex) => {
                  const status = statuses[ep.path];
                  const isExpanded = expandedEndpoint === ep.path;
                  const isSelected = selectedEndpoint?.path === ep.path;
                  const isFiring = firingEndpoint === ep.path;
                  const epMetrics = metrics[ep.path];
                  const isOnline = status?.online === true;
                  const isOffline = status?.online === false;

                  return (
                    <motion.div
                      key={ep.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.05 + epIndex * 0.02 }}
                    >
                      {/* Endpoint Row */}
                      <motion.div
                        onClick={() => toggleExpand(ep.path)}
                        className={`relative px-3 py-3 rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'bg-[#00ffff10] border border-[#00ffff30]' : 'hover:bg-[#10151a] border border-transparent'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Status Indicator */}
                          <div className="relative">
                            {isFiring ? (
                              <motion.div
                                className="w-4 h-4 rounded-full bg-[#ffaa00]"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 0.3, repeat: Infinity }}
                                style={{ boxShadow: '0 0 15px #ffaa00' }}
                              />
                            ) : isOnline ? (
                              <motion.div
                                className="w-4 h-4 rounded-full bg-[#00ff88]"
                                animate={{ boxShadow: ['0 0 8px #00ff88', '0 0 20px #00ff88', '0 0 8px #00ff88'] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            ) : isOffline ? (
                              <motion.div
                                className="w-4 h-4 rounded-full bg-[#ff4466]"
                                animate={{ boxShadow: ['0 0 8px #ff4466', '0 0 20px #ff4466', '0 0 8px #ff4466'] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-[#1a2030] border-2 border-[#2a3545]" />
                            )}
                          </div>

                          {/* Method & Path */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                ep.method === 'GET' ? 'bg-[#00ff8820] text-[#00ff88]' : 'bg-[#00ffff20] text-[#00ffff]'
                              }`}>
                                {ep.method}
                              </span>
                              <span className="text-xs text-[#8a95a5] truncate">{ep.path}</span>
                            </div>
                            {epMetrics?.responseTime && (
                              <div className="text-[10px] text-[#3a4550] mt-1">
                                {epMetrics.responseTime}ms • {formatBytes(epMetrics.size || 0)}
                              </div>
                            )}
                          </div>

                          {/* Expand Arrow */}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-[#3a4550]"
                          >
                            ▼
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mx-2 mb-2 p-4 bg-[#0c1015] rounded-xl border border-[#1a2030]">
                              {/* Description */}
                              <p className="text-[11px] text-[#5a6570] mb-4">{ep.description}</p>

                              {/* Metrics Grid */}
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-[#080a0d] rounded-lg p-2 text-center">
                                  <div className="text-[10px] text-[#3a4550]">Response</div>
                                  <div className="text-sm font-bold text-[#00ffff]">
                                    {epMetrics?.responseTime ? `${epMetrics.responseTime}ms` : '--'}
                                  </div>
                                </div>
                                <div className="bg-[#080a0d] rounded-lg p-2 text-center">
                                  <div className="text-[10px] text-[#3a4550]">Size</div>
                                  <div className="text-sm font-bold text-[#00ff88]">
                                    {epMetrics?.size ? formatBytes(epMetrics.size) : '--'}
                                  </div>
                                </div>
                              </div>

                              {/* Fire Button */}
                              <motion.button
                                onClick={(e) => fireEndpoint(ep, e)}
                                disabled={isFiring}
                                className="w-full py-3 rounded-xl font-bold text-sm relative overflow-hidden"
                                style={{ 
                                  background: 'linear-gradient(135deg, #00ffff, #00ff88)',
                                }}
                                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,255,0.4)' }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-white"
                                  initial={{ x: '-100%', opacity: 0.3 }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.5 }}
                                />
                                <span className="relative text-[#0a0d10] flex items-center justify-center gap-2">
                                  {isFiring ? (
                                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity }}>⚡</motion.span>
                                  ) : (
                                    <>🚀 Fire Request</>
                                  )}
                                </span>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </aside>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}
