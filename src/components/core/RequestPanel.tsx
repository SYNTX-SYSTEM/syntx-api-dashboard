"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Endpoint, BASE_URL } from '@/config/endpoints';

interface RequestPanelProps {
  endpoint: Endpoint | null;
  onParamsChange: (params: Record<string, string>) => void;
  onBodyChange: (body: string) => void;
  onFire: () => void;
  loading: boolean;
  queryParams: Record<string, string>;
  requestBody: string;
}

type MainTab = 'request' | 'code';
type Language = 'curl' | 'python' | 'javascript' | 'typescript';

export function RequestPanel({ endpoint, onParamsChange, onBodyChange, onFire, loading, queryParams, requestBody }: RequestPanelProps) {
  const [mainTab, setMainTab] = useState<MainTab>('request');
  const [requestTab, setRequestTab] = useState<'params' | 'body' | 'headers'>('params');
  const [language, setLanguage] = useState<Language>('curl');
  const [params, setParams] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('{\n  \n}');
  const [copied, setCopied] = useState(false);

  const method = endpoint?.method || 'GET';

  useEffect(() => {
    setParams([{ key: '', value: '' }]);
    setHeaders([{ key: 'Content-Type', value: 'application/json' }]);
    onParamsChange({});
  }, [endpoint?.path]);

  // Params
  function addParam() { setParams(prev => [...prev, { key: '', value: '' }]); }
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

  // Headers
  function addHeader() { setHeaders(prev => [...prev, { key: '', value: '' }]); }
  function updateHeader(index: number, field: 'key' | 'value', val: string) {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    setHeaders(newHeaders);
  }
  function removeHeader(index: number) {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, i) => i !== index));
    }
  }

  function buildUrl(): string {
    if (!endpoint) return '';
    const base = `${BASE_URL}${endpoint.path}`;
    const sp = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => { if (k && v) sp.append(k, v); });
    return sp.toString() ? `${base}?${sp.toString()}` : base;
  }

  function getHeadersObj(): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach(h => { if (h.key && h.value) obj[h.key] = h.value; });
    return obj;
  }

  function generateCode(): string {
    const url = buildUrl();
    const hdrs = getHeadersObj();
    const hasCustomHeaders = Object.keys(hdrs).length > 1 || !hdrs['Content-Type'];
    
    switch (language) {
      case 'curl': 
        let cmd = `curl "${url}"`;
        if (method === 'POST') cmd = `curl -X POST "${url}"`;
        Object.entries(hdrs).forEach(([k, v]) => { cmd += ` \\\n  -H "${k}: ${v}"`; });
        if (method === 'POST' && requestBody) cmd += ` \\\n  -d '${requestBody}'`;
        return cmd;
      case 'python': 
        let py = `import requests\n\n`;
        if (hasCustomHeaders) py += `headers = ${JSON.stringify(hdrs, null, 2)}\n\n`;
        py += `res = requests.${method.toLowerCase()}("${url}"`;
        if (hasCustomHeaders) py += `, headers=headers`;
        if (method === 'POST') py += `, json=${requestBody || '{}'}`;
        py += `)\nprint(res.json())`;
        return py;
      case 'javascript': 
        let js = `const res = await fetch("${url}"`;
        if (method === 'POST' || hasCustomHeaders) {
          js += `, {\n`;
          if (method === 'POST') js += `  method: "POST",\n`;
          js += `  headers: ${JSON.stringify(hdrs, null, 2).replace(/\n/g, '\n  ')}`;
          if (method === 'POST') js += `,\n  body: JSON.stringify(${requestBody || '{}'})`;
          js += `\n}`;
        }
        js += `);\nconst data = await res.json();`;
        return js;
      case 'typescript': 
        let ts = `const res = await fetch("${url}"`;
        if (method === 'POST' || hasCustomHeaders) {
          ts += `, {\n`;
          if (method === 'POST') ts += `  method: "POST",\n`;
          ts += `  headers: ${JSON.stringify(hdrs, null, 2).replace(/\n/g, '\n  ')}`;
          if (method === 'POST') ts += `,\n  body: JSON.stringify(${requestBody || '{}'})`;
          ts += `\n}`;
        }
        ts += `);\nconst data: ApiResponse = await res.json();`;
        return ts;
      default: return '';
    }
  }

  async function copyCode() { await navigator.clipboard.writeText(generateCode()); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  if (!endpoint) {
    return (
      <div className="h-full bg-[#0a0e14] border border-[#1a2535] rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-30">👈</div>
          <p className="text-[#5a6575]">Select an endpoint</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0e14] border border-[#1a2535] rounded-2xl overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1a2535] bg-[#080b10]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-md text-xs font-bold ${
              method === 'GET' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#00ffff]/20 text-[#00ffff]'
            }`}>{method}</span>
            <span className="text-white font-mono text-sm">{endpoint.path}</span>
          </div>
          <div className="flex gap-1 bg-[#0a0e14] rounded-lg p-1">
            <button
              onClick={() => setMainTab('request')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mainTab === 'request' ? 'bg-[#1a2535] text-[#00ffff]' : 'text-[#5a6575] hover:text-white'
              }`}
            >Request</button>
            <button
              onClick={() => setMainTab('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mainTab === 'code' ? 'bg-[#1a2535] text-[#00ffff]' : 'text-[#5a6575] hover:text-white'
              }`}
            >Code</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {mainTab === 'request' ? (
            <motion.div key="request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
              {/* Sub Tabs */}
              <div className="px-5 py-3 border-b border-[#1a2535] flex gap-4">
                {['params', 'body', 'headers'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => (tab !== 'body' || method !== 'GET') && setRequestTab(tab as typeof requestTab)}
                    className={`text-xs font-semibold uppercase tracking-wider transition-all ${
                      requestTab === tab ? 'text-[#00ffff]' : tab === 'body' && method === 'GET' ? 'text-[#2a3545] cursor-not-allowed' : 'text-[#5a6575] hover:text-white'
                    }`}
                  >{tab}</button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-5 overflow-y-auto">
                {/* PARAMS */}
                {requestTab === 'params' && (
                  <div className="space-y-4">
                    {params.map((param, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end group">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-2">Key</label>
                          <input
                            type="text"
                            value={param.key}
                            onChange={e => updateParam(i, 'key', e.target.value)}
                            placeholder="parameter"
                            className="w-full px-4 py-3 rounded-lg bg-[#080b10] border border-[#1a2535] text-white text-sm placeholder-[#3a4550] focus:border-[#00ffff]/50 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-2">Value</label>
                          <input
                            type="text"
                            value={param.value}
                            onChange={e => updateParam(i, 'value', e.target.value)}
                            placeholder="value"
                            className="w-full px-4 py-3 rounded-lg bg-[#080b10] border border-[#1a2535] text-[#00ff88] font-mono text-sm placeholder-[#3a4550] focus:border-[#00ff88]/50 focus:outline-none transition-all"
                          />
                        </div>
                        <button
                          onClick={() => removeParam(i)}
                          className={`p-3 text-[#5a6575] hover:text-[#ff4466] transition-all ${params.length > 1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >✕</button>
                      </div>
                    ))}
                    <button
                      onClick={addParam}
                      className="w-full py-3 rounded-lg border border-dashed border-[#1a2535] text-[#5a6575] hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-all text-sm font-medium"
                    >+ Add Parameter</button>
                  </div>
                )}

                {/* BODY */}
                {requestTab === 'body' && (
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-2">JSON Body</label>
                    <textarea
                      value={body}
                      onChange={e => { setBody(e.target.value); onBodyChange(e.target.value); }}
                      className="w-full h-48 px-4 py-3 rounded-lg bg-[#080b10] border border-[#1a2535] text-[#00ff88] font-mono text-sm placeholder-[#3a4550] focus:border-[#00ffff]/50 focus:outline-none resize-none"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                )}

                {/* HEADERS - Now Editable! */}
                {requestTab === 'headers' && (
                  <div className="space-y-4">
                    {headers.map((header, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end group">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-2">Header</label>
                          <input
                            type="text"
                            value={header.key}
                            onChange={e => updateHeader(i, 'key', e.target.value)}
                            placeholder="Header-Name"
                            className="w-full px-4 py-3 rounded-lg bg-[#080b10] border border-[#1a2535] text-white text-sm placeholder-[#3a4550] focus:border-[#00ffff]/50 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-2">Value</label>
                          <input
                            type="text"
                            value={header.value}
                            onChange={e => updateHeader(i, 'value', e.target.value)}
                            placeholder="value"
                            className="w-full px-4 py-3 rounded-lg bg-[#080b10] border border-[#1a2535] text-[#00ffff] font-mono text-sm placeholder-[#3a4550] focus:border-[#00ffff]/50 focus:outline-none transition-all"
                          />
                        </div>
                        <button
                          onClick={() => removeHeader(i)}
                          className={`p-3 text-[#5a6575] hover:text-[#ff4466] transition-all ${headers.length > 1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >✕</button>
                      </div>
                    ))}
                    <button
                      onClick={addHeader}
                      className="w-full py-3 rounded-lg border border-dashed border-[#1a2535] text-[#5a6575] hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-all text-sm font-medium"
                    >+ Add Header</button>
                    
                    {/* Common Headers Quick Add */}
                    <div className="pt-4 border-t border-[#1a2535]">
                      <p className="text-[10px] font-semibold text-[#5a6575] uppercase tracking-wider mb-3">Quick Add</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'Authorization', value: 'Bearer ' },
                          { key: 'X-API-Key', value: '' },
                          { key: 'Accept', value: 'application/json' },
                        ].map(h => (
                          <button
                            key={h.key}
                            onClick={() => setHeaders(prev => [...prev, { key: h.key, value: h.value }])}
                            className="px-3 py-1.5 rounded-md bg-[#1a2535] text-[#5a6575] hover:text-[#00ffff] text-xs font-medium transition-all"
                          >{h.key}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
              {/* Language Tabs */}
              <div className="px-5 py-3 border-b border-[#1a2535] flex gap-2">
                {(['curl', 'python', 'javascript', 'typescript'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      language === lang ? 'bg-[#1a2535] text-[#00ffff]' : 'text-[#5a6575] hover:text-white'
                    }`}
                  >{lang === 'javascript' ? 'JS' : lang === 'typescript' ? 'TS' : lang}</button>
                ))}
              </div>

              {/* Code Block */}
              <div className="flex-1 p-5 overflow-auto">
                <div className="h-full rounded-lg bg-[#080b10] border border-[#1a2535] flex flex-col">
                  <div className="px-4 py-2 border-b border-[#1a2535] flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <button
                      onClick={copyCode}
                      className={`text-xs px-2 py-1 rounded transition-all ${copied ? 'text-[#00ff88]' : 'text-[#5a6575] hover:text-white'}`}
                    >{copied ? '✓ Copied' : 'Copy'}</button>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto text-sm font-mono text-[#00ff88]">
                    <code>{generateCode()}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fire Button */}
      <div className="p-4 border-t border-[#1a2535]">
        <button
          onClick={onFire}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00ffff] to-[#00ff88] text-[#0a0e14] font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? '⚡ Sending...' : '🚀 FIRE REQUEST'}
        </button>
      </div>
    </div>
  );
}
