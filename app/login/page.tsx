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
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];

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
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

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

      {/* CSS Keyframes */}
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2), 0 0 60px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.1);
            border-color: rgba(0,212,255,0.5);
          }
          50% { 
            box-shadow: 0 0 30px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.4), 0 0 90px rgba(0,212,255,0.2), inset 0 0 30px rgba(0,212,255,0.2);
            border-color: rgba(0,212,255,0.8);
          }
        }
        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(0,212,255,0.3), 0 0 30px rgba(0,212,255,0.2), 0 0 40px rgba(0,212,255,0.1);
            opacity: 0.9;
          }
          50% { 
            text-shadow: 0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.2);
            opacity: 1;
          }
        }
        @keyframes titleGlow {
          0%, 100% { 
            text-shadow: 
              0 0 10px #00d4ff,
              0 0 20px #00d4ff,
              0 0 40px #00d4ff,
              0 0 80px #0088ff,
              0 0 120px #0088ff;
            filter: brightness(1);
          }
          50% { 
            text-shadow: 
              0 0 20px #00d4ff,
              0 0 40px #00d4ff,
              0 0 60px #00d4ff,
              0 0 100px #0088ff,
              0 0 150px #0088ff,
              0 0 200px #00ffff;
            filter: brightness(1.2);
          }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes subtitlePulse {
          0%, 100% { 
            opacity: 0.8;
            letter-spacing: 1px;
          }
          50% { 
            opacity: 1;
            letter-spacing: 3px;
          }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 40 }}>
        
        {/* LOGO - BRUTAL ANIMATED */}
        <div style={{
          width: 120,
          height: 120,
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0,212,255,0.2), transparent 60%), rgba(0,0,0,0.5)',
          border: '3px solid rgba(0,212,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(20px)',
          animation: 'logoFloat 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
          position: 'relative',
        }}>
          {/* Inner Ring */}
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.3)',
            animation: 'glowPulse 3s ease-in-out infinite 0.5s',
          }} />
          <img src="/Logo1.png" alt="SYNTX" width={75} height={75} style={{ 
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))',
          }} />
        </div>

        {/* SYNTX Label unter Logo */}
        <div style={{
          fontSize: 16,
          fontFamily: 'monospace',
          fontWeight: 700,
          color: '#00d4ff',
          letterSpacing: 8,
          marginBottom: 50,
          animation: 'textGlow 3s ease-in-out infinite',
        }}>
          S Y N T X
        </div>

        {/* MAIN TITLE - BRUTAL GLOW */}
        <h1 style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(60px, 12vw, 120px)',
          fontWeight: 900,
          letterSpacing: -3,
          background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 25%, #00ffff 50%, #00d4ff 75%, #ffffff 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease-in-out infinite, titleGlow 3s ease-in-out infinite',
          position: 'relative',
        }}>
          SYNTX
        </h1>

        {/* Subtitle 1 */}
        <h2 style={{
          margin: '25px 0 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(22px, 4vw, 38px)',
          fontWeight: 700,
          color: 'white',
          textShadow: '0 0 30px rgba(255,255,255,0.3), 0 2px 10px rgba(0,0,0,0.5)',
        }}>
          SYNTX isn't AI.
        </h2>

        {/* Subtitle 2 - RESONANZ */}
        <p style={{
          margin: '15px 0 0',
          fontSize: 'clamp(16px, 3vw, 24px)',
          fontWeight: 500,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(90deg, #00d4ff, #00ffaa, #00d4ff)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 3s ease-in-out infinite, subtitlePulse 4s ease-in-out infinite',
          textShadow: '0 0 30px rgba(0,212,255,0.5)',
        }}>
          It's the resonance that governs it
        </p>
      </div>

      {/* LOGIN CARD - ENHANCED */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 400,
        background: 'linear-gradient(135deg, rgba(6,13,24,0.9) 0%, rgba(10,22,40,0.9) 100%)',
        borderRadius: 24,
        border: '1px solid rgba(0,212,255,0.3)',
        backdropFilter: 'blur(30px)',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,212,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Top Glow Line - Animated */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #00d4ff, #00ffaa, #00d4ff, transparent)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 3s linear infinite',
        }} />

        <div style={{ padding: 40 }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'rgba(0,212,255,0.7)',
                marginBottom: 10,
                letterSpacing: 3,
                fontWeight: 600,
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
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(0,212,255,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,212,255,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'rgba(0,212,255,0.7)',
                marginBottom: 10,
                letterSpacing: 3,
                fontWeight: 600,
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
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(0,212,255,0.3)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,212,255,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '14px 18px',
                marginBottom: 20,
                borderRadius: 12,
                background: 'rgba(255,50,50,0.1)',
                border: '1px solid rgba(255,50,50,0.4)',
                color: '#ff6b6b',
                fontSize: 13,
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
                padding: '16px 28px',
                borderRadius: 12,
                border: 'none',
                background: loading || !username || !password
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 50%, #00d4ff 100%)',
                backgroundSize: '200% 200%',
                color: loading || !username || !password ? 'rgba(255,255,255,0.3)' : '#030b15',
                fontSize: 14,
                fontWeight: 800,
                fontFamily: 'monospace',
                letterSpacing: 3,
                cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
                boxShadow: loading || !username || !password ? 'none' : '0 0 30px rgba(0,212,255,0.5), 0 10px 30px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                animation: loading || !username || !password ? 'none' : 'gradientShift 3s ease-in-out infinite',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER FIELD'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        marginTop: 50,
        fontSize: 12,
        color: 'rgba(0,212,255,0.4)',
        fontFamily: 'monospace',
        letterSpacing: 2,
        animation: 'textGlow 4s ease-in-out infinite',
      }}>
        2025 SYNTX SYSTEM
      </div>
    </div>
  );
}
