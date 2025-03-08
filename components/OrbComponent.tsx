import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Vector3, MathUtils, Color } from "three";
import * as THREE from "three";
import { ThemeColors } from "./ThemeConstants";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";

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
  explosionForce?: number;
  explosionDuration?: number;
}

export const OrbComponent: React.FC<OrbProps> = ({
  grainCount = 3600, // Increased for more ethereal density
  radius = 1.0,
  grainSize = 0.009, // Smaller particles for finer detail
  color = ThemeColors.accent,
  hoverColor = ThemeColors.secondaryAccents.slate,
  pulsateSpeed = 0.08, // Slower, more ethereal pulsing
  pulsateStrength = 0.035, // Stronger pulsation
  rotationSpeed = 0.04, // Slightly slower for more elegant movement
  noiseStrength = 0.12, // Increased noise for more organic feel
  distortionStrength = 0.15, // Reduced from 0.5 for subtler effect
  vertexColors = false,
  voiceMode = false, // Default to false if not provided
  explosionForce = 15,
  explosionDuration = 2.5,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );
  const time = useRef(0);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const [isExploding, setIsExploding] = useState(false);
  const explosionProgress = useRef(0);
  const explosionVectors = useRef<Vector3[]>([]);

  // Generate initial grain positions and optional colors
  const { positions, initialPositions, colors } = useMemo(() => {
    const positions = new Float32Array(grainCount * 3);
    const initialPositions = new Float32Array(grainCount * 3);
    const colors = vertexColors ? new Float32Array(grainCount * 3) : null;

    // Enhanced particle distribution with 6 distinct layers
    for (let i = 0; i < grainCount; i++) {
      const layerIndex = Math.floor(i / (grainCount / 6));
      // Create varying layer densities
      const layerRadius = radius * (0.7 + (layerIndex * 0.3) / 5);

      // Golden ratio based distribution for more natural spacing
      const golden = (1 + Math.sqrt(5)) / 2;
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(
        1 - (2 * (i % (grainCount / 6))) / (grainCount / 6)
      );

      // Calculate position with spiral offset
      let x = layerRadius * Math.sin(phi) * Math.cos(theta);
      let y = layerRadius * Math.sin(phi) * Math.sin(theta);
      let z = layerRadius * Math.cos(phi);

      // Add ethereal wave pattern
      const wavePhase = (layerIndex / 5) * Math.PI * 2;
      const waveAmplitude = 0.08 * (1 - layerIndex / 5);
      x += Math.sin(phi * 4 + wavePhase) * waveAmplitude;
      y += Math.cos(theta * 4 + wavePhase) * waveAmplitude;
      z += Math.sin((phi + theta) * 2) * waveAmplitude;

      // Add very subtle randomness for organic feel
      const jitter = 0.02 * (1 - Math.abs(y) / radius);
      x += (Math.random() - 0.5) * jitter;
      y += (Math.random() - 0.5) * jitter;
      z += (Math.random() - 0.5) * jitter;

      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      initialPositions[idx] = x;
      initialPositions[idx + 1] = y;
      initialPositions[idx + 2] = z;

      if (colors) {
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z) / radius;
        const layerFactor = layerIndex / 5;

        const colorObj = new Color(color.toString());
        const { h, s, l } = colorObj.getHSL({ h: 0, s: 0, l: 0 });

        // Enhanced ethereal color variation
        const newColor = new Color().setHSL(
          h + layerFactor * 0.1 + Math.sin(phi * 3) * 0.05,
          s * (0.5 + distanceFromCenter * 0.5),
          l * (0.4 + layerFactor * 0.6 + distanceFromCenter * 0.3)
        );

        colors[idx] = newColor.r;
        colors[idx + 1] = newColor.g;
        colors[idx + 2] = newColor.b;
      }
    }

    return { positions, initialPositions, colors };
  }, [grainCount, radius, color, vertexColors]);

  // Add this after the existing useMemo for positions
  useMemo(() => {
    // Create explosion vectors for each particle
    explosionVectors.current = Array(grainCount)
      .fill(0)
      .map((_, i) => {
        const pos = new Vector3(
          initialPositions[i * 3],
          initialPositions[i * 3 + 1],
          initialPositions[i * 3 + 2]
        );
        // Create random explosion direction with outward bias
        return pos
          .clone()
          .normalize()
          .add(
            new Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            )
          )
          .normalize()
          .multiplyScalar(explosionForce * (0.8 + Math.random() * 0.4));
      });
  }, [grainCount, initialPositions, explosionForce]);

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

    // Update explosion progress
    if (isExploding) {
      explosionProgress.current = Math.min(
        explosionProgress.current + delta / explosionDuration,
        1
      );
      if (explosionProgress.current >= 1) {
        setIsExploding(false);
        explosionProgress.current = 0;
      }
    }

    // Apply enhanced distortion and animation in voice mode
    for (let i = 0; i < grainCount; i++) {
      const i3 = i * 3;
      const initialX = initialPositions[i3];
      const initialY = initialPositions[i3 + 1];
      const initialZ = initialPositions[i3 + 2];

      // Calculate radial distance for layered movement
      const distance = Math.sqrt(
        initialX * initialX + initialY * initialY + initialZ * initialZ
      );

      // Enhanced breathing effect
      const breathingPhase = (distance / radius) * Math.PI + time.current;
      const depthFactor = Math.pow(distance / radius, 2);
      const breathingAmount =
        (Math.sin(breathingPhase) * 0.04 +
          Math.sin(breathingPhase * 0.5) * 0.02) *
        depthFactor;

      // Ethereal wave motion
      const wavePhase = time.current * 0.5;
      const heightFactor = initialY / radius;
      const spiralFactor = Math.atan2(initialZ, initialX);

      const noiseX =
        (Math.sin(wavePhase + spiralFactor * 2) * 0.02 +
          Math.sin(heightFactor * 4 + time.current) * 0.01) *
        noiseStrength;

      const noiseY =
        (Math.cos(wavePhase * 1.2 + heightFactor * 3) * 0.02 +
          Math.sin(spiralFactor * 3 + time.current * 0.7) * 0.01) *
        noiseStrength;

      const noiseZ =
        (Math.sin(wavePhase * 0.8 + heightFactor * 2) * 0.02 +
          Math.cos(spiralFactor * 4 + time.current * 0.9) * 0.01) *
        noiseStrength;

      let finalX = initialX * (1 + breathingAmount) + noiseX;
      let finalY = initialY * (1 + breathingAmount) + noiseY;
      let finalZ = initialZ * (1 + breathingAmount) + noiseZ;

      if (isExploding) {
        // Explosion animation
        const progress = explosionProgress.current;
        const returnEase = Math.sin(progress * Math.PI); // Smooth out and back

        const explosionVector = explosionVectors.current[i];
        const distanceFactor =
          Math.sqrt(
            initialX * initialX + initialY * initialY + initialZ * initialZ
          ) / radius;

        // Apply explosion force with return animation
        finalX += explosionVector.x * returnEase * distanceFactor;
        finalY += explosionVector.y * returnEase * distanceFactor;
        finalZ += explosionVector.z * returnEase * distanceFactor;
      }

      if (hovered) {
        // Simplified, minimal hover distortion
        const distortionPoint = mousePosition.clone().normalize();
        const grainPos = new Vector3(initialX, initialY, initialZ).normalize();

        // Simpler angle-based influence
        const angle = grainPos.angleTo(distortionPoint);
        const distortionFactor =
          Math.max(0, 1 - angle / (Math.PI * 0.5)) * distortionStrength;

        // Gentler, more uniform distortion
        finalX += distortionPoint.x * distortionFactor * 0.3;
        finalY += distortionPoint.y * distortionFactor * 0.3;
        finalZ += distortionPoint.z * distortionFactor * 0.3;
      }

      // Apply position with damping for smooth transitions
      const lerpFactor = isExploding
        ? delta * 12
        : voiceMode
        ? delta * 4
        : delta * 3;
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

  const handleTap = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isExploding) {
      setIsExploding(true);
      explosionProgress.current = 0;
    }
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
    <>
      <EffectComposer>
        <Bloom
          intensity={1.5} // base bloom intensity
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          kernelSize={KernelSize.LARGE}
          blendFunction={BlendFunction.SCREEN}
        />
        <ChromaticAberration
          offset={new Vector3(0.002, 0.002, 0).multiplyScalar(
            isExploding ? 2 : 1
          )}
          radialModulation={true}
          modulationOffset={0.5}
        />
      </EffectComposer>
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
        onClick={handleTap}
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
          opacity={0.85} // Slightly more transparent for ethereal effect
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.01}
        />
      </points>
    </>
  );
};
