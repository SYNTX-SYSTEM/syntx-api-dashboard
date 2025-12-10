"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { endpoints, Endpoint, BASE_URL } from '@/config/endpoints';
import { EndpointStatus } from '@/types/syntx';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ResponseViewer } from '@/components/core/ResponseViewer';
import { RequestBuilder } from '@/components/core/RequestBuilder';
import { ToastContainer, ToastMessage } from '@/components/core/Toast';
import { ErrorLogPanel, LogEntry } from '@/components/panels/ErrorLogPanel';
import { EndpointStatsPanel } from '@/components/panels/EndpointStatsPanel';
import { NeuralBackground } from '@/components/visualizations/NeuralBackground';
import Image from 'next/image';

interface ApiResponse { data: unknown; status: number; duration: number; size: number; success: boolean; }

function extractErrorMessage(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (obj.detail) {
      if (Array.isArray(obj.detail)) {
        const first = obj.detail[0];
        if (first && typeof first === 'object') {
          const d = first as Record<string, unknown>;
          return d.msg?.toString() || d.message?.toString() || JSON.stringify(first);
        }
        return obj.detail.join(', ');
      }
      return String(obj.detail);
    }
    if (obj.message) return String(obj.message);
    if (obj.error) return String(obj.error);
    if (obj.msg) return String(obj.msg);
  }
  return 'Request failed';
}
function extractHint(data: unknown): string | undefined {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (obj.detail && Array.isArray(obj.detail)) {
      const first = obj.detail[0] as Record<string, unknown>;
      if (first?.loc && Array.isArray(first.loc)) {
        return String(first.loc[first.loc.length - 1]);
      }
    }
  }
  return undefined;
}


