"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ThemeColors } from "./ThemeConstants";
import * as THREE from "three";

// Core box with enhanced futuristic effects
const CoreBox = () => {
  const boxRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.002;
      boxRef.current.rotation.y += 0.003;
    }

    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime()) * 0.1;
      pulseRef.current.scale.set(1.15 + pulse, 1.15 + pulse, 1.15 + pulse);
      if (pulseRef.current.material instanceof THREE.Material) {
        pulseRef.current.material.opacity = 0.1 + pulse * 0.05;
      }
    }

    if (gridRef.current && gridRef.current.material instanceof THREE.Material) {
      gridRef.current.material.opacity =
        0.5 + Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group ref={boxRef}>
      {/* Core box with improved materials */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial
          color={ThemeColors.dark.background}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
          reflectivity={1}
        />
      </mesh>

      {/* Multiple edge layers for enhanced glow */}
      {[1.001, 1.002, 1.003].map((scale, i) => (
        <lineSegments key={i}>
          <edgesGeometry
            args={[
              new THREE.BoxGeometry(2.05 * scale, 2.05 * scale, 2.05 * scale),
            ]}
          />
          <lineBasicMaterial
            color={ThemeColors.accent}
            transparent={true}
            opacity={0.5 - i * 0.15}
            linewidth={1}
          />
        </lineSegments>
      ))}

      {/* Holographic grid overlay */}
      <mesh ref={gridRef} scale={[1.01, 1.01, 1.01]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial
          color={ThemeColors.accent}
          transparent={true}
          opacity={0.1}
          wireframe={true}
          wireframeLinewidth={0.5}
        />
      </mesh>

      {/* Enhanced pulsing outer glow */}
      <mesh ref={pulseRef} scale={[1.15, 1.15, 1.15]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial
          color={ThemeColors.accent}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Energy core with improved visuals */}
      <group scale={[0.6, 0.6, 0.6]}>
        <mesh>
          <dodecahedronGeometry args={[1, 0]} />
          <meshPhongMaterial
            color={ThemeColors.accent}
            emissive={ThemeColors.accent}
            emissiveIntensity={2}
            shininess={100}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
        {/* Inner glow for core */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={ThemeColors.accent}
            transparent={true}
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Corner accent lights */}
      {[
        [-1, -1, -1],
        [1, 1, 1],
        [-1, 1, -1],
        [1, -1, 1],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0], pos[1], pos[2]]}
          scale={[0.1, 0.1, 0.1]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={ThemeColors.accent}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main scene component
const PowerBoxScene = () => {
  return (
    <group>
      <CoreBox />

      {/* Enhanced lighting setup */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        color="#ffffff"
        distance={8}
      />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight
        position={[3, -3, 0]}
        intensity={1}
        color={ThemeColors.secondaryAccents.amber}
        distance={15}
      />
      <pointLight
        position={[-3, 3, 0]}
        intensity={1}
        color={ThemeColors.accent}
        distance={15}
      />
    </group>
  );
};

// Exported component with client-side rendering safeguard
export const PowerBox3D = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="w-24 h-24 rounded-lg animate-pulse bg-gradient-to-br from-accent/20 to-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-visible">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <PowerBoxScene />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
