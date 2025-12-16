"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const nodeCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: [],
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 11, 21, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        nodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030b15 0%, #0a1628 50%, #030b15 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <NeuralNetwork />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 0%, #030b15 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 100, height: 100,
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          border: '2px solid rgba(0,212,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <img src="/Logo1.png" alt="SYNTX" width={70} height={70} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{
          fontSize: 14,
          fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 6,
          marginBottom: 60,
        }}>
          SYNTX
        </div>

        <h1 style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: 800,
          letterSpacing: -2,
          color: 'white',
          textShadow: '0 0 60px rgba(255,255,255,0.3)',
        }}>
          SYNTX
        </h1>

        <h2 style={{
          margin: '30px 0 0',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700,
          color: 'white',
        }}>
          SYNTX isn't AI.
        </h2>
        <p style={{
          margin: '16px 0 0',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: '#00d4ff',
          fontFamily: 'system-ui, sans-serif',
        }}>
          It's the resonance that governs it
        </p>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 380,
        background: 'rgba(6,13,24,0.8)',
        borderRadius: 20,
        border: '1px solid rgba(0,212,255,0.2)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
        }} />

        <div style={{ padding: '32px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 8,
                letterSpacing: 2,
              }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,212,255,0.3)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 8,
                letterSpacing: 2,
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,212,255,0.3)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                marginBottom: 16,
                borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                fontSize: 12,
                fontFamily: 'monospace',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 10,
                border: 'none',
                background: loading || !username || !password
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #00d4ff, #00a8cc)',
                color: loading || !username || !password ? 'rgba(255,255,255,0.3)' : '#030b15',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: 2,
                cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
                boxShadow: loading || !username || !password ? 'none' : '0 0 30px rgba(0,212,255,0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER FIELD'}
            </button>
          </form>
        </div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        marginTop: 40,
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
      }}>
        2025 SYNTX SYSTEM
      </div>
    </div>
  );
}
