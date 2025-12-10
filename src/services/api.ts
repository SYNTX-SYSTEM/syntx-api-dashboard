import { BASE_URL } from '@/config/endpoints';

export async function fetchEndpoint(path: string, options?: RequestInit) {
  const start = performance.now();
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    const duration = Math.round(performance.now() - start);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data,
      duration,
      size: JSON.stringify(data).length,
    };
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    return {
      success: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      size: 0,
    };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
