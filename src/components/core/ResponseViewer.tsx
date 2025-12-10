"use client";

import { motion } from 'framer-motion';
import { ApiResponse } from '@/types/syntx';

interface ResponseViewerProps {
  response: ApiResponse | null;
  loading: boolean;
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-[var(--purple)]'; // numbers
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-[var(--cyan)]' : 'text-[var(--green)]'; // keys : strings
      } else if (/true|false/.test(match)) {
        cls = 'text-[var(--orange)]';
      } else if (/null/.test(match)) {
        cls = 'text-[var(--text-muted)]';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function ResponseViewer({ response, loading }: ResponseViewerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="w-12 h-12 border-2 border-[var(--cyan)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
        <div className="text-6xl mb-4 opacity-30">🌊</div>
        <p className="text-sm">Wähle einen Endpoint</p>
        <p className="text-xs mt-1 opacity-60">um den Strom zu aktivieren</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Response Meta */}
      <div className="flex items-center gap-4 pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs">
        <span className={`font-bold ${response.success ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
          {response.status || 'ERR'}
        </span>
        <span className="text-[var(--text-muted)]">
          Zeit: <span className="text-[var(--cyan)]">{response.duration}ms</span>
        </span>
        <span className="text-[var(--text-muted)]">
          Größe: <span className="text-[var(--purple)]">{formatBytes(response.size)}</span>
        </span>
      </div>

      {/* JSON Body */}
      <div className="flex-1 overflow-auto">
        <pre className="text-xs leading-relaxed">
          <code 
            dangerouslySetInnerHTML={{ 
              __html: syntaxHighlight(JSON.stringify(response.data, null, 2)) 
            }} 
          />
        </pre>
      </div>
    </div>
  );
}
