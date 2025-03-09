import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Color } from "three";

interface SaturnRingsProps {
  color?: string | THREE.Color;
  radius?: number;
  width?: number;
  opacity?: number;
  rotation?: number;
}

export const SaturnRings: React.FC<SaturnRingsProps> = ({
  color = "#FF3D71",
  radius = 1.8,
  width = 0.4,
  opacity = 0.15,
  rotation = 0.6,
}) => {
  const ringsRef = useRef<THREE.Mesh>(null);
  const colorObj = color instanceof Color ? color : new Color(color);

  useFrame((state, delta) => {
    if (!ringsRef.current) return;
    ringsRef.current.rotation.x = rotation;
    ringsRef.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={ringsRef} rotation={[rotation, 0, 0]}>
      <ringGeometry args={[radius - width / 2, radius + width / 2, 64]} />
      <meshBasicMaterial
        color={colorObj}
        transparent={true}
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default SaturnRings;
