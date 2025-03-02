import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
// import { ThemeColors } from './ThemeConstants';
import { useTheme } from "next-themes";
import * as THREE from "three";

interface TryButtonProps {
  onClick: () => void;
  isHovered?: boolean;
  position?: [number, number, number];
  scale?: number;
}

export const TryButton: React.FC<TryButtonProps> = ({
  onClick,
  isHovered = false,
  position = [0, 0, 0],
  scale = 1,
}) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const buttonRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Object3D>(null);
  const [hover, setHover] = useState(isHovered);
  const [pressed, setPressed] = useState(false);

  // Dynamic button colors based on theme
  const buttonBaseColor = isDark ? "#1E1E24" : "#F5F5F7";
  const buttonHoverColor = isDark ? "#2A2A32" : "#FFFFFF";
  const buttonPressedColor = isDark ? "#18181F" : "#E8E8EC";
  const textColor = isDark ? "#FFFFFF" : "#111827";
  const glowColor = isDark
    ? new THREE.Color("#ffffff").multiplyScalar(0.15)
    : new THREE.Color("#000000").multiplyScalar(0.07);

  // Spring animations for button states
  const { buttonScale, buttonY, buttonZ, textY } = useSpring({
    buttonScale: hover ? [1.03, 1.03, 1.03] : [1, 1, 1],
    buttonY: pressed ? -0.02 : 0,
    buttonZ: pressed ? 0.12 : hover ? 0.18 : 0.15,
    textY: pressed ? -0.02 : 0,
    config: { mass: 1, tension: 280, friction: 30 },
  });

  // Subtle ambient animation
  useFrame((state) => {
    if (buttonRef.current) {
      // Add subtle floating effect
      const t = state.clock.getElapsedTime();
      const floatY = Math.sin(t * 0.8) * 0.005;
      buttonRef.current.position.y = floatY + buttonY.get();

      // Update position based on hover/pressed state
      if (textRef.current) {
        textRef.current.position.y = 0.01 + textY.get();
      }
    }
  });

  // Handle interaction events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerOver = (e: any) => {
    e.nativeEvent.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerOut = (e: any) => {
    e.nativeEvent.stopPropagation();
    setHover(false);
    document.body.style.cursor = "auto";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerDown = (e: any) => {
    e.nativeEvent.stopPropagation();
    setPressed(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerUp = (e: any) => {
    e.nativeEvent.stopPropagation();
    if (pressed) {
      onClick();
    }
    setPressed(false);
  };

  return (
    <group position={position} scale={scale}>
      {/* Button base with shadow */}
      <mesh
        position={[0, -0.16, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.1, 1.2, 0.1]}
        receiveShadow
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={isDark ? 0.4 : 0.15} />
      </mesh>

      {/* Button body */}
      <animated.group
        scale={buttonScale as unknown as [number, number, number]}
      >
        <animated.mesh
          ref={buttonRef}
          position-z={buttonZ}
          castShadow
          receiveShadow
          onClick={onClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <RoundedBox args={[2.6, 0.4, 0.25]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color={
                pressed
                  ? buttonPressedColor
                  : hover
                  ? buttonHoverColor
                  : buttonBaseColor
              }
              roughness={0.3}
              metalness={isDark ? 0.2 : 0.1}
              envMapIntensity={1.2}
            />
          </RoundedBox>
        </animated.mesh>

        {/* Bevel effect with custom geometry */}
        <mesh position={[0, 0, 0.12]} visible={!pressed}>
          <cylinderGeometry args={[1.25, 1.25, 0.01, 32, 1, true]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={hover ? 0.4 : 0.25}
          />
        </mesh>

        {/* Button text */}
        <animated.group position-y={textY}>
          <Text
            ref={textRef}
            position={[0, 0, 0.28]}
            fontSize={0.13}
            color={textColor}
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.05}
          >
            TRY CONVERSATE
          </Text>
        </animated.group>
      </animated.group>

      {/* Ambient light for the button */}
      <pointLight
        position={[0, 0.4, 1]}
        intensity={0.6}
        color={isDark ? "#ffffff" : "#ffffff"}
        distance={2}
        decay={2}
      />
    </group>
  );
};

export default TryButton;
