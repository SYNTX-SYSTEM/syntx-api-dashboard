import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '@/config/endpoints';
import { SystemHealth } from '@/types/syntx';

export function useSystemHealth(refreshInterval = 30000) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) {
        setHealth(await res.json());
        setError(null);
      } else {
        setError(`Status ${res.status}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchHealth, refreshInterval]);

  return { health, loading, error, refetch: fetchHealth };
}
