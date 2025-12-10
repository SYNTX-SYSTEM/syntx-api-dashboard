"use client";

import { motion, AnimatePresence } from 'framer-motion';

interface RequestInfo {
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  size: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

interface RequestInfoPanelProps {
  requests: RequestInfo[];
  onClear: () => void;
}

export function RequestInfoPanel({ requests, onClear }: RequestInfoPanelProps) {
  const errors = requests.filter(r => !r.success);
  const successCount = requests.filter(r => r.success).length;

  if (requests.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0e14] border border-[#1a2535] rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a2535] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-white">Request Log</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#00ff88]">✓ {successCount}</span>
            <span className="text-[#ff4466]">✗ {errors.length}</span>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-[#5a6575] hover:text-[#ff4466] transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error List */}
      {errors.length > 0 && (
        <div className="p-3 bg-[#ff4466]/5 border-b border-[#ff4466]/20">
          <div className="text-xs text-[#ff4466] font-semibold mb-2 flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚠
            </motion.span>
            {errors.length} Error{errors.length > 1 ? 's' : ''} Detected
          </div>
          <div className="space-y-2">
            {errors.slice(0, 3).map((err, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#ff4466]/10 rounded-lg p-3 border border-[#ff4466]/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#ff4466] bg-[#ff4466]/20 px-2 py-0.5 rounded">
                    {err.status}
                  </span>
                  <code className="text-xs text-[#ff4466]">{err.endpoint}</code>
                </div>
                {err.error && (
                  <p className="text-xs text-[#ff8899]">{err.error}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="p-3 max-h-40 overflow-y-auto">
        <div className="space-y-1">
          <AnimatePresence>
            {requests.slice(0, 5).map((req, i) => (
              <motion.div
                key={`${req.endpoint}-${req.timestamp.getTime()}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 text-xs py-1.5"
              >
                <span className={`font-bold ${req.success ? 'text-[#00ff88]' : 'text-[#ff4466]'}`}>
                  {req.status}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  req.method === 'GET' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#00ffff]/20 text-[#00ffff]'
                }`}>
                  {req.method}
                </span>
                <code className="text-[#8a95a5] flex-1 truncate">{req.endpoint}</code>
                <span className="text-[#5a6575]">{req.duration}ms</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
