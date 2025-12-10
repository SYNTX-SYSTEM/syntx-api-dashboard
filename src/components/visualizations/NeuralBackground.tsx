"use client";

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];
    const nodeCount = 50;
    const connectionDistance = 150;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initNodes() {
      if (!canvas) return;
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1
        });
      }
    }

    function drawNode(node: Node, pulse: number) {
      if (!ctx) return;
      const glow = 0.3 + Math.sin(pulse + node.x * 0.01) * 0.2;
      
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 8);
      gradient.addColorStop(0, `rgba(0, 255, 255, ${glow * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(0, 255, 255, ${0.6 + glow * 0.4})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawConnection(node1: Node, node2: Node, distance: number) {
      if (!ctx) return;
      const opacity = (1 - distance / connectionDistance) * 0.15;
      
      const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
      gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(0, 255, 136, ${opacity * 1.5})`);
      gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      ctx.stroke();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pulse = Date.now() * 0.002;

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            drawConnection(nodes[i], nodes[j], distance);
          }
        }
      }

      nodes.forEach(node => drawNode(node, pulse));
      animationId = requestAnimationFrame(animate);
    }

    resize();
    initNodes();
    animate();

    const handleResize = () => { resize(); initNodes(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
