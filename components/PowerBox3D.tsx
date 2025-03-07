"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ThemeColors } from "./ThemeConstants";
import * as THREE from "three";

// Optimized core dodecahedron with enhanced futuristic effects
const CoreDodecahedron = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);

  // Use useMemo to create geometries and materials only once
  const dodecahedronGeometry = useMemo(
    () => new THREE.DodecahedronGeometry(1.2, 0),
    []
  );
  const wireframeGeometry = useMemo(
    () => new THREE.DodecahedronGeometry(1.25, 0),
    []
  );
  const glowGeometry = useMemo(
    () => new THREE.DodecahedronGeometry(1.35, 0),
    []
  );
  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.7, 0), []);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ThemeColors.dark.background,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
        reflectivity: 1,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: ThemeColors.accent,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  const gridMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ThemeColors.accent,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        wireframeLinewidth: 0.5,
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ThemeColors.accent,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const energyCoreMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: ThemeColors.accent,
        emissive: ThemeColors.accent,
        emissiveIntensity: 2,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const innerGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ThemeColors.accent,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ThemeColors.accent,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  // More efficient animation with controlled frequency
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.001;
      groupRef.current.rotation.y += 0.0015;
    }

    // Optimize by using elapsed time rather than sin calculations each frame
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * 0.8) * 0.1;

    if (pulseRef.current) {
      pulseRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      glowMaterial.opacity = 0.1 + pulse * 0.05;
    }

    if (gridRef.current) {
      // Use a different frequency for variety
      gridMaterial.opacity = 0.5 + Math.sin(t * 0.5) * 0.1;
    }
  });

  // Vertex positions for accent lights (only calculate once)
  const accentPositions = useMemo(() => {
    // Use actual vertices from the dodecahedron for more accurate placement
    const vertices = [];
    const tempGeometry = new THREE.DodecahedronGeometry(1.2, 0);
    const positionArray = tempGeometry.getAttribute("position").array;

    // Sample 5 vertices from the geometry for accent lights
    for (let i = 0; i < 15; i += 9) {
      vertices.push([
        positionArray[i],
        positionArray[i + 1],
        positionArray[i + 2],
      ]);
    }

    return vertices;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Core dodecahedron with improved materials */}
      <mesh
        castShadow
        receiveShadow
        geometry={dodecahedronGeometry}
        material={coreMaterial}
      />

      {/* Edge highlight - using edges geometry for performance */}
      <lineSegments>
        <edgesGeometry args={[wireframeGeometry]} />
        <primitive object={edgeMaterial} />
      </lineSegments>

      {/* Holographic grid overlay */}
      <mesh
        ref={gridRef}
        geometry={wireframeGeometry}
        material={gridMaterial}
      />

      {/* Optimized pulsing outer glow */}
      <mesh ref={pulseRef} geometry={glowGeometry} material={glowMaterial} />

      {/* Energy core */}
      <group scale={[0.6, 0.6, 0.6]}>
        <mesh geometry={coreGeometry} material={energyCoreMaterial} />

        {/* Inner glow for core */}
        <mesh
          scale={[1.2, 1.2, 1.2]}
          geometry={coreGeometry}
          material={innerGlowMaterial}
        />
      </group>

      {/* Accent lights at vertices - using the accent color instead of white */}
      {accentPositions.map((pos, i) => (
        <mesh
          key={i}
          position={[pos[0], pos[1], pos[2]]}
          scale={[0.08, 0.08, 0.08]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <primitive object={accentMaterial} />
        </mesh>
      ))}
    </group>
  );
};

// Optimized scene with better lighting setup
const PowerBoxScene = () => {
  // Use memo for lights to prevent recreating them on each render
  const lights = useMemo(
    () => (
      <>
        {/* Removed the central white point light that was causing the white spot */}
        <ambientLight intensity={0.2} />{" "}
        {/* Slightly increased ambient light to compensate */}
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight
          position={[3, -3, 0]}
          intensity={0.8} // Slightly increased to compensate for removing central light
          color={ThemeColors.secondaryAccents.amber}
          distance={15}
        />
        <pointLight
          position={[-3, 3, 0]}
          intensity={0.8} // Slightly increased to compensate for removing central light
          color={ThemeColors.accent}
          distance={15}
        />
        {/* Added a subtle colored light from another angle to maintain even illumination */}
        <pointLight
          position={[0, 3, -3]}
          intensity={0.4}
          color={ThemeColors.accent}
          distance={12}
        />
      </>
    ),
    []
  );

  return (
    <group>
      <CoreDodecahedron />
      {lights}
    </group>
  );
};

// Exported component with performance optimizations
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
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        dpr={Math.min(2, window.devicePixelRatio)}
        shadows={false} // Disable shadows for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
        }}
        performance={{ min: 0.5 }} // Allow frame rate to drop for better performance
      >
        <PowerBoxScene />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
