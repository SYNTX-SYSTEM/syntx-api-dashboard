"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function SyntxCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z = t * 0.3;
      ringsRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.1} />
      </mesh>

      {/* Core Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rotating Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 2, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Floating Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
}

function FloatingParticle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = 0.5 + Math.random() * 0.5;
  const radius = 2.5 + Math.random() * 1.5;
  const offset = (index / 50) * Math.PI * 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t + offset) * radius;
      meshRef.current.position.y = Math.sin(t * 1.5 + offset) * radius * 0.5;
      meshRef.current.position.z = Math.sin(t + offset) * radius;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={index % 2 === 0 ? "#00ffff" : "#00ff88"} />
    </mesh>
  );
}

export function Logo3D({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
          <SyntxCore />
        </Suspense>
      </Canvas>
    </div>
  );
}
