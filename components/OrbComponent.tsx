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
  grainCount = 4200, // Increased for better density
  radius = 1.0,
  grainSize = 0.007, // Smaller particles for more refined detail
  color = ThemeColors.accent,
  hoverColor = ThemeColors.secondaryAccents.slate,
  pulsateSpeed = 0.08,
  pulsateStrength = 0.035,
  rotationSpeed = 0.04,
  noiseStrength = 0.12,
  distortionStrength = 0.15,
  vertexColors = false,
  voiceMode = false,
  explosionForce = 20,
  explosionDuration = 3.2,
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
  const formationProgress = useRef(0);
  const initialFormationPositions = useRef<Float32Array | null>(null);
  const formationPatterns = useRef<Array<number>>([]);
  const explosionState = useRef({
    time: 0,
    shockwave: 0,
    particleSpeed: new Array(grainCount).fill(0),
    particleDelay: new Array(grainCount).fill(0),
    particleReturnDelay: new Array(grainCount).fill(0),
    rotationAxis: new Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize(),
    rotationSpeed: Math.random() * 0.2 + 0.1,
  });

  // Generate initial grain positions and optional colors
  const { positions, initialPositions, colors } = useMemo(() => {
    const positions = new Float32Array(grainCount * 3);
    const initialPositions = new Float32Array(grainCount * 3);
    const colors = vertexColors ? new Float32Array(grainCount * 3) : null;

    // Store initial formation positions with improved pattern
    initialFormationPositions.current = new Float32Array(grainCount * 3);
    formationPatterns.current = new Array(grainCount);

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

      // Create more sophisticated initial formation positions
      // Assign each particle to one of several formation patterns
      const patternType = Math.floor(Math.random() * 5); // 5 different patterns
      formationPatterns.current[i] = patternType;

      switch (patternType) {
        case 0: // Top helix
          {
            const angle = (i / grainCount) * Math.PI * 20;
            const helixRadius = 4 * Math.pow(i / grainCount, 0.8);
            initialFormationPositions.current[idx] =
              Math.cos(angle) * helixRadius;
            initialFormationPositions.current[idx + 1] =
              5 - (i / grainCount) * 6;
            initialFormationPositions.current[idx + 2] =
              Math.sin(angle) * helixRadius;
          }
          break;
        case 1: // Bottom helix
          {
            const angle = (i / grainCount) * Math.PI * 20;
            const helixRadius = 4 * Math.pow(i / grainCount, 0.8);
            initialFormationPositions.current[idx] =
              Math.cos(angle) * helixRadius;
            initialFormationPositions.current[idx + 1] =
              -5 + (i / grainCount) * 6;
            initialFormationPositions.current[idx + 2] =
              Math.sin(angle) * helixRadius;
          }
          break;
        case 2: // Spiral ring
          {
            const angle = (i / grainCount) * Math.PI * 30;
            const spiralRadius = 6 - (i / grainCount) * 4;
            initialFormationPositions.current[idx] =
              Math.cos(angle) * spiralRadius;
            initialFormationPositions.current[idx + 1] =
              (Math.random() - 0.5) * 8;
            initialFormationPositions.current[idx + 2] =
              Math.sin(angle) * spiralRadius;
          }
          break;
        case 3: // Distant point cloud
          {
            const sphereRadius = 8 + Math.random() * 4;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            initialFormationPositions.current[idx] =
              sphereRadius * Math.sin(phi) * Math.cos(theta);
            initialFormationPositions.current[idx + 1] =
              sphereRadius * Math.sin(phi) * Math.sin(theta);
            initialFormationPositions.current[idx + 2] =
              sphereRadius * Math.cos(phi);
          }
          break;
        case 4: // Diagonal streams
          {
            const streamAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
            const distance = 6 + Math.random() * 3;
            initialFormationPositions.current[idx] =
              Math.cos(streamAngle) * distance;
            initialFormationPositions.current[idx + 1] =
              (Math.random() - 0.5) * 10;
            initialFormationPositions.current[idx + 2] =
              Math.sin(streamAngle) * distance;
          }
          break;
      }

      if (colors) {
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z) / radius;
        const layerFactor = layerIndex / 5;

        // Add more vibrant color variations based on depth
        const colorObj = new Color(color.toString());
        const { h, s, l } = colorObj.getHSL({ h: 0, s: 0, l: 0 });

        // Enhanced ethereal color variation with more depth perception
        const newColor = new Color().setHSL(
          h + layerFactor * 0.12 + Math.sin(phi * 3) * 0.06,
          s * (0.45 + distanceFromCenter * 0.55),
          l * (0.35 + layerFactor * 0.65 + distanceFromCenter * 0.35)
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

        // Generate a unique speed for each particle
        explosionState.current.particleSpeed[i] = 0.6 + Math.random() * 0.8;

        // Create staggered delays for explosion
        explosionState.current.particleDelay[i] = Math.random() * 0.15;

        // Create staggered return delays
        explosionState.current.particleReturnDelay[i] =
          0.5 + Math.random() * 0.5;

        // Create sophisticated outward trajectory with spiral component
        const directionVector = pos.clone().normalize();

        // Add randomization but keep outward bias
        const randomization = new Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2
        );

        // Create layer-based explosion patterns
        const distanceFromCenter = pos.length() / radius;
        const layerInfluence = Math.sin(distanceFromCenter * Math.PI) * 2;

        return directionVector
          .add(randomization.multiplyScalar(0.8))
          .normalize()
          .multiplyScalar(
            explosionForce *
              explosionState.current.particleSpeed[i] *
              layerInfluence
          );
      });
  }, [grainCount, initialPositions, explosionForce, radius]);

  // Animation and hover effect
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    time.current += delta;

    // Update formation progress with refined timing
    if (formationProgress.current < 1) {
      // Different particles arrive at different speeds
      const progressIncrement = delta * 0.4;
      formationProgress.current = Math.min(
        1,
        formationProgress.current + progressIncrement
      );

      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < grainCount; i++) {
        const idx = i * 3;
        const patternType = formationPatterns.current[i];

        // Different patterns have different timing and easing functions
        let particleProgress;

        // Staggered arrival based on pattern type
        const staggerDelay = patternType * 0.1; // Stagger by pattern
        const individualDelay = (i % 20) * 0.007; // Subtle variation within pattern

        const adjustedProgress = Math.max(
          0,
          formationProgress.current - staggerDelay - individualDelay
        );

        // Custom easing function per pattern
        switch (patternType) {
          case 0: // Fast start, slow end
            particleProgress =
              1 - Math.pow(1 - Math.min(1, adjustedProgress * 1.2), 3);
            break;
          case 1: // Slow start, fast end
            particleProgress = Math.pow(Math.min(1, adjustedProgress * 1.2), 2);
            break;
          case 2: // Bounce effect
            particleProgress =
              adjustedProgress < 0.8
                ? 1.05 * Math.sin((adjustedProgress * Math.PI) / 0.8)
                : 1 - Math.pow((adjustedProgress - 0.8) * 5, 2) * 0.1;
            particleProgress = Math.min(1, Math.max(0, particleProgress));
            break;
          case 3: // Delayed fast arrival
            particleProgress =
              adjustedProgress < 0.5
                ? adjustedProgress * 0.3
                : 0.15 + (adjustedProgress - 0.5) * 1.7;
            particleProgress = Math.min(1, Math.max(0, particleProgress));
            break;
          case 4: // Normal curve
            particleProgress = Math.min(1, adjustedProgress * 1.2);
            break;
          default:
            particleProgress = adjustedProgress;
        }

        // Get target and start positions
        const targetX = initialPositions[idx];
        const targetY = initialPositions[idx + 1];
        const targetZ = initialPositions[idx + 2];

        const startX = initialFormationPositions.current![idx];
        const startY = initialFormationPositions.current![idx + 1];
        const startZ = initialFormationPositions.current![idx + 2];

        // Add motion effects during formation
        const formationTime = time.current * 2;
        const wobble =
          Math.sin(formationTime + i * 0.1) *
          Math.sin(i * 0.3) *
          0.2 *
          (1 - particleProgress);

        // Apply curved path for more interesting motion
        const pathCurvature = (1 - particleProgress) * particleProgress * 4; // Peaks at progress = 0.5
        const pathAngle = (i / grainCount) * Math.PI * 2;
        const curveFactor = 0.6;

        const curveX = Math.sin(pathAngle) * pathCurvature * curveFactor;
        const curveZ = Math.cos(pathAngle) * pathCurvature * curveFactor;

        // Update position with interpolation and effects
        positions[idx] =
          MathUtils.lerp(startX, targetX, particleProgress) + wobble + curveX;
        positions[idx + 1] =
          MathUtils.lerp(startY, targetY, particleProgress) + wobble * 0.5;
        positions[idx + 2] =
          MathUtils.lerp(startZ, targetZ, particleProgress) + wobble + curveZ;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

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

      // Enhanced pulse size effect with more dynamic range
      const baseSize = grainSize * (voiceMode ? 1.25 : 1.0);
      const pulseFactor = voiceMode ? pulsateStrength * 1.7 : pulsateStrength;
      const pulseVariation = Math.sin(
        time.current * pulsateSpeed * Math.PI * 2
      );

      // Apply a more complex size modulation
      materialRef.current.size =
        baseSize *
        (1 +
          pulseVariation * pulseFactor +
          Math.sin(time.current * pulsateSpeed * 3) * pulseFactor * 0.3);

      // Adjust opacity based on voice mode
      materialRef.current.opacity = voiceMode
        ? 0.95
        : 0.85 * Math.min(1, formationProgress.current * 2);

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
      // Increment explosion time
      explosionState.current.time += delta;
      explosionProgress.current = Math.min(
        explosionState.current.time / explosionDuration,
        1
      );

      // Generate shockwave effect
      if (explosionState.current.time < 0.3) {
        explosionState.current.shockwave =
          Math.sin((explosionState.current.time * Math.PI) / 0.3) * 0.2;
      } else {
        explosionState.current.shockwave = Math.max(
          0,
          explosionState.current.shockwave - delta * 0.4
        );
      }

      // End explosion when complete
      if (explosionProgress.current >= 1) {
        setIsExploding(false);
        explosionProgress.current = 0;
        explosionState.current.time = 0;
        explosionState.current.shockwave = 0;
      }
    }

    // Only apply regular animations after formation is complete
    if (formationProgress.current >= 1) {
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
          const particleTime = Math.max(
            0,
            explosionState.current.time -
              explosionState.current.particleDelay[i]
          );
          const particleLifetime =
            explosionDuration - explosionState.current.particleDelay[i];
          const particleProgress = Math.min(1, particleTime / particleLifetime);

          // Create 3-phase animation: outward burst, hang time, return
          let phase, phaseProgress;
          const burstDuration = 0.3;
          const returnStartTime = explosionState.current.particleReturnDelay[i];

          if (particleProgress < burstDuration) {
            // Phase 1: Initial explosion burst (0-30%)
            phase = 0;
            phaseProgress = particleProgress / burstDuration;

            // Explosive easing: accelerate out fast
            phaseProgress = 1 - Math.pow(1 - phaseProgress, 3);
          } else if (particleProgress < returnStartTime) {
            // Phase 2: Hang time / slow drift (30-80%)
            phase = 1;
            phaseProgress =
              (particleProgress - burstDuration) /
              (returnStartTime - burstDuration);

            // Slow drift with slight oscillation
            phaseProgress = 1 + Math.sin(phaseProgress * Math.PI * 2) * 0.05;
          } else {
            // Phase 3: Return to formation (80-100%)
            phase = 2;
            phaseProgress =
              (particleProgress - returnStartTime) / (1 - returnStartTime);

            // Custom elastic return easing
            phaseProgress =
              1 -
              Math.cos(phaseProgress * Math.PI) * Math.exp(-phaseProgress * 3);
          }

          // Calculate current position based on the phase
          let finalX, finalY, finalZ;
          const explosionVector = explosionVectors.current[i];
          const distanceFromCenter =
            Math.sqrt(
              initialX * initialX + initialY * initialY + initialZ * initialZ
            ) / radius;

          if (phase === 0) {
            // Burst phase: rapid expansion
            finalX = initialX + explosionVector.x * phaseProgress;
            finalY = initialY + explosionVector.y * phaseProgress;
            finalZ = initialZ + explosionVector.z * phaseProgress;

            // Add shockwave ripple effect
            if (explosionState.current.shockwave > 0) {
              const pos = new Vector3(initialX, initialY, initialZ).normalize();
              finalX +=
                pos.x * explosionState.current.shockwave * distanceFromCenter;
              finalY +=
                pos.y * explosionState.current.shockwave * distanceFromCenter;
              finalZ +=
                pos.z * explosionState.current.shockwave * distanceFromCenter;
            }
          } else if (phase === 1) {
            // Hang phase: slow drift with rotation
            const rotationAmount =
              particleTime * explosionState.current.rotationSpeed;
            const pos = new Vector3(
              initialX + explosionVector.x,
              initialY + explosionVector.y,
              initialZ + explosionVector.z
            );

            // Apply orbital-like rotation during hang time
            pos.applyAxisAngle(
              explosionState.current.rotationAxis,
              rotationAmount
            );

            // Add slight inward movement during hang
            const inwardFactor = phaseProgress * 0.1;
            pos.lerp(
              new Vector3(initialX, initialY, initialZ).multiplyScalar(1.5),
              inwardFactor
            );

            finalX = pos.x;
            finalY = pos.y;
            finalZ = pos.z;
          } else {
            // Return phase: come back to initial position with elastic effect
            const pos = new Vector3(
              initialX + explosionVector.x,
              initialY + explosionVector.y,
              initialZ + explosionVector.z
            );
            pos.applyAxisAngle(
              explosionState.current.rotationAxis,
              particleTime * explosionState.current.rotationSpeed
            );

            finalX = MathUtils.lerp(pos.x, initialX, phaseProgress);
            finalY = MathUtils.lerp(pos.y, initialY, phaseProgress);
            finalZ = MathUtils.lerp(pos.z, initialZ, phaseProgress);

            // Add slight "overshoot" effect when returning
            if (phaseProgress > 0.8 && phaseProgress < 0.95) {
              const overshootAmount =
                Math.sin(((phaseProgress - 0.8) * Math.PI) / 0.15) * 0.06;
              finalX = MathUtils.lerp(
                finalX,
                initialX * (1 - overshootAmount),
                (phaseProgress - 0.8) / 0.15
              );
              finalY = MathUtils.lerp(
                finalY,
                initialY * (1 - overshootAmount),
                (phaseProgress - 0.8) / 0.15
              );
              finalZ = MathUtils.lerp(
                finalZ,
                initialZ * (1 - overshootAmount),
                (phaseProgress - 0.8) / 0.15
              );
            }
          }

          // Apply position with appropriate damping for each phase
          const lerpFactor =
            phase === 0 ? delta * 15 : phase === 1 ? delta * 4 : delta * 10;
          positions[i3] = MathUtils.lerp(positions[i3], finalX, lerpFactor);
          positions[i3 + 1] = MathUtils.lerp(
            positions[i3 + 1],
            finalY,
            lerpFactor
          );
          positions[i3 + 2] = MathUtils.lerp(
            positions[i3 + 2],
            finalZ,
            lerpFactor
          );
        }

        if (hovered) {
          // Simplified, minimal hover distortion
          const distortionPoint = mousePosition.clone().normalize();
          const grainPos = new Vector3(
            initialX,
            initialY,
            initialZ
          ).normalize();

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
        positions[i3 + 1] = MathUtils.lerp(
          positions[i3 + 1],
          finalY,
          lerpFactor
        );
        positions[i3 + 2] = MathUtils.lerp(
          positions[i3 + 2],
          finalZ,
          lerpFactor
        );
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
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
      explosionState.current.time = 0;
      explosionState.current.shockwave = 0;

      // Create new random rotation axis for this explosion
      explosionState.current.rotationAxis = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      explosionState.current.rotationSpeed = Math.random() * 0.4 + 0.2;

      // Reset particle positions to create a cleaner explosion
      if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < grainCount; i++) {
          const i3 = i * 3;
          positions[i3] = initialPositions[i3];
          positions[i3 + 1] = initialPositions[i3 + 1];
          positions[i3 + 2] = initialPositions[i3 + 2];
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
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
          intensity={1.8} // Increased for more glow
          luminanceThreshold={0.18}
          luminanceSmoothing={0.92}
          kernelSize={KernelSize.LARGE}
          blendFunction={BlendFunction.SCREEN}
        />
        <ChromaticAberration
          offset={new Vector3(0.0025, 0.0025, 0).multiplyScalar(
            isExploding ? 2.2 : 1
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
          opacity={0.82} // Slightly more transparent for more ethereal effect
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.01}
        />
      </points>
    </>
  );
};
