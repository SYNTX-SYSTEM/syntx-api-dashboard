"use client";

import { motion } from 'framer-motion';

interface ApiResponse {
  data: unknown;
  status: number;
  duration: number;
  size: number;
  success: boolean;
}

interface ResponseViewerProps {
  response: ApiResponse | null;
  loading: boolean;
}

export function ResponseViewer({ response, loading }: ResponseViewerProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#00ffff] border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="text-[#00ffff] text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Fetching data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌊
          </motion.div>
          <p className="text-[#3a4550] text-lg mb-2">Wähle einen Endpoint</p>
          <p className="text-[#2a3040] text-sm">um den Strom zu aktivieren</p>
        </div>
      </div>
    );
  }

  const jsonString = JSON.stringify(response.data, null, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Response Meta */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#1a2535]">
        <motion.div
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            response.success 
              ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' 
              : 'bg-[#ff4466]/15 text-[#ff4466] border border-[#ff4466]/30'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {response.status}
        </motion.div>
        <div className="flex items-center gap-6 text-xs">
          <span className="text-[#3a4550]">
            Time: <span className="text-[#00ffff] font-mono">{response.duration}ms</span>
          </span>
          <span className="text-[#3a4550]">
            Size: <span className="text-[#00ff88] font-mono">{formatBytes(response.size)}</span>
          </span>
        </div>
      </div>

      {/* JSON Response */}
      <div className="flex-1 overflow-auto rounded-xl bg-[#050608] border border-[#1a2535] p-4">
        <pre className="text-sm font-mono leading-relaxed">
          <SyntaxHighlight json={jsonString} />
        </pre>
      </div>
    </motion.div>
  );
}

function SyntaxHighlight({ json }: { json: string }) {
  const highlighted = json
    .replace(/"([^"]+)":/g, '<span class="text-[#00ffff]">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-[#00ff88]">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-[#aa66ff]">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-[#ffaa00]">$1</span>')
    .replace(/: (null)/g, ': <span class="text-[#ff4466]">$1</span>');

  return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
