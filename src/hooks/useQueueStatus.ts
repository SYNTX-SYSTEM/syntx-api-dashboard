import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '@/config/endpoints';
import { QueueData } from '@/types/syntx';

export function useQueueStatus(refreshInterval = 15000) {
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/monitoring/live-queue`);
      if (res.ok) {
        setQueue(await res.json());
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchQueue, refreshInterval]);

  return { queue, loading, error, refetch: fetchQueue };
}
