/**
 * Interface for LiveKit room name configuration
 * This structure is encoded as base64 JSON and used for room names
 */
export interface LiveKitRoomConfig {
  /**
   * User ID for the participant
   */
  userId: string;

  /**
   * Currently selected language
   */
  language: string;

  /**
   * User's first name (empty if not provided during registration)
   */
  userName: string;

  /**
   * Whether to greet the user upon joining
   * @default true
   */
  greet: boolean;

  /**
   * Voice model to use for this room
   * @default "alloy"
   */
  voice: string;
  /**
   * Custom instructions for the agent
   * If present, overrides default instructions and changes greeting logic
   * @default undefined
   */
  instructions?: string;

  /**
   * Real-time mode flag
   * When enabled, uses real-time processing and disables model selection
   * @default false
   */
  rt?: boolean;

  /**
   * Speech-to-text model for voice recognition
   * @default undefined
   */
  stt_model?: string;

  /**
   * Language model for conversation
   * @default undefined
   */
  llm_model?: string;

  /**
   * Text-to-speech model for voice generation
   * @default undefined
   */
  tts_model?: string;

  /**
   * Timestamp when the room was created
   * @default Current time when room is encoded
   */
  timeStamp: number;
}

/**
 * Available voice models for the voice assistant
 */
export const VOICE_MODELS = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
] as const;

export type VoiceModel = (typeof VOICE_MODELS)[number];

/**
 * Supported languages for the voice assistant
 * All language codes are lowercase and use full language names
 */
export const SUPPORTED_LANGUAGES = [
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "portuguese",
  "russian",
  "japanese",
  "korean",
  "chinese",
  "arabic",
  "hindi",
  "urdu",
  "turkish",
  "dutch",
  "polish",
  "swedish",
  "norwegian",
  "danish",
  "finnish",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Available speech-to-text (STT) models
 */
export const STT_MODELS = [
  "whisper-large-v3",
  "whisper-large-v3-turbo",
  "distil-whisper-large-v3-en",
] as const;

export type STTModel = (typeof STT_MODELS)[number];

/**
 * Available language model (LLM) options
 */
export const LLM_MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "llama-3.1-8b-instant",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-guard-4-12b",
  "llama-guard-3-8b",
  "gemma2-9b-it",
  "allam-2-7b",
  "compound-beta",
  "compound-beta-mini",
  "deepseek-r1-distill-llama-70b",
  "mistral-saba-24b",
  "qwen-qwq-32b",
] as const;

export type LLMModel = (typeof LLM_MODELS)[number];

/**
 * Available text-to-speech (TTS) models
 */
export const TTS_MODELS = [
  "gpt-4o-mini-tts",
  "tts-1",
  "tts-1-hd",
  "playai-tts",
  "playai-tts-arabic",
] as const;

export type TTSModel = (typeof TTS_MODELS)[number];

/**
 * Predefined assistant personas
 */
export const ASSISTANT_PERSONAS = {
  THERAPIST: {
    id: "therapist",
    title: "Mental Health Guide",
    icon: "Heart",
    instruction:
      "You are a compassionate therapist named Dr. Sarah, skilled in cognitive behavioral therapy and emotional support.",
  },
  MEDICAL: {
    id: "medical",
    title: "Healthcare Navigator",
    icon: "Stethoscope",
    instruction: "You are a primary care physician.",
  },
  INSURANCE: {
    id: "insurance",
    title: "Insurance Advisor",
    icon: "Shield",
    instruction: "You are an experienced insurance consultant.",
  },
  TRAVEL: {
    id: "travel",
    title: "Travel Planner",
    icon: "Plane",
    instruction: "You are a travel expert.",
  },
  CAR_SALES: {
    id: "car_sales",
    title: "Auto Specialist",
    icon: "Car",
    instruction: "You are an automotive expert.",
  },
} as const;

export type AssistantPersona = keyof typeof ASSISTANT_PERSONAS;

/**
 * Encodes a LiveKit room configuration as base64
 */
export function encodeLiveKitRoomConfig(config: LiveKitRoomConfig): string {
  const jsonString = JSON.stringify(config);
  return btoa(jsonString);
}

/**
 * Decodes a base64 encoded LiveKit room configuration
 */
export function decodeLiveKitRoomConfig(
  encodedConfig: string,
): LiveKitRoomConfig {
  const jsonString = atob(encodedConfig);
  return JSON.parse(jsonString) as LiveKitRoomConfig;
}
