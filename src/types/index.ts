/**
 * ScreenForge - TypeScript Type Definitions
 * Central type definitions for the entire application
 */

// ============================================================================
// Recording Types
// ============================================================================

/** Supported recording source types */
export type RecordingSourceType = 'screen' | 'window' | 'area'

/** Represents a capturable screen or window source */
export interface RecordingSource {
  /** Unique identifier for the source */
  id: string
  /** Display name of the source */
  name: string
  /** Type of the source */
  type: RecordingSourceType
  /** Thumbnail data URL (base64 encoded) */
  thumbnail?: string
  /** Source dimensions */
  displaySize?: {
    width: number
    height: number
  }
}

/** Recording state machine states */
export enum RecordingState {
  /** No active recording */
  Idle = 'idle',
  /** Currently recording */
  Recording = 'recording',
  /** Recording is paused */
  Paused = 'paused',
  /** Recording is being stopped / finalized */
  Stopping = 'stopping',
}

/** Recording quality presets */
export type RecordingQuality = 'low' | 'medium' | 'high' | 'ultra'

/** Audio device information */
export interface AudioDeviceInfo {
  /** Unique device identifier */
  deviceId: string
  /** Human-readable device name */
  label: string
  /** Whether this is an input (microphone) device */
  isInput: boolean
}

/** Configuration for a recording session */
export interface RecordingConfig {
  /** The source to record from */
  source: RecordingSource
  /** Recording quality preset */
  quality: RecordingQuality
  /** Target frame rate (fps) */
  fps: number
  /** Whether to capture system audio */
  captureSystemAudio: boolean
  /** Whether to capture microphone audio */
  captureMicrophone: boolean
  /** Audio device ID for microphone input */
  microphoneDeviceId?: string
  /** Whether to capture webcam overlay */
  captureWebcam: boolean
  /** Whether to show cursor in recording */
  showCursor: boolean
  /** Custom recording area (for area mode) */
  area?: {
    x: number
    y: number
    width: number
    height: number
  }
  /** Whether AI zoom tracking is enabled */
  enableAIZoom: boolean
}

/** Metadata about a completed recording */
export interface VideoMetadata {
  /** Unique recording identifier */
  id: string
  /** Recording start timestamp (ISO string) */
  startTime: string
  /** Recording end timestamp (ISO string) */
  endTime: string
  /** Total recording duration in seconds */
  duration: number
  /** Original video width in pixels */
  width: number
  /** Original video height in pixels */
  height: number
  /** Recording frame rate */
  fps: number
  /** File size in bytes (after export) */
  fileSize?: number
  /** File path of the exported video */
  filePath?: string
  /** MIME type of the recorded video */
  mimeType: string
  /** Whether system audio was captured */
  hasSystemAudio: boolean
  /** Whether microphone audio was captured */
  hasMicrophone: boolean
  /** Whether webcam was captured */
  hasWebcam: boolean
}

// ============================================================================
// Export Types
// ============================================================================

/** Supported video export formats */
export type ExportFormat = 'mp4' | 'gif' | 'webm'

/** Supported resolution presets */
export type ExportResolution = '1080p' | '720p' | '480p' | 'custom'

/** Supported aspect ratios for cropping */
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3'

/** Background replacement options */
export interface BackgroundConfig {
  /** Background type */
  type: 'none' | 'solid' | 'gradient' | 'image' | 'blur'
  /** Solid color (hex string, e.g. '#ffffff') */
  color?: string
  /** Gradient definition */
  gradient?: {
    /** Start color (hex) */
    startColor: string
    /** End color (hex) */
    endColor: string
    /** Gradient direction in degrees */
    direction: number
  }
  /** Path to background image */
  imagePath?: string
  /** Blur intensity (1-100) */
  blurIntensity?: number
}

/** Configuration for video export */
export interface ExportConfig {
  /** Source video file path */
  sourcePath: string
  /** Output file path */
  outputPath: string
  /** Export format */
  format: ExportFormat
  /** Target resolution */
  resolution: ExportResolution
  /** Custom width (used when resolution is 'custom') */
  customWidth?: number
  /** Custom height (used when resolution is 'custom') */
  customHeight?: number
  /** Target aspect ratio for cropping */
  aspectRatio?: AspectRatio
  /** Target frame rate */
  fps?: number
  /** Video bitrate in kbps */
  bitrate?: number
  /** Background replacement config */
  background?: BackgroundConfig
  /** Whether to apply AI zoom keyframes */
  applyAIZoom?: boolean
  /** Path to AI zoom keyframes JSON */
  aiZoomKeyframesPath?: string
}

