"use client";

import { QueueData } from '@/types/syntx';

interface QueuePanelProps {
  queue: QueueData | null;
}

export function QueuePanel({ queue }: QueuePanelProps) {
  const stats = [
    { key: 'incoming', label: 'Incoming', color: 'cyan', value: queue?.queue?.incoming },
    { key: 'processing', label: 'Processing', color: 'orange', value: queue?.queue?.processing },
    { key: 'processed', label: 'Processed', color: 'green', value: queue?.queue?.processed },
    { key: 'errors', label: 'Errors', color: 'red', value: queue?.queue?.errors },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-4">
      <h3 className="text-[10px] text-[var(--text-muted)] uppercase tracking-[2px] mb-3 flex items-center gap-2">
        <span>📊</span> Queue Status
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {stats.map(stat => (
          <div key={stat.key} className="bg-[var(--bg-card)] rounded-lg p-3 text-center">
            <div className={`text-xl font-bold`} style={{ color: `var(--${stat.color})` }}>
              {stat.value ?? '-'}
            </div>
            <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {queue?.performance && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)]">Jobs/Hour</span>
            <span className="text-[var(--cyan)] font-semibold">{queue.performance.jobs_per_hour}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)]">Avg Duration</span>
            <span className="text-[var(--purple)] font-semibold">{queue.performance.avg_duration_minutes}m</span>
          </div>
        </div>
      )}
    </div>
  );
}
