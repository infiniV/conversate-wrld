"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
// import { OrbComponent } from "./OrbComponent";
import { ThemeColors, ThemeTransitions } from "./ThemeConstants";
import { useTheme } from "next-themes";
import { Vector3, MathUtils } from "three";
import VoiceChat from "./VoiceChat";
import { AgentState } from "@livekit/components-react";
import AmbientRings from "./ambientRings";
import dynamic from "next/dynamic";
const OrbComponentlazy = dynamic(
  () => import("./OrbComponent").then((mod) => ({ default: mod.OrbComponent })),
  {
    loading: () => null,
    ssr: false,
  }
);
// Enhanced camera controller with more fluid and dynamic movements
const CameraController = ({
  active,
  zoomToOrb,
  voiceChatActive,
  agentState,
  idleTime,
}: {
  active: boolean;
  zoomToOrb: boolean;
  voiceChatActive: boolean;
  agentState: AgentState;
  idleTime: number;
}) => {
  const targetPosition = useRef(new Vector3(0, 0, active ? 3 : 5));
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const time = useRef(0);
  const initialRotation = useRef({ x: 0, y: 0, z: 0 });
  const transitionSpeed = useRef(0.05);

  useFrame((state, delta) => {
    // Update time reference for ambient motion
    time.current += delta;

    // Store initial rotation once
    if (initialRotation.current.x === 0) {
      initialRotation.current = {
        x: state.camera.rotation.x,
        y: state.camera.rotation.y,
        z: state.camera.rotation.z,
      };
    }

    // Dynamic transition speed based on state changes
    if (agentState === "speaking") {
      transitionSpeed.current = 0.06; // Faster for speaking
    } else if (agentState === "listening") {
      transitionSpeed.current = 0.05; // Medium for listening
    } else {
      transitionSpeed.current = 0.04; // Slower for other states
    }

    // Determine target camera position based on state and agent state
    if (voiceChatActive) {
      if (agentState === "speaking") {
        // More dramatic and closer when speaking
        targetPosition.current.set(
          -0.2 + Math.sin(time.current * 0.3) * 0.05,
          0.6 + Math.sin(time.current * 0.5) * 0.05,
          2.7
        );
        targetRotation.current = {
          x: -0.15,
          y: Math.sin(time.current * 0.2) * 0.02,
          z: Math.sin(time.current * 0.3) * 0.005,
        };
      } else if (agentState === "listening") {
        // Slightly angled and dynamic when listening
        targetPosition.current.set(
          0.8 + Math.sin(time.current * 0.25) * 0.1,
          0.7 + Math.sin(time.current * 0.4) * 0.08,
          3.8
        );
        targetRotation.current = {
          x: -0.12,
          y: -0.15 + Math.sin(time.current * 0.3) * 0.02,
          z: Math.sin(time.current * 0.2) * 0.01,
        };
      } else if (agentState === "thinking") {
        // Elevated position with subtle circular motion when thinking
        const circleRadius = 0.8;
        const circleHeight = 2;
        const circleSpeed = 0.2;

        targetPosition.current.set(
          Math.sin(time.current * circleSpeed) * circleRadius,
          circleHeight,
          4.5 + Math.cos(time.current * circleSpeed) * (circleRadius * 0.5)
        );
        targetRotation.current = {
          x: -0.3,
          y: Math.sin(time.current * circleSpeed) * 0.05,
          z: 0,
        };
      } else {
        // Default position with subtle sway
        targetPosition.current.set(
          Math.sin(time.current * 0.2) * 0.2,
          1 + Math.sin(time.current * 0.3) * 0.1,
          3.5
        );
        targetRotation.current = {
          x: -0.1 + Math.sin(time.current * 0.25) * 0.01,
          y: Math.sin(time.current * 0.2) * 0.02,
          z: 0,
        };
      }
    } else if (zoomToOrb) {
      // Transition state - slightly dynamic position
      targetPosition.current.set(
        Math.sin(time.current * 0.3) * 0.1,
        Math.sin(time.current * 0.4) * 0.1,
        2.5
      );
      targetRotation.current = {
        x: Math.sin(time.current * 0.3) * 0.01,
        y: Math.sin(time.current * 0.2) * 0.01,
        z: 0,
      };
    } else {
      // Add subtle ambient motion when idle
      const idleAmplitude = Math.min(idleTime / 15, 1) * 0.15; // Grows over time
      targetPosition.current.set(
        Math.sin(time.current * 0.1) * idleAmplitude,
        Math.sin(time.current * 0.15) * idleAmplitude - 0.2,
        active ? 3 + Math.sin(time.current * 0.05) * 0.1 : 5
      );
      targetRotation.current = {
        x: Math.sin(time.current * 0.1) * 0.01 * idleAmplitude,
        y: Math.sin(time.current * 0.12) * 0.01 * idleAmplitude,
        z: 0,
      };
    }

    // Smooth camera movement with dynamic transition speed
    state.camera.position.lerp(targetPosition.current, transitionSpeed.current);

    // Apply rotations with dynamic transition speed
    state.camera.rotation.x = MathUtils.lerp(
      state.camera.rotation.x,
      initialRotation.current.x + targetRotation.current.x,
      transitionSpeed.current
    );

    state.camera.rotation.y = MathUtils.lerp(
      state.camera.rotation.y,
      initialRotation.current.y + targetRotation.current.y,
      transitionSpeed.current
    );

    state.camera.rotation.z = MathUtils.lerp(
      state.camera.rotation.z,
      initialRotation.current.z + targetRotation.current.z,
      transitionSpeed.current * 0.5 // Slower for z-rotation
    );

    state.camera.updateProjectionMatrix();
  });

  return null;
};