/** Export progress information */
export interface ExportProgress {
  /** Current progress percentage (0-100) */
  percent: number
  /** Current processing stage */
  stage: 'preparing' | 'processing' | 'encoding' | 'finalizing' | 'done' | 'error'
  /** Estimated time remaining in seconds */
  eta?: number
  /** Current frame being processed */
  currentFrame?: number
  /** Total frames to process */
  totalFrames?: number
  /** Speed ratio (e.g. 2.0x means processing at 2x speed) */
  speed?: number
  /** Error message if stage is 'error' */
  errorMessage?: string
}

// ============================================================================
// AI Zoom Types
// ============================================================================

/** A single mouse activity data point */
export interface MouseActivityPoint {
  /** Timestamp relative to recording start (ms) */
  timestamp: number
  /** Mouse X position on screen */
  x: number
  /** Mouse Y position on screen */
  y: number
  /** Whether a click occurred at this point */
  isClick: boolean
}

/** A zoom keyframe defining the viewport at a specific time */
export interface ZoomKeyframe {
  /** Timestamp relative to recording start (ms) */
  timestamp: number
  /** Target center X position */
  centerX: number
  /** Target center Y position */
  centerY: number
  /** Zoom level (1.0 = no zoom, 2.0 = 2x zoom) */
  zoomLevel: number
  /** Easing function for interpolation to this keyframe */
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  /** Duration of the transition from the previous keyframe (ms) */
  transitionDuration: number
  /** Whether this keyframe was manually added */
  isManual: boolean
}

/** Heatmap grid cell */
export interface HeatmapCell {
  /** Grid column index */
  col: number
  /** Grid row index */
  row: number
  /** Activity intensity value (0-1) */
  intensity: number
}

/** AI Zoom analysis configuration */
export interface AIZoomConfig {
  /** Whether AI zoom is enabled */
  enabled: boolean
  /** Minimum zoom level */
  minZoomLevel: number
  /** Maximum zoom level */
  maxZoomLevel: number
  /** Default zoom level when no activity detected */
  defaultZoomLevel: number
  /** Zoom sensitivity (0-1, higher = more reactive) */
  sensitivity: number
  /** Minimum time between keyframe changes (ms) */
  minKeyframeInterval: number
  /** Smoothing factor for interpolation (0-1) */
  smoothingFactor: number
  /** Heatmap grid resolution (number of cells per axis) */
  heatmapResolution: number
  /** Whether to include click hotspots with higher priority */
  prioritizeClicks: boolean
}

/** Complete AI zoom analysis result */
export interface AIZoomResult {
  /** Generated zoom keyframes */
  keyframes: ZoomKeyframe[]
  /** Activity heatmap data */
  heatmap: HeatmapCell[]
  /** Total recording duration (ms) */
  totalDuration: number
  /** Original video dimensions */
  videoSize: {
    width: number
    height: number
  }
}

// ============================================================================
// Settings Types
// ============================================================================

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  /** Action identifier */
  action: string
  /** Key combination (e.g. 'CommandOrControl+Shift+R') */
  keybinding: string
  /** Human-readable description */
  description: string
}

/** Application settings */
export interface AppSettings {
  // Recording defaults
  /** Default recording quality */
  defaultQuality: RecordingQuality
  /** Default recording frame rate */
  defaultFps: number
  /** Default export format */
  defaultFormat: ExportFormat
  /** Default export resolution */
  defaultResolution: ExportResolution
  /** Default aspect ratio */
  defaultAspectRatio: AspectRatio

  // Audio settings
  /** Default system audio capture */
  captureSystemAudio: boolean
  /** Default microphone capture */
  captureMicrophone: boolean
  /** Selected microphone device ID */
  microphoneDeviceId: string

  // Video settings
  /** Show cursor in recordings */
  showCursor: boolean
  /** Default video bitrate (kbps) */
  defaultBitrate: number

  // AI Zoom settings
  /** AI zoom enabled by default */
  aiZoomEnabled: boolean
  /** AI zoom configuration */
  aiZoomConfig: AIZoomConfig

