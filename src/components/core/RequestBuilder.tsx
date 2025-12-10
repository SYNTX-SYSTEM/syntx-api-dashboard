"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RequestBuilderProps {
  method: string;
  onParamsChange: (params: Record<string, string>) => void;
  onBodyChange: (body: string) => void;
  onFire: () => void;
  loading: boolean;
}

export function RequestBuilder({ method, onParamsChange, onBodyChange, onFire, loading }: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'body' | 'headers'>('params');
  const [params, setParams] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [body, setBody] = useState('{\n  \n}');

  useEffect(() => {
    setParams([{ key: '', value: '' }]);
    onParamsChange({});
  }, [method]);

  function addParam() {
    setParams(prev => [...prev, { key: '', value: '' }]);
  }

  function updateParam(index: number, field: 'key' | 'value', val: string) {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    
    const paramObj: Record<string, string> = {};
    newParams.forEach(p => { if (p.key) paramObj[p.key] = p.value; });
    onParamsChange(paramObj);
  }

  function removeParam(index: number) {
    if (params.length > 1) {
      const newParams = params.filter((_, i) => i !== index);
      setParams(newParams);
      
      const paramObj: Record<string, string> = {};
      newParams.forEach(p => { if (p.key) paramObj[p.key] = p.value; });
      onParamsChange(paramObj);
    }
  }

  function handleBodyChange(val: string) {
    setBody(val);
    onBodyChange(val);
  }

  const tabs = [
    { id: 'params', label: 'Query Params', icon: '🔍', count: params.filter(p => p.key).length },
    { id: 'body', label: 'Body', icon: '📦', disabled: method === 'GET' },
    { id: 'headers', label: 'Headers', icon: '📋' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0a0e14] to-[#080b10] border border-[#1a2535] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Tabs - Schöner gestylt */}
      <div className="flex bg-[#060809] border-b border-[#1a2535]">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-5 py-4 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 ${
              activeTab === tab.id 
                ? 'text-[#00ffff] bg-gradient-to-b from-[#00ffff]/10 to-transparent' 
                : tab.disabled 
                ? 'text-[#2a3545] cursor-not-allowed'
                : 'text-[#5a6575] hover:text-[#8a95a5] hover:bg-[#0a0e14]'
            }`}
            whileHover={!tab.disabled ? { y: -1 } : {}}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <motion.span 
                className="bg-gradient-to-r from-[#00ffff] to-[#00ff88] text-[#0a0e14] text-xs px-2 py-0.5 rounded-full font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {tab.count}
              </motion.span>
            )}
            {activeTab === tab.id && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ffff] to-[#00ff88] rounded-t-full" 
                layoutId="activeTab" 
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {activeTab === 'params' && (
            <motion.div
              key="params"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5a6575] uppercase tracking-wider">Parameters</span>
                <span className="text-xs text-[#00ffff]">{params.filter(p => p.key).length} active</span>
              </div>

              {/* Param Rows */}
              <div className="space-y-3">
                {params.map((param, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 items-center group"
                  >
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Key"
                        value={param.key}
                        onChange={e => updateParam(i, 'key', e.target.value)}
                        className="w-full bg-[#060809] border-2 border-[#1a2535] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/20 transition-all"
                      />
                      {param.key && (
                        <motion.div 
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ff88]"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </div>
                    <span className="text-[#3a4550] text-xl">=</span>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Value"
                        value={param.value}
                        onChange={e => updateParam(i, 'value', e.target.value)}
                        className="w-full bg-[#060809] border-2 border-[#1a2535] rounded-xl px-4 py-3 text-sm text-[#00ff88] placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/20 transition-all font-mono"
                      />
                    </div>
                    {params.length > 1 && (
                      <motion.button
                        onClick={() => removeParam(i)}
                        className="w-10 h-10 flex items-center justify-center text-[#ff4466] hover:bg-[#ff4466]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Add Param Button */}
              <motion.button
                onClick={addParam}
                className="w-full py-4 rounded-xl border-2 border-dashed border-[#1a2535] text-[#5a6575] hover:border-[#00ffff] hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all flex items-center justify-center gap-3 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.span 
                  className="w-8 h-8 rounded-full bg-[#1a2535] group-hover:bg-[#00ffff]/20 flex items-center justify-center text-xl transition-all"
                  whileHover={{ rotate: 90 }}
                >
                  +
                </motion.span>
                <span className="font-medium">Add Parameter</span>
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'body' && (
            <motion.div
              key="body"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#5a6575] uppercase tracking-wider">JSON Body</span>
                <span className="text-xs text-[#00ffff] bg-[#00ffff]/10 px-2 py-1 rounded">application/json</span>
              </div>
              <textarea
                value={body}
                onChange={e => handleBodyChange(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-48 bg-[#060809] border-2 border-[#1a2535] rounded-xl px-4 py-3 text-sm text-[#00ff88] font-mono placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none focus:ring-2 focus:ring-[#00ffff]/20 transition-all resize-none"
                spellCheck={false}
              />
            </motion.div>
          )}

          {activeTab === 'headers' && (
            <motion.div
              key="headers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#5a6575] uppercase tracking-wider">Request Headers</span>
                <span className="text-xs text-[#5a6575]">Auto-configured</span>
              </div>
              <div className="bg-[#060809] border border-[#1a2535] rounded-xl p-4 flex items-center gap-4">
                <span className="text-sm text-[#5a6575]">Content-Type</span>
                <span className="text-sm text-[#00ffff] font-mono bg-[#00ffff]/10 px-3 py-1 rounded-lg">application/json</span>
              </div>
              <p className="text-xs text-[#3a4550] mt-2">Headers are automatically configured based on request type.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fire Button */}
      <div className="p-5 pt-0">
        <motion.button
          onClick={onFire}
          disabled={loading}
          className="w-full py-5 rounded-xl font-bold text-lg relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #00ffff, #00ff88)' }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(0,255,255,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/30"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative text-[#0a0e14] flex items-center justify-center gap-3">
            {loading ? (
              <>
                <motion.span 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                >
                  ⚡
                </motion.span> 
                Firing...
              </>
            ) : (
              <>
                🚀 Fire Request
              </>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
