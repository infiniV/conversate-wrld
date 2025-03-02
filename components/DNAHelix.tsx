"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, MeshStandardMaterial } from "three";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
interface DNAHelixProps {
  color: string;
  count?: number;
  radius?: number;
  height?: number;
  speed?: number;
  distortion?: number;
  isActive?: boolean;
}

export const DNAHelix = ({
  color = "#FF3D71",
  count = 40,
  radius = 2,
  height = 6,
  speed = 0.5,
  //   distortion = 0.2,
  isActive = false,
}: DNAHelixProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta * speed;

    if (groupRef.current) {
      groupRef.current.rotation.y = time.current * 0.2;

      // Add floating motion
      groupRef.current.position.y = Math.sin(time.current) * 0.1;
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        0.5 + Math.sin(time.current * 2) * 0.2;
    }
  });

  const generatePoints = () => {
    const points: { position: Vector3; scale: number }[] = [];
    const turns = 3; // Number of complete turns

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2 * turns;
      const vertical = (i / count - 0.5) * height;

      // First strand
      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      points.push({
        position: new Vector3(x1, vertical, z1),
        scale: isActive ? 0.15 + Math.sin(t) * 0.05 : 0.12,
      });

      // Second strand
      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;
      points.push({
        position: new Vector3(x2, vertical, z2),
        scale: isActive ? 0.15 + Math.sin(t) * 0.05 : 0.12,
      });

      // Connecting bars (base pairs)
      if (i % 2 === 0) {
        const xc = (x1 + x2) / 2;
        const zc = (z1 + z2) / 2;
        points.push({
          position: new Vector3(xc, vertical, zc),
          scale: 0.08,
        });
      }
    }

    return points;
  };

  return (
    <group ref={groupRef}>
      <Instances limit={count * 3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
        {generatePoints().map((point, i) => (
          <Instance key={i} position={point.position} scale={point.scale} />
        ))}
      </Instances>
    </group>
  );
};
