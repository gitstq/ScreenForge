/**
 * ScreenForge - Preload Script
 * Exposes a safe, typed API to the renderer process via contextBridge.
 * All IPC communication between renderer and main process goes through here.
 */

import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../types'
import type {
  ElectronAPI,
  RecordingSource,
  RecordingConfig,
  RecordingState,
  VideoMetadata,
  AudioDeviceInfo,
  ExportConfig,
  ExportProgress,
  AIZoomResult,
  ZoomKeyframe,
  AppSettings,
} from '../types'

// ============================================================================
// API Implementation
// ============================================================================

const screenforgeAPI: ElectronAPI = {
  // -------------------------------------------------------------------------
  // Source Management
  // -------------------------------------------------------------------------

  getSources: (): Promise<RecordingSource[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_SOURCES)
  },

  getAudioDevices: (): Promise<AudioDeviceInfo[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_AUDIO_DEVICES)
  },

  // -------------------------------------------------------------------------
  // Recording Control
  // -------------------------------------------------------------------------

  startRecording: (config: RecordingConfig): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.START_RECORDING, config)
  },

  stopRecording: (): Promise<{ blob: ArrayBuffer; metadata: VideoMetadata }> => {
    return ipcRenderer.invoke(IPC_CHANNELS.STOP_RECORDING)
  },

  pauseRecording: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.PAUSE_RECORDING)
  },

  resumeRecording: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.RESUME_RECORDING)
  },

  getRecordingState: (): Promise<RecordingState> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_RECORDING_STATE)
  },

  // -------------------------------------------------------------------------
  // Export
  // -------------------------------------------------------------------------

  exportVideo: (config: ExportConfig): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.EXPORT_VIDEO, config)
  },

  cancelExport: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.CANCEL_EXPORT)
  },

  onExportProgress: (callback: (progress: ExportProgress) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, progress: ExportProgress) => {
      callback(progress)
    }
    ipcRenderer.on('export-progress', handler)
    return () => {
      ipcRenderer.removeListener('export-progress', handler)
    }
  },

  // -------------------------------------------------------------------------
  // AI Zoom
  // -------------------------------------------------------------------------

  analyzeAIZoom: (recordingId: string): Promise<AIZoomResult> => {
    return ipcRenderer.invoke(IPC_CHANNELS.ANALYZE_AI_ZOOM, recordingId)
  },

  addZoomKeyframe: (keyframe: ZoomKeyframe): Promise<void> => {
    // Note: recordingId is passed as a second argument
    return ipcRenderer.invoke(IPC_CHANNELS.ADD_ZOOM_KEYFRAME, keyframe, '')
  },

  removeZoomKeyframe: (timestamp: number): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.REMOVE_ZOOM_KEYFRAME, timestamp, '')
  },

  exportZoomConfig: (recordingId: string): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.EXPORT_ZOOM_CONFIG, recordingId)
  },

  // -------------------------------------------------------------------------
  // File Dialogs
  // -------------------------------------------------------------------------

  openFileDialog: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }): Promise<string | null> => {
    return ipcRenderer.invoke(IPC_CHANNELS.OPEN_FILE_DIALOG, options)
  },

  saveFileDialog: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }): Promise<string | null> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SAVE_FILE_DIALOG, options)
  },

  // -------------------------------------------------------------------------
  // App Info
  // -------------------------------------------------------------------------

  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_APP_VERSION)
  },

  // -------------------------------------------------------------------------
  // Settings
  // -------------------------------------------------------------------------

  getSettings: (): Promise<AppSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS)
  },

  saveSettings: (settings: Partial<AppSettings>): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTINGS, settings)
  },

  resetSettings: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.RESET_SETTINGS)
  },

  exportSettings: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.EXPORT_SETTINGS)
  },

  importSettings: (jsonString: string): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.IMPORT_SETTINGS, jsonString)
  },

  // -------------------------------------------------------------------------
  // Window Control
  // -------------------------------------------------------------------------

  minimizeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.MINIMIZE_WINDOW)
  },

  maximizeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.MAXIMIZE_WINDOW)
  },

  closeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.CLOSE_WINDOW)
  },

  // -------------------------------------------------------------------------
  // Event Listeners
  // -------------------------------------------------------------------------

  onRecordingStateChange: (callback: (state: RecordingState) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: RecordingState) => {
      callback(state)
    }
    ipcRenderer.on('recording-state-change', handler)
    return () => {
      ipcRenderer.removeListener('recording-state-change', handler)
    }
  },

  onRecordingError: (callback: (error: string) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, error: string) => {
      callback(error)
    }
    ipcRenderer.on('recording-error', handler)
    return () => {
      ipcRenderer.removeListener('recording-error', handler)
    }
  },
}

// ============================================================================
// Expose API to Renderer
// ============================================================================

// Use contextBridge to expose the API in a secure way
// This makes window.screenforgeAPI available in the renderer process
contextBridge.exposeInMainWorld('screenforgeAPI', screenforgeAPI)