export const LandingHero = () => {
  const [loaded, setLoaded] = useState(false);
  const [voiceChatActive, setVoiceChatActive] = useState(false);
  const [zoomToOrb, setZoomToOrb] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [orbInteractivity, setOrbInteractivity] = useState({
    rotationSpeed: 0.04,
    pulsateSpeed: 0.12,
    noiseStrength: 0.12,
    distortionStrength: 0.6,
  });
  const [audioActivityLevel, setAudioActivityLevel] = useState(0);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [idleTime, setIdleTime] = useState(0);
  const lastInteractionTime = useRef(Date.now());

  // Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Track idle time
  useEffect(() => {
    const updateIdleTime = () => {
      const now = Date.now();
      setIdleTime((now - lastInteractionTime.current) / 1000); // Convert to seconds
    };

    const interval = setInterval(updateIdleTime, 100);

    // Reset idle timer on user interaction
    const resetTimer = () => {
      lastInteractionTime.current = Date.now();
      setIdleTime(0);
    };

    // Track user interactions
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  // Determine orb color based on agent state with smoother transitions
  const getOrbColor = () => {
    if (!voiceChatActive) return ThemeColors.accent;

    switch (agentState) {
      case "speaking":
        return ThemeColors.accent;
      case "listening":
        return ThemeColors.secondaryAccents.emerald;
      case "thinking":
        return ThemeColors.secondaryAccents.cyan;
      default:
        return ThemeColors.secondaryAccents.slate;
    }
  };

  // Dynamic orb sizing based on state with smoother spring animation
  const springConfig = { stiffness: 120, damping: 20, mass: 1 };
  const targetRadius = voiceChatActive
    ? agentState === "speaking"
      ? 2.0
      : agentState === "listening"
      ? 1.9
      : 1.7
    : 1.6;

  const orbRadius = useSpring(targetRadius, springConfig);

  // Update spring animation when target changes
  useEffect(() => {
    orbRadius.set(targetRadius);
  }, [targetRadius, orbRadius]);

  // Mount and load effects
  useEffect(() => {
    setMounted(true);

    // Stagger the loaded state for a more polished entrance
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced effect to adjust orb interactivity when voice chat is active
  useEffect(() => {
    if (voiceChatActive) {
      // Zoom camera to focus on orb with delay for smoother transition
      setTimeout(() => setZoomToOrb(true), 200);

      // Dynamic interactivity based on agent state
      if (agentState === "speaking") {
        setOrbInteractivity({
          rotationSpeed: 0.08,
          pulsateSpeed: 0.22,
          noiseStrength: 0.2,
          distortionStrength: 0.88,
        });
      } else if (agentState === "listening") {
        setOrbInteractivity({
          rotationSpeed: 0.06,
          pulsateSpeed: 0.18,
          noiseStrength: 0.16,
          distortionStrength: 0.8,
        });
      } else if (agentState === "thinking") {
        setOrbInteractivity({
          rotationSpeed: 0.04,
          pulsateSpeed: 0.15,
          noiseStrength: 0.14,
          distortionStrength: 0.75,
        });
      } else {
        setOrbInteractivity({
          rotationSpeed: 0.04,
          pulsateSpeed: 0.12,
          noiseStrength: 0.12,
          distortionStrength: 0.6,
        });
      }
    } else {
      // Reset orb with a slight delay for smoother transition out
      setTimeout(() => setZoomToOrb(false), 100);

      // Add a subtle idle animation based on idle time
      const idleFactor = Math.min(idleTime / 30, 1) * 0.01;
      setOrbInteractivity({
        rotationSpeed: 0.035 + idleFactor,
        pulsateSpeed: 0.11 + idleFactor * 2,
        noiseStrength: 0.11 + idleFactor,
        distortionStrength: 0.58 + idleFactor * 3,
      });
    }
  }, [voiceChatActive, agentState, idleTime]);

  // Enhanced voice activity handler with smoother transitions
  const handleVoiceActivity = (level: number) => {
    setAudioActivityLevel(level);

    // More responsive orb properties based on voice activity
    if (level > 0.05) {
      setOrbInteractivity((prev) => ({
        ...prev,
        pulsateSpeed: prev.pulsateSpeed + level * 0.15,
        noiseStrength: prev.noiseStrength + level * 0.12,
        rotationSpeed: prev.rotationSpeed + level * 0.06,
        distortionStrength: Math.min(
          prev.distortionStrength + level * 0.2,
          1.0
        ),
      }));
    }
  };

  // Handle agent state changes with interaction reset
  const handleAgentStateChange = (state: AgentState) => {
    setAgentState(state);
    lastInteractionTime.current = Date.now(); // Reset idle timer on state change
  };

  // Handle activating voice chat with animation preparation
  interface TryConversateHandler {
    preventDefault: () => void;
  }

  const handleTryConversate = (e: TryConversateHandler): void => {
    e.preventDefault();

    // Small prep animation before showing voice chat
    setOrbInteractivity((prev) => ({
      ...prev,
      rotationSpeed: 0.07,
      pulsateSpeed: 0.18,
    }));

    // Activate voice chat after brief animation
    setTimeout(() => setVoiceChatActive(true), 200);
  };

  // Handle closing voice chat with smooth transition
  const handleCloseVoiceChat = () => {
    // First reset activity level
    setAudioActivityLevel(0);

    // Then close voice chat with a slight delay
    setTimeout(() => {
      setVoiceChatActive(false);
      setAgentState("disconnected");
    }, 100);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  // Theme-aware styles
  const styles = {
    // Base colors
    background: isDark
      ? ThemeColors.dark.background
      : ThemeColors.light.background,
    text: isDark ? ThemeColors.dark.text : ThemeColors.light.text,
    secondaryText: isDark
      ? ThemeColors.dark.secondaryText
      : ThemeColors.light.secondaryText,
    border: isDark ? ThemeColors.dark.border : ThemeColors.light.border,
    subtleUI: isDark ? ThemeColors.dark.subtleUI : ThemeColors.light.subtleUI,

    // Special styles
    textGradient: isDark
      ? "from-white to-gray-300"
      : "from-gray-900 to-gray-700",
    tagBackground: isDark
      ? "bg-[rgba(255,61,113,0.15)]"
      : "bg-[rgba(255,61,113,0.08)]",
    tagBorder: isDark ? "border-[#FF3D71]/20" : "border-[#FF3D71]/15",
    featureIconBackground: isDark
      ? "bg-[rgba(255,255,255,0.1)]"
      : "bg-[rgba(0,0,0,0.05)]",
    featureTextColor: isDark ? "text-white/70" : "text-gray-700/80",
    decorativeBorder: isDark ? "border-white/10" : "border-black/5",
    decorationOpacity: isDark ? 0.3 : 0.15,
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        isDark ? "bg-[#09090B] text-[#FFFFFF]" : "bg-[#FAFAFA] text-[#111827]"
      } transition-colors`}
      style={{ transition: ThemeTransitions.default }}
    >
      {/* Central Orb - Dynamic interactive element */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-[100vw] h-[100vh] absolute opacity-90">
          <Canvas
            camera={{ position: [0, 0, 2], fov: 80 }}
            style={{
              touchAction: "none",
              filter: isDark ? "none" : "contrast(1.05) brightness(1.05)",
            }}
            eventSource={document.documentElement}
            eventPrefix="client"
          >
            <Suspense fallback={null}>
              <OrbComponentlazy
                color={getOrbColor()}
                hoverColor={ThemeColors.secondaryAccents.cyan}
                grainCount={voiceChatActive ? 1400 : 1200}
                radius={orbRadius.get()}
                grainSize={0.0075 + audioActivityLevel * 0.012}
                vertexColors={false}
                rotationSpeed={orbInteractivity.rotationSpeed}
                pulsateSpeed={orbInteractivity.pulsateSpeed}
                noiseStrength={orbInteractivity.noiseStrength}
                pulsateStrength={
                  isDark
                    ? 0.03 + audioActivityLevel * 0.06
                    : 0.025 + audioActivityLevel * 0.05
                }
                distortionStrength={orbInteractivity.distortionStrength}
                voiceMode={voiceChatActive}
              />
              <AmbientRings color={getOrbColor()} />
              {/* Add ambient particles for depth */}
            </Suspense>

            {/* Enhanced camera controller */}
            <CameraController
              active={loaded}
              zoomToOrb={zoomToOrb}
              voiceChatActive={voiceChatActive}
              agentState={agentState}
              idleTime={idleTime}
            />
          </Canvas>
        </div>
      </div>

      {/* Content Overlay with enhanced animations */}
      <AnimatePresence mode="wait">
        {!voiceChatActive && (
          <motion.div
            className="relative z-20 top-1/5 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                {/* <motion.div
                  className={`inline-block mb-3 px-4 py-1.5 ${styles.tagBackground} ${styles.tagBorder} backdrop-blur-sm border rounded-md`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <span className="text-xs font-semibold tracking-widest text-[#FF3D71] uppercase">
                    Redefining Communication
                  </span>
                </motion.div> */}

                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loaded ? 1 : 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  The Future of{" "}
                  <span className="text-[#FF3D71]">Customer Care</span>
                </motion.h1>

                <motion.p
                  className={`text-base md:text-lg ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-8 mx-auto max-w-xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Seamless interactions across all channels. Deliver exceptional
                  experiences through our intelligent autonomous system.
                </motion.p>

                {/* Centered buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/get-started"
                    className="flex items-center justify-center text-sm font-semibold text-white px-7 py-3.5 gap-3 w-full sm:w-auto"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                      backgroundColor: ThemeColors.accent,
                      boxShadow: `0 0 20px ${ThemeColors.accent}4D, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 0 25px ${ThemeColors.accent}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <span className="tracking-wider">GET CONVERSATE</span>
                    <ArrowRight size={16} />
                  </motion.a>

                  <motion.button
                    onClick={handleTryConversate}
                    className="flex items-center justify-center text-sm font-semibold px-7 py-3.5 gap-3 w-full sm:w-auto"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid rgba(0,0,0,0.1)",
                      background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.03)",
                      backdropFilter: "blur(12px)",
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                    whileHover={{
                      scale: 1.02,
                      background: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <span className="tracking-wider">TRY CONVERSATE</span>
                  </motion.button>
                </div>

                {/* Centered features */}
                <motion.div
                  className="mt-8 flex flex-wrap items-center justify-center gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loaded ? (isDark ? 0.9 : 0.85) : 0 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.featureIconBackground}`}
                    >
                      <MessageSquare
                        size={14}
                        className={styles.featureTextColor}
                      />
                    </div>
                    <span className={`text-sm ${styles.featureTextColor}`}>
                      Conversation Intelligence
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.featureIconBackground}`}
                    >
                      <Phone size={14} className={styles.featureTextColor} />
                    </div>
                    <span className={`text-sm ${styles.featureTextColor}`}>
                      Multimodal Interaction
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Chat Integration with enhanced transitions */}
      <AnimatePresence>
        {voiceChatActive && (
          <motion.div
            className="relative z-30 w-full h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Position voice chat to interact with the orb */}
            <div className="w-full h-full flex items-center justify-center px-4 pt-16">
              <div className="w-full max-w-3xl relative">
                <VoiceChat
                  onVoiceActivity={handleVoiceActivity}
                  onClose={handleCloseVoiceChat}
                  onAgentStateChange={handleAgentStateChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
