"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  endpoint?: string;
  status?: number;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 8000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const colors = {
    success: { bg: 'from-[#00ff88]/20 to-[#00ff88]/5', border: '#00ff88', icon: '✓', text: '#00ff88' },
    error: { bg: 'from-[#ff4466]/20 to-[#ff4466]/5', border: '#ff4466', icon: '✗', text: '#ff4466' },
    warning: { bg: 'from-[#ffaa00]/20 to-[#ffaa00]/5', border: '#ffaa00', icon: '⚠', text: '#ffaa00' },
    info: { bg: 'from-[#00ffff]/20 to-[#00ffff]/5', border: '#00ffff', icon: 'ℹ', text: '#00ffff' }
  };

  const c = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`relative bg-gradient-to-r ${c.bg} backdrop-blur-xl rounded-xl border overflow-hidden min-w-[350px]`}
      style={{ borderColor: `${c.border}40` }}
    >
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-full"
        style={{ background: c.border }}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 8000) / 1000, ease: 'linear' }}
      />

      <div className="p-4 flex gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ background: `${c.border}20`, color: c.text }}
          animate={toast.type === 'error' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: toast.type === 'error' ? Infinity : 0 }}
        >
          {c.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-base">{toast.title}</span>
            {toast.status && (
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${c.border}20`, color: c.text }}>
                {toast.status}
              </span>
            )}
          </div>
          
          {toast.endpoint && (
            <code className="text-xs text-[#5a6575] block mb-1 truncate">{toast.endpoint}</code>
          )}
          
          <p className="text-sm text-[#a0aabb]">{toast.message}</p>
        </div>

        <button onClick={() => onRemove(toast.id)} className="text-[#5a6575] hover:text-white transition-colors text-xl shrink-0">×</button>
      </div>
    </motion.div>
  );
}
