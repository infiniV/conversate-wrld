import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Vector3, MathUtils, Color } from "three";
import * as THREE from "three";
import { ThemeColors } from "./ThemeConstants";

interface OrbProps {
  grainCount?: number;
  radius?: number;
  grainSize?: number;
  color?: string | THREE.Color;
  hoverColor?: string | THREE.Color;
  pulsateSpeed?: number;
  pulsateStrength?: number;
  rotationSpeed?: number;
  noiseStrength?: number;
  distortionStrength?: number;
  vertexColors?: boolean;
  voiceMode?: boolean; // Add this new prop
}

export const OrbComponent: React.FC<OrbProps> = ({
  grainCount = 1200, // Increased grain count for better visual impact
  radius = 1.0, // Larger radius to make the orb more prominent
  grainSize = 0.013, // Slightly larger grain size for visibility
  color = ThemeColors.accent,
  hoverColor = ThemeColors.secondaryAccents.slate,
  pulsateSpeed = 0.13,
  pulsateStrength = 0.025, // Enhanced pulsation for more dynamism
  rotationSpeed = 0.04, // Slightly slower for more elegant movement
  noiseStrength = 0.12, // Increased noise for more organic feel
  distortionStrength = 0.5, // Stronger distortion on interaction
  vertexColors = false,
  voiceMode = false, // Default to false if not provided
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const time = useRef(0);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Generate initial grain positions and optional colors
  const { positions, initialPositions, colors } = useMemo(() => {
    const positions = new Float32Array(grainCount * 3);
    const initialPositions = new Float32Array(grainCount * 3);
    const colors = vertexColors ? new Float32Array(grainCount * 3) : null;

    // Use Fibonacci sphere with reduced jitter for closer grain placement
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < grainCount; i++) {
      const y = 1 - (i / (grainCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y position

      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Reduced jitter amount for tighter packing
      const jitterAmount = 0.02;
      const jx = (Math.random() * 2 - 1) * jitterAmount;
      const jy = (Math.random() * 2 - 1) * jitterAmount;
      const jz = (Math.random() * 2 - 1) * jitterAmount;

      // Add small inward offset to create slightly denser core
      const distance = Math.sqrt(x * x + y * y + z * z);
      const inwardBias = 0.1; // Slight inward pull
      const densityFactor = 0.95; // Makes particles slightly closer to center

      const finalX =
        ((x + jx) * distance * densityFactor + x * inwardBias) * radius;
      const finalY =
        ((y + jy) * distance * densityFactor + y * inwardBias) * radius;
      const finalZ =
        ((z + jz) * distance * densityFactor + z * inwardBias) * radius;

      positions[i * 3] = finalX;
      positions[i * 3 + 1] = finalY;
      positions[i * 3 + 2] = finalZ;

      initialPositions[i * 3] = finalX;
      initialPositions[i * 3 + 1] = finalY;
      initialPositions[i * 3 + 2] = finalZ;

      // Create color variations if vertexColors is enabled
      if (colors) {
        for (let i = 0; i < grainCount; i++) {
          // Calculate distance from center (0-1)
          const idx = i * 3;
          const x = positions[idx] / radius;
          const y = positions[idx + 1] / radius;
          const z = positions[idx + 2] / radius;

          const distance = Math.sqrt(x * x + y * y + z * z) / 1.2;

          // Convert string color to THREE.Color
          const colorObj = new Color(color.toString());

          // Introduce subtle variations based on position
          const hue = colorObj.getHSL({ h: 0, s: 0, l: 0 }).h;
          const saturation = colorObj.getHSL({ h: 0, s: 0, l: 0 }).s;
          const lightness = colorObj.getHSL({ h: 0, s: 0, l: 0 }).l;

          // Vary saturation and lightness based on position
          const newColor = new Color().setHSL(
            hue + Math.sin(y * 10) * 0.05,
            saturation * (0.9 + distance * 0.2),
            lightness * (0.8 + Math.sin(x * 10) * 0.2)
          );

          colors[idx] = newColor.r;
          colors[idx + 1] = newColor.g;
          colors[idx + 2] = newColor.b;
        }
      }
    }

    return { positions, initialPositions, colors };
  }, [grainCount, radius, color, vertexColors]);

  // Animation and hover effect
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    time.current += delta;

    // Update material properties with smooth transition on hover
    if (materialRef.current) {
      // Ensure color is properly applied
      if (!vertexColors) {
        const currentColor = materialRef.current.color;
        // Force string colors to be new Color objects
        const currentColorValue = hovered ? hoverColor : color;
        const targetColor = new Color(
          typeof currentColorValue === "object" &&
          !(currentColorValue instanceof Color) &&
          "500" in currentColorValue
            ? currentColorValue[500]
            : currentColorValue
        );

        currentColor.r = MathUtils.lerp(
          currentColor.r,
          targetColor.r,
          delta * 5
        );
        currentColor.g = MathUtils.lerp(
          currentColor.g,
          targetColor.g,
          delta * 5
        );
        currentColor.b = MathUtils.lerp(
          currentColor.b,
          targetColor.b,
          delta * 5
        );
      }

      // Pulse size effect
      const baseSize = grainSize * (voiceMode ? 1.2 : 1.0);
      const pulseFactor = voiceMode ? pulsateStrength * 1.5 : pulsateStrength;

      materialRef.current.size =
        baseSize *
        (1 + Math.sin(time.current * pulsateSpeed * Math.PI * 2) * pulseFactor);

      // Adjust opacity based on voice mode
      materialRef.current.opacity = voiceMode ? 0.95 : 0.9;

      // Make sure points are perfectly round
      materialRef.current.alphaTest = 0.01;
      materialRef.current.map = null;
      materialRef.current.sizeAttenuation = true;
    }

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    // Adjust rotation speed in voice mode
    const currentRotationSpeed = voiceMode
      ? rotationSpeed * 1.2
      : rotationSpeed;
    pointsRef.current.rotation.y += delta * currentRotationSpeed;
    pointsRef.current.rotation.z += delta * currentRotationSpeed * 0.3;

    // Apply enhanced distortion and animation in voice mode
    for (let i = 0; i < grainCount; i++) {
      const i3 = i * 3;

      // Get initial position
      const initialX = initialPositions[i3];
      const initialY = initialPositions[i3 + 1];
      const initialZ = initialPositions[i3 + 2];

      // Enhance noise effects in voice mode
      const currentNoiseStrength = voiceMode
        ? noiseStrength * 1.3
        : noiseStrength;
      const voicePulse = voiceMode ? Math.sin(time.current * 2) * 0.05 : 0;

      const noiseX =
        Math.sin(initialX * 2 + time.current) *
        Math.sin(initialY * 3 + time.current * 0.7) *
        (currentNoiseStrength + voicePulse);

      const noiseY =
        Math.sin(initialY * 2 + time.current * 0.8) *
        Math.sin(initialZ * 3 + time.current * 0.6) *
        (currentNoiseStrength + voicePulse);

      const noiseZ =
        Math.sin(initialZ * 2 + time.current * 0.9) *
        Math.sin(initialX * 3 + time.current * 0.5) *
        (currentNoiseStrength + voicePulse);

      // Enhanced clustering effect in voice mode
      const clusterFactor = voiceMode ? 0.03 : 0.02;
      const clusterX = Math.sin(initialX * 10 + initialY * 8) * clusterFactor;
      const clusterY = Math.sin(initialY * 10 + initialZ * 8) * clusterFactor;
      const clusterZ = Math.sin(initialZ * 10 + initialX * 8) * clusterFactor;

      let finalX = initialX + noiseX + clusterX;
      let finalY = initialY + noiseY + clusterY;
      let finalZ = initialZ + noiseZ + clusterZ;

      if (hovered) {
        // Create more pronounced distortion when hovered
        const distortionPoint = mousePosition.clone().normalize();
        const grainPos = new Vector3(initialX, initialY, initialZ);

        // Calculate influence based on angle between mouse and point
        // Enhanced formula for more dramatic effect
        const angle = grainPos.angleTo(distortionPoint);
        const currentDistortionStrength = voiceMode
          ? distortionStrength * 1.4
          : distortionStrength;

        const distortionFactor =
          Math.max(0, 1 - angle / Math.PI) * currentDistortionStrength * 1.2;

        // Apply mouse-based distortion
        finalX += distortionPoint.x * distortionFactor;
        finalY += distortionPoint.y * distortionFactor;
        finalZ += distortionPoint.z * distortionFactor * 0.6;
      }

      // Apply position with damping for smooth transitions
      const lerpFactor = voiceMode ? delta * 4 : delta * 3;
      positions[i3] = MathUtils.lerp(positions[i3], finalX, lerpFactor);
      positions[i3 + 1] = MathUtils.lerp(positions[i3 + 1], finalY, lerpFactor);
      positions[i3 + 2] = MathUtils.lerp(positions[i3 + 2], finalZ, lerpFactor);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition(new Vector3(x, y, 0).multiplyScalar(radius));
  };

  // Clean up geometry on unmount
  useEffect(() => {
    // Store refs in variables to avoid stale closures in cleanup function
    const currentPointsRef = pointsRef.current;
    const currentMaterialRef = materialRef.current;

    return () => {
      if (currentPointsRef?.geometry) {
        currentPointsRef.geometry.dispose();
      }
      if (currentMaterialRef) {
        currentMaterialRef.dispose();
      }
    };
  }, []);

  // Log color values for debugging
  useEffect(() => {
    console.log("Color value:", color);
    console.log("Hover color value:", hoverColor);
  }, [color, hoverColor]);

  return (
    <points
      ref={pointsRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onPointerMove={handlePointerMove}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {vertexColors && colors && (
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        )}
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={grainSize}
        sizeAttenuation={true}
        color={new THREE.Color(color.toString())}
        vertexColors={vertexColors ? true : false}
        transparent={true}
        opacity={0.9} // Slight increase in opacity for better visibility
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
};
