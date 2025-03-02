"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Line,
  Html,
  PerspectiveCamera,
  Trail,
  Environment,
} from "@react-three/drei";
import { Vector3, Color } from "three";
// import { DNAHelix } from "./DNAHelix";
import { ThemeColors } from "./ThemeConstants";
import { easing } from "maath";
import * as THREE from "three";
import React from "react";

// Updated camera positions for better centering on each feature
const CAMERA_POSITIONS = [
  { position: [0, 0, 6], target: [0, 0, 0] }, // Center view
  { position: [-3.8, 0.5, 4], target: [-2.8, 0, 0] }, // Feature 1 - more direct view
  { position: [3.8, 0.5, 4], target: [2.8, 0, 0] }, // Feature 2 - more direct view
  { position: [0, 4, 4], target: [0, 2.8, 0] }, // Feature 3 - more direct view
  { position: [0, -4, 4], target: [0, -2.8, 0] }, // Feature 4 - more direct view
];

interface FeatureItem {
  title: string;
  description: string;
  color: string;
  icon: React.ComponentType<{
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }>;
}

interface CentralFeatureHubProps {
  activeFeature: number | null;
  onFeatureSelect: (index: number | null) => void;
  features: FeatureItem[];
  isDark: boolean;
}

export const CentralFeatureHub = ({
  activeFeature,
  onFeatureSelect,
  features,
  isDark,
}: CentralFeatureHubProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const centralCoreRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const time = useRef(0);
  const nodeMaterials = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

  // Calculate positions for feature nodes in a tighter arrangement
  const featurePositions = useMemo(() => {
    return features.map((_, index) => {
      const angle = (index / features.length) * Math.PI * 2 + Math.PI / 4;
      const distance = 3.2; // Reduced distance for more compact layout
      return new Vector3(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        0
      );
    });
  }, [features]);

  // Enhanced camera animation for better feature focusing
  useFrame((state, delta) => {
    time.current += delta;

    // Rotate central system with subtle movement
    if (centralCoreRef.current) {
      centralCoreRef.current.rotation.y = time.current * 0.12;
      centralCoreRef.current.rotation.z = Math.sin(time.current * 0.08) * 0.03;
      centralCoreRef.current.position.y = Math.sin(time.current * 0.4) * 0.05;
    }

    // Only rotate when no feature is active
    if (groupRef.current) {
      if (activeFeature === null) {
        // Normal rotation when no feature is selected
        groupRef.current.rotation.y = time.current * 0.04;
      } else {
        // When feature is selected, smoothly rotate to face camera
        const targetAngle = activeFeature * (Math.PI / 2) + Math.PI / 4;
        const currentAngle = groupRef.current.rotation.y % (Math.PI * 2);
        const angleDiff =
          ((targetAngle - currentAngle + Math.PI * 3) % (Math.PI * 2)) -
          Math.PI;

        groupRef.current.rotation.y += angleDiff * delta * 2;
      }
    }

    // Smoother camera transitions with improved targeting
    if (cameraRef.current) {
      const targetIndex = activeFeature !== null ? activeFeature + 1 : 0;
      const targetPos = CAMERA_POSITIONS[targetIndex].position;
      const targetLook = CAMERA_POSITIONS[targetIndex].target;

      // Reduced jitter for clearer focus
      const cameraJitter = activeFeature !== null ? 0.01 : 0.03;
      const jitteredPosition = [
        targetPos[0] + Math.sin(time.current * 0.5) * cameraJitter,
        targetPos[1] + Math.sin(time.current * 0.4) * cameraJitter,
        targetPos[2] + Math.sin(time.current * 0.3) * cameraJitter,
      ];

      // Slower, smoother damping for feature viewing
      const dampingFactor = activeFeature !== null ? 0.05 : 0.04;

      // Apply smooth camera movement
      easing.damp3(
        cameraRef.current.position,
        new Vector3(...jitteredPosition),
        dampingFactor,
        delta
      );

      // More direct look-at behavior for active features
      const currentTarget = new Vector3(...targetLook);
      const currentLookAt = new Vector3();
      cameraRef.current.getWorldDirection(currentLookAt);
      const targetDirection = currentTarget
        .clone()
        .sub(cameraRef.current.position)
        .normalize();

      // Faster convergence when focusing on a feature
      const lookStepFactor = activeFeature !== null ? 3 : 0.8;
      const step = delta * lookStepFactor;

      // Apply look-at smoothly
      cameraRef.current.lookAt(
        cameraRef.current.position
          .clone()
          .add(currentLookAt.lerp(targetDirection, step))
      );

      // Sync with main camera
      state.camera.position.copy(cameraRef.current.position);
      state.camera.quaternion.copy(cameraRef.current.quaternion);
    }

    // Subtle node animations
    nodeMaterials.current.forEach((material, index) => {
      if (material) {
        if (hoveredNode === index || activeFeature === index) {
          material.emissiveIntensity = 0.6 + Math.sin(time.current * 2.5) * 0.2;
        } else {
          material.emissiveIntensity = 0.3;
        }
      }
    });
  });

  const handleNodeClick = (index: number) => {
    onFeatureSelect(activeFeature === index ? null : index);
  };

  return (
    <>
      {/* Subtle environment lighting that matches theme */}
      <Environment preset={isDark ? "night" : "city"} background={false} />
      <ambientLight intensity={0.5} />

      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 6]}
        fov={95}
      />

      <group ref={groupRef}>
        {/* Ambient particles - fewer for more subtle effect */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  Array(150 * 3)
                    .fill(0)
                    .map((_, i) => {
                      if (i % 3 === 0) {
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const r = 4 + Math.random() * 3;

                        return r * Math.sin(phi) * Math.cos(theta);
                      } else if (i % 3 === 1) {
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const r = 4 + Math.random() * 3;

                        return r * Math.sin(phi) * Math.sin(theta);
                      } else {
                        // const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const r = 4 + Math.random() * 3;

                        return r * Math.cos(phi);
                      }
                    })
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={
              isDark
                ? ThemeColors.dark.secondaryText
                : ThemeColors.light.secondaryText
            }
            transparent
            opacity={0.2}
            sizeAttenuation
          />
        </points>

        {/* Central hub - uses ThemeColors */}
        <group position={[0, 0, 0]} ref={centralCoreRef}>
          {/* Core DNA Helix */}
          {/* <DNAHelix
            color={ThemeColors.accent}
            radius={0.9} // Slightly smaller
            height={2.5} // Slightly smaller
            count={24}
            speed={0.25}
            isActive={true}
          /> */}

          {/* Inner energy core */}
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={ThemeColors.accent}
              emissive={ThemeColors.accent}
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.7}
              opacity={0.9}
              transparent
            />
          </mesh>

          {/* Outer rings with ThemeColors */}
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[2, 0.05, 24, 64]} />
            <meshStandardMaterial
              color={
                isDark ? ThemeColors.dark.border : ThemeColors.light.border
              }
              emissive={ThemeColors.accent}
              emissiveIntensity={0.08}
              roughness={0.4}
              metalness={0.6}
              opacity={0.5}
              transparent
            />
          </mesh>

          <mesh rotation-x={Math.PI / 3}>
            <torusGeometry args={[1.8, 0.03, 16, 48]} />
            <meshStandardMaterial
              color={
                isDark ? ThemeColors.dark.subtleUI : ThemeColors.light.subtleUI
              }
              emissive={ThemeColors.secondaryAccents.emerald}
              emissiveIntensity={0.06}
              roughness={0.5}
              metalness={0.5}
              opacity={0.4}
              transparent
            />
          </mesh>
        </group>

        {/* Connection lines with ThemeColors-based styling */}
        {featurePositions.map((position, index) => (
          <group key={`connection-${index}`}>
            <Trail
              width={0.8}
              color={new Color(features[index].color)}
              length={12} // Reduced for cleaner look
              decay={1}
              attenuation={(width) => width}
            >
              <mesh>
                <sphereGeometry args={[0.03, 12, 12]} />
                <meshBasicMaterial color={features[index].color} />
              </mesh>
            </Trail>

            <Line
              points={[new Vector3(0, 0, 0), position]}
              color={new Color(features[index].color)}
              lineWidth={0.8}
              opacity={activeFeature === index ? 0.8 : 0.3}
              transparent
            />
          </group>
        ))}

        {/* Feature nodes using ThemeColors */}
        {featurePositions.map((position, index) => (
          <group key={`feature-${index}`} position={position}>
            {/* Main node */}
            <mesh
              onClick={() => handleNodeClick(index)}
              onPointerOver={() => setHoveredNode(index)}
              onPointerOut={() => setHoveredNode(null)}
              scale={hoveredNode === index || activeFeature === index ? 1.2 : 1}
            >
              <sphereGeometry args={[0.4, 24, 24]} />
              <meshStandardMaterial
                ref={(el) => {
                  nodeMaterials.current[index] = el;
                }}
                color={features[index].color}
                emissive={features[index].color}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            {/* Secondary glow */}
            <mesh scale={1.15}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshBasicMaterial
                color={features[index].color}
                transparent
                opacity={0.1}
              />
            </mesh>

            {/* Orbital ring */}
            <mesh rotation-x={Math.random() * Math.PI} scale={1.1}>
              <torusGeometry args={[0.5, 0.02, 16, 64]} />
              <meshBasicMaterial
                color={features[index].color}
                transparent
                opacity={0.2}
              />
            </mesh>

            {/* Icon with ThemeColors-based styling */}
            <Html
              position={[0, 0.8, 0]}
              center
              style={{ pointerEvents: "none" }}
              distanceFactor={12}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  activeFeature === index
                    ? isDark
                      ? "bg-black/60"
                      : "bg-white/60"
                    : isDark
                    ? "bg-black/30"
                    : "bg-white/30"
                } backdrop-blur-md shadow-md`}
                style={{
                  border: `1px solid ${features[index].color}40`,
                }}
              >
                {React.createElement(features[index].icon, {
                  size: 20,
                  style: { color: features[index].color },
                  className: "opacity-90",
                })}
              </div>
            </Html>

            {/* Detail panel with ThemeColors styling */}
            {activeFeature === index && (
              <Html
                position={[position.x > 0 ? 1.8 : -1.8, 0, 0.5]}
                center
                distanceFactor={10}
                occlude={[]} // Don't occlude detail card for better visibility
                transform
              >
                <div
                  className={`w-64 p-4 rounded-xl ${
                    isDark
                      ? "bg-[" + ThemeColors.dark.subtleUI + "]/95"
                      : "bg-[" + ThemeColors.light.subtleUI + "]/95"
                  } backdrop-blur-lg shadow-lg`}
                  style={{
                    border: `1px solid ${features[index].color}30`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 8px ${features[index].color}30`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${features[index].color}15` }}
                    >
                      {React.createElement(features[index].icon, {
                        size: 16,
                        style: { color: features[index].color },
                      })}
                    </div>
                    <h3 className="text-base font-bold">
                      {features[index].title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-[" + ThemeColors.dark.secondaryText + "]"
                        : "text-[" + ThemeColors.light.secondaryText + "]"
                    }`}
                  >
                    {features[index].description}
                  </p>
                </div>
              </Html>
            )}
          </group>
        ))}
      </group>
    </>
  );
};
