import { useState, useCallback } from 'react';
import { BASE_URL } from '@/config/endpoints';
import { ApiResponse } from '@/types/syntx';

export function useEndpoint() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const callEndpoint = useCallback(async (path: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true);
    const start = performance.now();
    
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      
      setResponse({
        success: res.ok,
        status: res.status,
        data,
        duration,
        size: JSON.stringify(data).length
      });
    } catch (e) {
      setResponse({
        success: false,
        status: 0,
        data: null,
        duration: Math.round(performance.now() - start),
        size: 0,
        error: e instanceof Error ? e.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, response, callEndpoint };
}
