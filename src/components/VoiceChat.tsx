"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  type AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { type MediaDeviceFailure } from "livekit-client";
import { useTheme } from "next-themes";
import { ThemeColors } from "./ThemeConstants";
import { VoiceChatConfigModal } from "./VoiceChatConfigModal";
import { type LiveKitRoomConfig } from "~/types/livekit";
// Import the tRPC client
import { api } from "~/trpc/react";

interface ConnectionDetails {
  serverUrl: string;
  participantToken: string;
}

interface VoiceChatProps {
  onVoiceActivity: (level: number) => void;
  onClose: () => void;
  onAgentStateChange?: (state: AgentState) => void;
}

export default function VoiceChat({
  onVoiceActivity,
  onClose,
  onAgentStateChange,
}: VoiceChatProps) {
  const [connectionDetails, setConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<LiveKitRoomConfig | null>(
    null,
  );
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Flag to track initial connection and prevent reconnection race conditions
  const hasConnected = useRef(false);
  const isDisconnecting = useRef(false);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  // Use the tRPC hook properly - this creates the query but doesn't execute it yet
  const livekitTokenQuery = api.livekit.getToken.useQuery(
    {
      room: currentConfig
        ? btoa(JSON.stringify(currentConfig))
        : "default-room",
      username: currentConfig?.userId ?? "default-user",
    },
    { enabled: false }, // Don't run automatically
  );

  // Handle agent state changes
  const handleAgentStateChange = useCallback(
    (state: AgentState) => {
      setAgentState(state);
      // Pass state to parent component if callback exists
      if (onAgentStateChange) {
        onAgentStateChange(state);
      }
    },
    [onAgentStateChange],
  );

  // Handle modal submission
  const handleConfigSubmit = useCallback(
    (roomName: string, config: LiveKitRoomConfig) => {
      setCurrentConfig(config);
      setShowConfigModal(false);
      // Connection will be triggered by useEffect when currentConfig changes
    },
    [],
  );

  // Handle modal close
  const handleConfigModalClose = useCallback(() => {
    setShowConfigModal(false);
    onClose(); // Close the entire voice chat if user cancels configuration
  }, [onClose]);

  // Clean up any pending reconnection timers on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, []);

  // Separate fetch function to avoid dependency issues
  const fetchToken = useCallback(async () => {
    // Don't fetch if already connected or currently disconnecting
    if (hasConnected.current || isDisconnecting.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Trigger the query
      const result = await livekitTokenQuery.refetch();

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data) {
        setConnectionDetails({
          serverUrl: result.data.url,
          participantToken: result.data.token,
        });

        hasConnected.current = true;
        isDisconnecting.current = false;
      }
    } catch (err: unknown) {
      console.error("Failed to fetch token:", err);
      setError("Failed to connect to voice service");
      hasConnected.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [livekitTokenQuery]);

  // Connect once we have a configuration
  useEffect(() => {
    if (currentConfig && !hasConnected.current) {
      void fetchToken();
    }
  }, [currentConfig, fetchToken]);

  // Complete disconnect handler that properly cleans up state
  const handleDisconnect = useCallback(() => {
    isDisconnecting.current = true;
    hasConnected.current = false;
    setAgentState("disconnected");
    setConnectionDetails(undefined);

    // Allow reconnection after a short delay to ensure cleanup
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    reconnectTimer.current = setTimeout(() => {
      isDisconnecting.current = false;
    }, 1000);
  }, []);

  // Handle closing the entire voice chat component
  const handleClose = useCallback(() => {
    handleDisconnect();
    onClose();
  }, [handleDisconnect, onClose]);

  // Handle retry if connection fails
  const handleRetry = useCallback(() => {
    setError(null);
    hasConnected.current = false;
    isDisconnecting.current = false;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    // Small delay before retry to ensure clean state
    setTimeout(() => {
      void fetchToken();
    }, 500);
  }, [fetchToken]);

  // Show configuration modal first
  if (showConfigModal) {
    return (
      <VoiceChatConfigModal
        isOpen={showConfigModal}
        onClose={handleConfigModalClose}
        onSubmit={handleConfigSubmit}
      />
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`p-6 ${
          isDark ? "bg-black/30" : "bg-white/30"
        } rounded-lg border backdrop-blur-xl ${
          isDark ? "border-white/10" : "border-black/10"
        } w-full max-w-md`}
      >
        <div className="p-4 text-center">
          <h3 className="mb-2 text-xl font-bold">Connection Error</h3>
          <p className="mb-4 text-red-400">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRetry}
              className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Retry
            </button>
            <button
              onClick={handleClose}
              className="rounded bg-red-500/20 px-4 py-2 hover:bg-red-500/30"
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
        } rounded-lg border backdrop-blur-xl ${
          isDark ? "border-white/10" : "border-black/10"
        } w-full max-w-md`}
      >
        <div className="p-4 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-2 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
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
        className="grid h-full content-center bg-[var(--lk-bg)]"
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
          // Use the token itself as the key to ensure proper re-render on new connections
          key={connectionDetails.participantToken}
        >
          <SimpleVoiceAssistant
            onStateChange={handleAgentStateChange}
            onVoiceActivity={onVoiceActivity}
            isDark={isDark}
          />
          <ControlBar
            onConnectButtonClicked={fetchToken}
            agentState={agentState}
            // onDisconnect={handleDisconnect}
            onClose={handleClose}
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
    <div className="flex h-[300px] w-full items-center justify-center">
      <motion.div
        className="relative flex h-64 w-64 items-center justify-center"
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
          className="absolute h-36 w-36 rounded-full border"
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
          className="flex h-28 w-28 items-center justify-center rounded-full border"
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
          {/* Animated wave rings
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
          )} */}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
  onClose: () => void;
}) {
  /**
   * Use Krisp background noise reduction when available.
   * Note: This is only available on Scale plan, see {@link https://livekit.io/pricing | LiveKit Pricing} for more details.
   */

  return (
    <div className="relative h-[100px]">
      <AnimatePresence>
        {props.agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="absolute left-1/2 -translate-x-1/2 rounded-md bg-white px-4 py-2 uppercase text-black"
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
              className="absolute left-1/2 flex h-8 -translate-x-1/2 justify-center"
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton
                onClick={props.onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
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
    "Error acquiring microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab",
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
      <div className="max-w-xs rounded-lg bg-black/40 p-4 text-center backdrop-blur-sm">
        <p>No agent is available. Please try again later.</p>
      </div>
    </div>
  );
}
