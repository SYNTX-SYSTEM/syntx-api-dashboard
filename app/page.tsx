"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { endpoints, Endpoint, BASE_URL } from '@/config/endpoints';
import { EndpointStatus } from '@/types/syntx';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useEndpoint } from '@/hooks/useEndpoint';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ResponseViewer } from '@/components/core/ResponseViewer';
import { EndpointStatsPanel } from '@/components/panels/EndpointStatsPanel';
import Image from 'next/image';

export default function Dashboard() {
  const [statuses, setStatuses] = useState<Record<string, EndpointStatus>>({});
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { health } = useSystemHealth();
  const { response, loading: responseLoading, callEndpoint } = useEndpoint();

  useEffect(() => {
    autoCheckAllEndpoints();
  }, []);

  async function autoCheckAllEndpoints() {
    setInitialLoading(true);
    setCheckingAll(true);
    
    for (let i = 0; i < endpoints.length; i++) {
      const ep = endpoints[i];
      setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: null, loading: true } }));
      
      try {
        // For POST endpoints, just check if server responds (even 405 means server is up)
        const res = await fetch(`${BASE_URL}${ep.path}`, { 
          method: 'GET' // Always GET for health check
        });
        // 200, 405, 422 = server is responding = online
        const isOnline = res.status < 500;
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: isOnline, loading: false } }));
      } catch {
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: false, loading: false } }));
      }
      
      setLoadingProgress(Math.round(((i + 1) / endpoints.length) * 100));
      await new Promise(r => setTimeout(r, 50));
    }
    
    setCheckingAll(false);
    setTimeout(() => setInitialLoading(false), 500);
  }

  async function handleCheckAll() {
    setCheckingAll(true);
    for (const ep of endpoints) {
      setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: null, loading: true } }));
      try {
        const res = await fetch(`${BASE_URL}${ep.path}`, { method: 'GET' });
        const isOnline = res.status < 500;
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: isOnline, loading: false } }));
      } catch {
        setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: false, loading: false } }));
      }
      await new Promise(r => setTimeout(r, 30));
    }
    setCheckingAll(false);
  }

  function handleSelectEndpoint(ep: Endpoint) {
    setSelectedEndpoint(ep);
    callEndpoint(ep.path, ep.method);
    setStatuses(prev => ({ ...prev, [ep.path]: { path: ep.path, online: true, loading: false } }));
  }

  const onlineCount = Object.values(statuses).filter(s => s.online === true).length;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#040506] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            animate={{ 
              rotate: [0, 360],
              filter: ['drop-shadow(0 0 20px #00ffff)', 'drop-shadow(0 0 40px #00ffff)', 'drop-shadow(0 0 20px #00ffff)']
            }}
            transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, filter: { duration: 1.5, repeat: Infinity } }}
          >
            <Image src="/Logo1.png" alt="SYNTX" fill className="object-contain" />
          </motion.div>

          <motion.h1
            className="text-4xl font-black mb-2"
            style={{ 
              fontFamily: 'Orbitron',
              background: 'linear-gradient(135deg, #00ffff, #00ff88)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SYNTX
          </motion.h1>
          
          <p className="text-[#3a4550] text-sm mb-8">Initializing Command Center...</p>

          <div className="w-80 mx-auto">
            <div className="flex justify-between text-xs text-[#3a4550] mb-2">
              <span>Scanning Endpoints</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className="h-2 bg-[#151a22] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00ffff, #00ff88)' }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040506]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #0a1015 0%, #040506 100%)'
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </div>

      <Header 
        endpointCount={endpoints.length} 
        onlineCount={onlineCount} 
        version={health?.api_version || ''} 
      />

      <div className="relative z-10 max-w-[1800px] mx-auto p-6 grid grid-cols-[400px_1fr] gap-6 h-[calc(100vh-90px)]">
        <Sidebar
          statuses={statuses}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={handleSelectEndpoint}
          onCheckAll={handleCheckAll}
          checkingAll={checkingAll}
        />

        <div className="flex flex-col gap-5 overflow-hidden">
          <EndpointStatsPanel 
            statuses={statuses}
            totalEndpoints={endpoints.length}
            checkingAll={checkingAll}
            onCheckAll={handleCheckAll}
          />

          <main className="flex-1 bg-[#080a0d] border border-[#151a22] rounded-2xl overflow-hidden flex flex-col min-h-0">
            <div className="px-5 py-4 border-b border-[#151a22] flex items-center gap-4 bg-[#0a0c10] shrink-0">
              {selectedEndpoint ? (
                <>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${
                    selectedEndpoint.method === 'GET' 
                      ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' 
                      : 'bg-[#00ffff]/15 text-[#00ffff] border border-[#00ffff]/30'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-sm text-white/80 font-mono">{BASE_URL}{selectedEndpoint.path}</code>
                  {response && (
                    <div className="ml-auto flex items-center gap-4 text-xs">
                      <span className="text-[#3a4550]">
                        Status: <span className={response.success ? 'text-[#00ff88]' : 'text-[#ff4466]'}>{response.status}</span>
                      </span>
                      <span className="text-[#3a4550]">
                        Time: <span className="text-[#00ffff]">{response.duration}ms</span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-sm text-[#3a4550]">👈 Select an endpoint from the sidebar</span>
              )}
            </div>

            <div className="flex-1 p-5 overflow-auto">
              <ResponseViewer response={response} loading={responseLoading} />
            </div>
          </main>

          <div className="text-center py-2 shrink-0">
            <p className="text-[11px] text-[#2a3540]">
              "SYNTX isn't AI. <span className="text-[#00ffff]/60">It's the resonance that governs it</span>"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
