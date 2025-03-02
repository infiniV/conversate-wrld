import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AmbientOrb = ({ color = "#FF3D71" }) => {
  const group = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      // Gentle rotation of the entire orb structure
      group.current.rotation.z += delta * 0.03;
      group.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.02;

      // Core sphere pulsing
      if (sphereRef.current) {
        const t = state.clock.elapsedTime;
        const scalePulse = 1 + Math.sin(t * 0.6) * 0.03;
        sphereRef.current.scale.set(scalePulse, scalePulse, scalePulse);
      }

      // Ring animations
      ringRefs.current.forEach((mesh, i) => {
        if (mesh) {
          const t = state.clock.elapsedTime;
          const offset = i * 0.2;

          // Subtle 3D movement
          mesh.rotation.x = Math.sin(t * 0.2 + offset) * 0.06;
          mesh.rotation.y = Math.cos(t * 0.15 + offset) * 0.06;

          // Variation in rotation speeds
          mesh.rotation.z += delta * 0.01 * (i % 2 ? 1 : -1);

          // Subtle scale breathing effect
          const ringPulse = 1 + Math.sin(t * 0.3 + offset) * 0.015;
          mesh.scale.set(ringPulse, ringPulse, 1);
        }
      });
    }
  });

  return (
    <group ref={group}>
      {/* Core sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbital rings at different angles with depth */}
      {[...Array(5)].map((_, i) => {
        const radius = 0.18 + i * 0.03;
        const thickness = 0.004 - i * 0.0005;
        const angle = (i * Math.PI) / 5;

        return (
          <mesh
            key={i}
            rotation={[angle, i * 0.7, angle * 0.8]}
            ref={(el) => (ringRefs.current[i] = el as THREE.Mesh)}
          >
            <torusGeometry args={[radius, thickness, 6, 32]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.2 - i * 0.02}
              emissive={color}
              emissiveIntensity={0.6 - i * 0.08}
              roughness={0.3}
              metalness={0.8}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Accent elements */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const radius = 0.16;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = i % 2 === 0 ? 0.06 : -0.06;

        return (
          <mesh key={`particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.004, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default AmbientOrb;
