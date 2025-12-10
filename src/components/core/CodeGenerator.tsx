"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Endpoint, BASE_URL } from '@/config/endpoints';

interface CodeGeneratorProps {
  endpoint: Endpoint | null;
  queryParams: Record<string, string>;
  requestBody: string;
}

type Language = 'curl' | 'python' | 'javascript' | 'typescript';

export function CodeGenerator({ endpoint, queryParams, requestBody }: CodeGeneratorProps) {
  const [language, setLanguage] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);

  if (!endpoint) return null;

  const url = buildUrl(endpoint.path, queryParams);
  const method = endpoint.method;

  function buildUrl(path: string, params: Record<string, string>): string {
    const base = `${BASE_URL}${path}`;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (k && v) searchParams.append(k, v); });
    return searchParams.toString() ? `${base}?${searchParams.toString()}` : base;
  }

  function generateCode(): string {
    switch (language) {
      case 'curl': return generateCurl();
      case 'python': return generatePython();
      case 'javascript': return generateJavaScript();
      case 'typescript': return generateTypeScript();
      default: return '';
    }
  }

  function generateCurl(): string {
    let cmd = `curl -X ${method} "${url}"`;
    if (method === 'POST' && requestBody) {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody}'`;
    }
    return cmd;
  }

  function generatePython(): string {
    if (method === 'GET') {
      return `import requests

response = requests.get("${url}")
data = response.json()
print(data)`;
    } else {
      return `import requests

payload = ${requestBody || '{}'}

response = requests.post(
    "${url}",
    json=payload
)
data = response.json()
print(data)`;
    }
  }

  function generateJavaScript(): string {
    if (method === 'GET') {
      return `fetch("${url}")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
    } else {
      return `fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${requestBody || '{}'})
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
    }
  }

  function generateTypeScript(): string {
    if (method === 'GET') {
      return `const response = await fetch("${url}");
const data: ResponseType = await response.json();
console.log(data);`;
    } else {
      return `const response = await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${requestBody || '{}'})
});
const data: ResponseType = await response.json();
console.log(data);`;
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const languages: { id: Language; label: string; icon: string; color: string }[] = [
    { id: 'curl', label: 'cURL', icon: '⚡', color: '#00ffff' },
    { id: 'python', label: 'Python', icon: '🐍', color: '#3776ab' },
    { id: 'javascript', label: 'JavaScript', icon: '🟨', color: '#f7df1e' },
    { id: 'typescript', label: 'TypeScript', icon: '🔷', color: '#3178c6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0a0e14] to-[#080b10] border border-[#1a2535] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1a2535] flex items-center justify-between bg-[#060809]">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffff]/20 to-[#00ff88]/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl">💻</span>
          </motion.div>
          <div>
            <span className="text-sm font-bold text-white">Code Generator</span>
            <p className="text-xs text-[#5a6575]">Copy & paste ready</p>
          </div>
        </div>
        <motion.button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            copied 
              ? 'bg-[#00ff88]/20 text-[#00ff88]' 
              : 'bg-[#00ffff]/10 text-[#00ffff] hover:bg-[#00ffff]/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="copied" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                <span>✓</span> Copied!
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                <span>📋</span> Copy Code
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Language Tabs */}
      <div className="flex p-2 gap-2 bg-[#060809] border-b border-[#1a2535]">
        {languages.map(lang => (
          <motion.button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              language === lang.id 
                ? 'bg-[#0a0e14] text-white shadow-lg' 
                : 'text-[#5a6575] hover:text-white hover:bg-[#0a0e14]/50'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            style={language === lang.id ? { boxShadow: `0 0 20px ${lang.color}30` } : {}}
          >
            <span>{lang.icon}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Code Display */}
      <div className="p-5 relative">
        <div className="absolute top-3 right-3 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        <div className="bg-[#060809] rounded-xl p-4 border border-[#1a2535] overflow-auto max-h-64">
          <pre className="text-sm font-mono text-[#00ff88] whitespace-pre-wrap">
            <code>{generateCode()}</code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
