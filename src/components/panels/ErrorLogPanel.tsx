"use client";

import { motion, AnimatePresence } from 'framer-motion';

export interface LogEntry {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  endpoint: string;
  method: string;
  status: number;
  message: string;
  hint?: string;
  timestamp: Date;
}

interface ErrorLogPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function ErrorLogPanel({ logs, onClear }: ErrorLogPanelProps) {
  const errors = logs.filter(l => l.type === 'error' || l.type === 'warning');

  if (logs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-[#0a0e14] border border-[#1a2535] rounded-xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[#1a2535] flex items-center justify-between bg-[#080b10]">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-white">📋 Request Log</span>
          <div className="flex items-center gap-3 text-xs">
            {errors.length > 0 && (
              <span className="flex items-center gap-1 text-[#ff4466] bg-[#ff4466]/10 px-2 py-1 rounded-lg">⚠ {errors.length}</span>
            )}
            <span className="text-[#00ff88]">✓ {logs.filter(l => l.type === 'success').length}</span>
          </div>
        </div>
        <button onClick={onClear} className="text-xs text-[#5a6575] hover:text-[#ff4466] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#ff4466]/10">Clear All</button>
      </div>

      <div className="max-h-56 overflow-y-auto divide-y divide-[#1a2535]/50">
        <AnimatePresence>
          {logs.slice(0, 10).map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`px-4 py-3 ${log.type === 'error' ? 'bg-[#ff4466]/5' : log.type === 'warning' ? 'bg-[#ffaa00]/5' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  log.type === 'error' ? 'bg-[#ff4466]/20 text-[#ff4466]' :
                  log.type === 'warning' ? 'bg-[#ffaa00]/20 text-[#ffaa00]' :
                  'bg-[#00ff88]/20 text-[#00ff88]'
                }`}>
                  {log.type === 'error' ? '✗' : log.type === 'warning' ? '⚠' : '✓'}
                </div>
                <span className={`text-sm font-bold w-12 shrink-0 ${log.status >= 500 ? 'text-[#ff4466]' : log.status >= 400 ? 'text-[#ffaa00]' : 'text-[#00ff88]'}`}>{log.status}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${log.method === 'GET' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#00ffff]/20 text-[#00ffff]'}`}>{log.method}</span>
                <code className="text-sm text-[#8a95a5] truncate flex-1">{log.endpoint}</code>
                <span className={`text-sm shrink-0 ${log.type === 'error' ? 'text-[#ff4466]' : log.type === 'warning' ? 'text-[#ffaa00]' : 'text-[#5a6575]'}`}>{log.message}</span>
                <span className="text-[10px] text-[#3a4550] shrink-0 ml-2">{log.timestamp.toLocaleTimeString()}</span>
              </div>
              
              {/* Hint für fehlende Parameter */}
              {log.hint && (
                <div className="mt-2 ml-11 p-2 bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span className="text-xs text-[#00ffff]">Required: </span>
                  <code className="text-xs text-white bg-[#00ffff]/20 px-2 py-0.5 rounded font-bold">{log.hint}</code>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
