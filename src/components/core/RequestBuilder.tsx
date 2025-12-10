"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RequestBuilderProps {
  method: string;
  onParamsChange: (params: Record<string, string>) => void;
  onBodyChange: (body: string) => void;
  onFire: () => void;
  loading: boolean;
  requiredParams?: string[];
}

export function RequestBuilder({ method, onParamsChange, onBodyChange, onFire, loading, requiredParams = [] }: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'body' | 'headers'>('params');
  const [params, setParams] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [body, setBody] = useState('{\n  \n}');

  // Reset params when method changes
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
    <div className="bg-[#0a0e14] border border-[#1a2535] rounded-xl overflow-hidden flex-1 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#1a2535]">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative flex items-center justify-center gap-2 ${
              activeTab === tab.id 
                ? 'text-[#00ffff]' 
                : tab.disabled 
                ? 'text-[#2a3545] cursor-not-allowed'
                : 'text-[#5a6575] hover:text-[#8a95a5]'
            }`}
            whileHover={!tab.disabled ? { backgroundColor: 'rgba(0,255,255,0.05)' } : {}}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-[#00ffff]/20 text-[#00ffff] text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
            {activeTab === tab.id && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#00ff88]" layoutId="activeTab" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'params' && (
            <motion.div
              key="params"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Param Rows */}
              {params.map((param, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={e => updateParam(i, 'key', e.target.value)}
                    className="flex-1 bg-[#080b10] border border-[#1a2535] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={e => updateParam(i, 'value', e.target.value)}
                    className="flex-1 bg-[#080b10] border border-[#1a2535] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none transition-all"
                  />
                  {params.length > 1 && (
                    <motion.button
                      onClick={() => removeParam(i)}
                      className="w-10 h-10 flex items-center justify-center text-[#ff4466] hover:bg-[#ff4466]/10 rounded-lg transition-all text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  )}
                </motion.div>
              ))}

              {/* Add Param Button */}
              <motion.button
                onClick={addParam}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[#1a2535] text-[#5a6575] hover:border-[#00ffff] hover:text-[#00ffff] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-xl">+</span>
                <span>Add Parameter</span>
              </motion.button>

              {/* Required Params Hint */}
              {requiredParams.length > 0 && (
                <div className="mt-4 p-3 bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-lg">
                  <div className="text-xs text-[#ffaa00] font-semibold mb-1">⚠ Required Parameters:</div>
                  <div className="flex flex-wrap gap-2">
                    {requiredParams.map(p => (
                      <span key={p} className="text-xs bg-[#ffaa00]/20 text-[#ffaa00] px-2 py-1 rounded">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'body' && (
            <motion.div
              key="body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <textarea
                value={body}
                onChange={e => handleBodyChange(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-full min-h-[200px] bg-[#080b10] border border-[#1a2535] rounded-lg px-4 py-3 text-sm text-[#00ff88] font-mono placeholder-[#3a4550] focus:border-[#00ffff] focus:outline-none transition-all resize-none"
                spellCheck={false}
              />
            </motion.div>
          )}

          {activeTab === 'headers' && (
            <motion.div
              key="headers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="flex gap-2 items-center opacity-60">
                <input type="text" value="Content-Type" readOnly className="flex-1 bg-[#080b10] border border-[#1a2535] rounded-lg px-3 py-2.5 text-sm text-[#5a6575]" />
                <input type="text" value="application/json" readOnly className="flex-1 bg-[#080b10] border border-[#1a2535] rounded-lg px-3 py-2.5 text-sm text-[#00ffff]" />
              </div>
              <p className="text-xs text-[#3a4550] mt-2">Headers are automatically set based on request type.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fire Button */}
      <div className="p-4 border-t border-[#1a2535]">
        <motion.button
          onClick={onFire}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-base relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00ffff, #00ff88)' }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,255,255,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <span className="relative text-[#0a0e14] flex items-center justify-center gap-3">
            {loading ? (
              <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}>⚡</motion.span> Firing...</>
            ) : (
              <>🚀 Fire Request</>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