  // Appearance
  /** Theme mode */
  theme: 'dark' | 'light' | 'system'
  /** Language */
  language: string

  // Storage
  /** Default output directory for exports */
  outputDirectory: string
  /** Whether to auto-save recordings */
  autoSave: boolean
  /** Maximum auto-save recordings to keep */
  maxAutoSaveCount: number

  // Shortcuts
  /** Custom keyboard shortcuts */
  shortcuts: KeyboardShortcut[]
}

// ============================================================================
// IPC Channel Types
// ============================================================================

/** All IPC channel names (kebab-case) */
export const IPC_CHANNELS = {
  // Source management
  GET_SOURCES: 'get-sources',
  GET_AUDIO_DEVICES: 'get-audio-devices',

  // Recording control
  START_RECORDING: 'start-recording',
  STOP_RECORDING: 'stop-recording',
  PAUSE_RECORDING: 'pause-recording',
  RESUME_RECORDING: 'resume-recording',
  GET_RECORDING_STATE: 'get-recording-state',

  // Export
  EXPORT_VIDEO: 'export-video',
  CANCEL_EXPORT: 'cancel-export',
  GET_EXPORT_PROGRESS: 'get-export-progress',

  // AI Zoom
  ANALYZE_AI_ZOOM: 'analyze-ai-zoom',
  GET_AI_ZOOM_RESULT: 'get-ai-zoom-result',
  ADD_ZOOM_KEYFRAME: 'add-zoom-keyframe',
  REMOVE_ZOOM_KEYFRAME: 'remove-zoom-keyframe',
  EXPORT_ZOOM_CONFIG: 'export-zoom-config',

  // File dialogs
  OPEN_FILE_DIALOG: 'open-file-dialog',
  SAVE_FILE_DIALOG: 'save-file-dialog',

  // App info
  GET_APP_VERSION: 'get-app-version',

  // Settings
  GET_SETTINGS: 'get-settings',
  SAVE_SETTINGS: 'save-settings',
  RESET_SETTINGS: 'reset-settings',
  EXPORT_SETTINGS: 'export-settings',
  IMPORT_SETTINGS: 'import-settings',

  // Window control
  MINIMIZE_WINDOW: 'minimize-window',
  MAXIMIZE_WINDOW: 'maximize-window',
  CLOSE_WINDOW: 'close-window',
} as const

/** IPC channel name type derived from the channels object */
export type IPCChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

// ============================================================================
// Electron API (exposed via preload)
// ============================================================================

/** The API exposed to the renderer process via contextBridge */
export interface ElectronAPI {
  // Source management
  getSources: () => Promise<RecordingSource[]>
  getAudioDevices: () => Promise<AudioDeviceInfo[]>

  // Recording control
  startRecording: (config: RecordingConfig) => Promise<void>
  stopRecording: () => Promise<{ blob: ArrayBuffer; metadata: VideoMetadata }>
  pauseRecording: () => Promise<void>
  resumeRecording: () => Promise<void>
  getRecordingState: () => Promise<RecordingState>

  // Export
  exportVideo: (config: ExportConfig) => Promise<void>
  cancelExport: () => Promise<void>
  onExportProgress: (callback: (progress: ExportProgress) => void) => () => void

  // AI Zoom
  analyzeAIZoom: (recordingId: string) => Promise<AIZoomResult>
  addZoomKeyframe: (keyframe: ZoomKeyframe) => Promise<void>
  removeZoomKeyframe: (timestamp: number) => Promise<void>
  exportZoomConfig: (recordingId: string) => Promise<string>

  // File dialogs
  openFileDialog: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }) => Promise<string | null>
  saveFileDialog: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }) => Promise<string | null>

  // App info
  getAppVersion: () => Promise<string>

  // Settings
  getSettings: () => Promise<AppSettings>
  saveSettings: (settings: Partial<AppSettings>) => Promise<void>
  resetSettings: () => Promise<void>
  exportSettings: () => Promise<string>
  importSettings: (jsonString: string) => Promise<void>

  // Window control
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>

  // Event listeners
  onRecordingStateChange: (callback: (state: RecordingState) => void) => () => void
  onRecordingError: (callback: (error: string) => void) => () => void
}

/** Augment the global Window type to include our Electron API */
declare global {
  interface Window {
    screenforgeAPI?: ElectronAPI
  }
}
