"use client";

import { motion } from 'framer-motion';
import { SystemHealth } from '@/types/syntx';

interface HealthPanelProps {
  health: SystemHealth | null;
  loading: boolean;
}

export function HealthPanel({ health, loading }: HealthPanelProps) {
  const isHealthy = health?.status === 'SYSTEM_GESUND';

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-4">
      <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-[2px] mb-3 flex items-center gap-2">
        <span>🏥</span> System Health
      </h3>
      
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
        isHealthy 
          ? 'bg-[var(--green)]/10 border-[var(--green)]/30' 
          : 'bg-[var(--bg-card)] border-[var(--border-subtle)]'
      }`}>
        <motion.div
          className={`w-4 h-4 rounded-full ${isHealthy ? 'bg-[var(--green)]' : 'bg-[var(--text-muted)]'}`}
          animate={isHealthy ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={isHealthy ? { boxShadow: '0 0 15px var(--green)' } : {}}
        />
        <div className="flex-1">
          <div className={`text-sm font-semibold ${isHealthy ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}`}>
            {loading ? '⏳ Laden...' : isHealthy ? '🟢 SYSTEM GESUND' : '⚠️ Status unbekannt'}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString('de-DE') : '-'}
          </div>
        </div>
        {health?.api_version && (
          <div className="text-xs text-[var(--cyan)]">v{health.api_version}</div>
        )}
      </div>
    </div>
  );
}