export default function Dashboard() {
  const [statuses, setStatuses] = useState<Record<string, EndpointStatus>>({});
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const { health } = useSystemHealth();

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLogs(prev => [{ ...log, id, timestamp: new Date() }, ...prev].slice(0, 50));
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(() => { autoCheckAllEndpoints(); }, []);

  async function autoCheckAllEndpoints() {
    setInitialLoading(true);
    setCheckingAll(true);
    let errors = 0;
    
    for (let i = 0; i < endpoints.length; i++) {
      const ep = endpoints[i];
      setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: null, loading: true } }));
      
      try {
        const res = await fetch(`${BASE_URL}${ep.path}`, { method: 'GET' });
        const isOnline = res.status < 500;
        if (!isOnline) errors++;
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: isOnline, loading: false } }));
      } catch {
        errors++;
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: false, loading: false } }));
      }
      
      setLoadingProgress(Math.round(((i + 1) / endpoints.length) * 100));
      await new Promise(r => setTimeout(r, 50));
    }
    
    setCheckingAll(false);
    setTimeout(() => {
      setInitialLoading(false);
      addToast({ type: errors > 0 ? 'warning' : 'success', title: errors > 0 ? 'Scan Complete' : 'All Systems Online', message: errors > 0 ? `${errors} endpoint(s) have issues` : `${endpoints.length} endpoints responding`, duration: 4000 });
    }, 500);
  }

  async function handleCheckAll() {
    setCheckingAll(true);
    for (const ep of endpoints) {
      setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: null, loading: true } }));
      try {
        const res = await fetch(`${BASE_URL}${ep.path}`, { method: 'GET' });
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: res.status < 500, loading: false } }));
      } catch {
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: false, loading: false } }));
      }
      await new Promise(r => setTimeout(r, 30));
    }
    setCheckingAll(false);
  }

  function handleSelectEndpoint(ep: Endpoint) {
    setSelectedEndpoint(ep);
    setResponse(null);
    fireRequest(ep);
  }

  async function fireRequest(ep?: Endpoint) {
    const endpoint = ep || selectedEndpoint;
    if (!endpoint) return;
    
    setResponseLoading(true);
    const start = performance.now();
    
    try {
      let url = `${BASE_URL}${endpoint.path}`;
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([k, v]) => { if (k && v) params.append(k, v); });
      if (params.toString()) url += `?${params.toString()}`;

      const options: RequestInit = { method: endpoint.method };
      if (endpoint.method === 'POST' && requestBody) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      const errorMsg = extractErrorMessage(data);
      
      setResponse({ data, status: res.status, duration, size: JSON.stringify(data).length, success: res.ok });
      setStatuses(prev => ({ ...prev, [endpoint.path]: { path: endpoint.path, online: res.ok, loading: false } }));

      // Add to log
      addLog({
        type: res.ok ? 'success' : res.status >= 500 ? 'error' : 'warning',
        endpoint: endpoint.path,
        method: endpoint.method,
        status: res.status,
        message: res.ok ? `OK - ${duration}ms` : errorMsg,
        hint: res.ok ? undefined : extractHint(data)
      });

      if (!res.ok) {
        addToast({ type: 'error', title: `Error ${res.status}`, message: errorMsg, endpoint: endpoint.path, status: res.status, duration: 8000 });
      }
    } catch (err) {
      const duration = Math.round(performance.now() - start);
      setResponse({ data: { error: 'Request failed', message: String(err) }, status: 0, duration, size: 0, success: false });
      addLog({ type: 'error', endpoint: endpoint.path, method: endpoint.method, status: 0, message: 'Connection failed' });
      addToast({ type: 'error', title: 'Connection Error', message: 'Failed to connect', endpoint: endpoint.path, duration: 8000 });
    }
    
    setResponseLoading(false);
  }

  const onlineCount = Object.values(statuses).filter(s => s.online === true).length;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#030405] relative overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <motion.div className="w-40 h-40 relative" animate={{ rotate: [0, 360], filter: ['drop-shadow(0 0 30px #00ffff)', 'drop-shadow(0 0 60px #00ffff)', 'drop-shadow(0 0 30px #00ffff)'] }} transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, filter: { duration: 1.5, repeat: Infinity } }}>
                <Image src="/Logo1.png" alt="SYNTX" fill className="object-contain" />
              </motion.div>
            </div>
            <motion.h1 className="text-5xl font-black mb-3" style={{ fontFamily: 'Orbitron', background: 'linear-gradient(135deg, #00ffff, #00ff88)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SYNTX</motion.h1>
            <p className="text-[#00ffff]/60 text-sm mb-10">Initializing Command Center...</p>
            <div className="w-96 mx-auto">
              <div className="flex justify-between text-xs text-[#5a6575] mb-3"><span>Scanning Endpoints</span><span className="text-[#00ffff]">{loadingProgress}%</span></div>
              <div className="h-3 bg-[#0a0e14] rounded-full overflow-hidden border border-[#1a2535]">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00ffff, #00ff88)', width: `${loadingProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030405] relative">
      <NeuralBackground />
      <div className="relative z-10">
        <Header endpointCount={endpoints.length} onlineCount={onlineCount} version={health?.api_version || ''} />

        <div className="max-w-[2000px] mx-auto p-5 grid grid-cols-[500px_1fr] gap-5 h-[calc(100vh-85px)]">
          <Sidebar statuses={statuses} selectedEndpoint={selectedEndpoint} onSelectEndpoint={handleSelectEndpoint} onCheckAll={handleCheckAll} checkingAll={checkingAll} />

          <div className="flex flex-col gap-4 overflow-hidden">
            <EndpointStatsPanel statuses={statuses} totalEndpoints={endpoints.length} checkingAll={checkingAll} onCheckAll={handleCheckAll} />

            {/* Error Log Panel */}
            <ErrorLogPanel logs={logs} onClear={clearLogs} />

            <div className="flex-1 grid grid-cols-[380px_1fr] gap-4 min-h-0">
              <div className="flex flex-col gap-3">
                {selectedEndpoint ? (
                  <>
                    <div className="bg-[#0a0e14] border border-[#1a2535] rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${selectedEndpoint.method === 'GET' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#00ffff]/20 text-[#00ffff]'}`}>{selectedEndpoint.method}</span>
                        <code className="text-sm text-white font-mono">{selectedEndpoint.path}</code>
                      </div>
                      <p className="text-xs text-[#5a6575]">{selectedEndpoint.description}</p>
                    </div>
                    <RequestBuilder method={selectedEndpoint.method} onParamsChange={setQueryParams} onBodyChange={setRequestBody} onFire={() => fireRequest()} loading={responseLoading} />
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-[#0a0e14] border border-[#1a2535] rounded-xl">
                    <div className="text-center">
                      <motion.div className="text-5xl mb-4" animate={{ x: [-5, 5, -5] }} transition={{ duration: 1.5, repeat: Infinity }}>👈</motion.div>
                      <p className="text-[#5a6575] text-lg">Select an endpoint</p>
                    </div>
                  </div>
                )}
              </div>

              <main className="bg-[#0a0e14] border border-[#1a2535] rounded-xl overflow-hidden flex flex-col">
                <div className="px-5 py-3 border-b border-[#1a2535]"><span className="text-sm text-[#00ffff] font-semibold">Response</span></div>
                <div className="flex-1 p-4 overflow-auto"><ResponseViewer response={response} loading={responseLoading} /></div>
              </main>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
