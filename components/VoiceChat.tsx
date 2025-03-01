"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { MediaDeviceFailure } from "livekit-client";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";

interface ConnectionDetails {
  serverUrl: string;
  participantToken: string;
}

interface VoiceChatProps {
  onVoiceActivity: (level: number) => void;
  onClose: () => void;
}

export default function VoiceChat({
  onVoiceActivity,
  onClose,
}: VoiceChatProps) {
  const [connectionDetails, setConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Flag to track initial connection
  const hasConnected = useRef(false);

  // Separate fetch function to avoid dependency issues
  const fetchToken = useCallback(async () => {
    if (hasConnected.current) return;

    setIsLoading(true);
    try {
      const username = `user-${Math.floor(Math.random() * 10000)}`;
      const response = await fetch(
        `/api/livekit?room=agro-assistant&username=${username}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.status}`);
      }

      const data = await response.json();
      setConnectionDetails({
        serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
        participantToken: data.token,
      });
      hasConnected.current = true;
    } catch (error) {
      console.error("Failed to fetch token:", error);
      setError("Failed to connect to voice service");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect once on component mount
  useEffect(() => {
    fetchToken();
    // No dependencies to avoid re-fetching
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset connection when component unmounts
  useEffect(() => {
    return () => {
      hasConnected.current = false;
    };
  }, []);

  // Handle disconnection
  const handleDisconnect = useCallback(() => {
    setConnectionDetails(undefined);
    hasConnected.current = false;
  }, []);

  // Handle retry if connection fails
  const handleRetry = useCallback(() => {
    setError(null);
    hasConnected.current = false;
    fetchToken();
  }, [fetchToken]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`p-6 ${
          isDark ? "bg-black/30" : "bg-white/30"
        } backdrop-blur-xl rounded-lg border ${
          isDark ? "border-white/10" : "border-black/10"
        } max-w-md w-full`}
      >
        <div className="text-center p-4">
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className="mb-4 text-red-400">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading || !connectionDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`p-6 ${
          isDark ? "bg-black/30" : "bg-white/30"
        } backdrop-blur-xl rounded-lg border ${
          isDark ? "border-white/10" : "border-black/10"
        } max-w-md w-full`}
      >
        <div className="text-center p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-2"></div>
            <span>Connecting voice experience...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <main
        data-lk-theme="default"
        className="h-full grid content-center bg-[var(--lk-bg)]"
      >
        <LiveKitRoom
          token={connectionDetails.participantToken}
          serverUrl={connectionDetails.serverUrl}
          connect={true}
          audio={true}
          video={false}
          onMediaDeviceFailure={onDeviceFailure}
          onDisconnected={handleDisconnect}
          className="grid grid-rows-[2fr_1fr] items-center"
          // Stable key to prevent room reconnection on re-render
          key={connectionDetails.participantToken.substring(0, 10)}
        >
          <SimpleVoiceAssistant
            onStateChange={setAgentState}
            onVoiceActivity={onVoiceActivity}
            isDark={isDark}
          />
          <ControlBar
            onConnectButtonClicked={fetchToken}
            agentState={agentState}
          />
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </LiveKitRoom>
      </main>
    </>
  );
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
  onVoiceActivity: (level: number) => void;
  isDark: boolean;
}) {
  const { state } = useVoiceAssistant();
  const prevState = useRef<AgentState | null>(null);

  useEffect(() => {
    if (prevState.current !== state) {
      props.onStateChange(state);
      if (state === "speaking") {
        props.onVoiceActivity(0.7);
      } else if (state === "listening") {
        props.onVoiceActivity(0.3);
      } else {
        props.onVoiceActivity(0.05);
      }
      prevState.current = state;
    }
  }, [props, state]);

  return (
    <div className="flex items-center justify-center h-[300px] w-full">
      <motion.div
        className="relative w-64 h-64 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={`absolute inset-0 rounded-full ${
            props.isDark ? "border-[#FFFFFF10]" : "border-[#00000010]"
          } border opacity-30`}
          animate={{
            scale: [0.97, 1.03],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Primary indicator ring */}
        <motion.div
          className="absolute w-36 h-36 rounded-full border"
          style={{
            borderColor:
              state === "speaking"
                ? `${ThemeColors.accent}33`
                : state === "listening"
                ? `${ThemeColors.secondaryAccents.emerald}33`
                : `${ThemeColors.secondaryAccents.slate}33`,
          }}
          animate={{
            scale: state === "disconnected" ? 0.9 : [0.95, 1.05],
            opacity: state === "disconnected" ? 0.2 : 0.4,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {/* Core status indicator */}
        <motion.div
          className="w-28 h-28 rounded-full flex items-center justify-center border"
          style={{
            borderColor:
              state === "speaking"
                ? `${ThemeColors.accent}4D`
                : state === "listening"
                ? `${ThemeColors.secondaryAccents.emerald}4D`
                : state === "thinking"
                ? `${ThemeColors.secondaryAccents.cyan}4D`
                : `${ThemeColors.secondaryAccents.slate}4D`,
          }}
          animate={{
            scale: state === "disconnected" ? 0.95 : [0.98, 1.02],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.span
            className={`text-sm font-medium tracking-wide ${
              props.isDark ? "text-white/80" : "text-black/80"
            }`}
          >
            {state === "speaking" && "Speaking"}
            {state === "listening" && "Listening"}
            {state === "thinking" && "Processing"}
            {state === "connecting" && "Connecting"}
            {state === "disconnected" && "Offline"}
          </motion.span>
          {/* Animated wave rings */}
          {(state === "speaking" || state === "listening") && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-full rounded-full border"
                  style={{
                    borderColor:
                      state === "speaking"
                        ? `${ThemeColors.accent}1A`
                        : `${ThemeColors.secondaryAccents.emerald}1A`,
                  }}
                  animate={{
                    scale: [1, 1 + (i + 1) * 0.15],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}) {
  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.agentState !== "disconnected" &&
          props.agentState !== "connecting" && (
            <motion.div
              initial={{ opacity: 0, top: "10px" }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

// Simple CloseIcon component
function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Simple NoAgentNotification component
function NoAgentNotification({ state }: { state: AgentState }) {
  if (state !== "disconnected") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-4 text-center bg-black/40 backdrop-blur-sm rounded-lg max-w-xs">
        <p>No agent is available. Please try again later.</p>
      </div>
    </div>
  );
}
