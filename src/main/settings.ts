/**
 * ScreenForge - Settings Management Module
 * Handles application settings persistence, validation, import/export
 */

import type {
  AppSettings,
  AIZoomConfig,
  KeyboardShortcut,
  RecordingQuality,
  ExportFormat,
  ExportResolution,
  AspectRatio,
} from '../types'

// ============================================================================
// Default Settings
// ============================================================================

/** Default AI zoom configuration */
const DEFAULT_AI_ZOOM_CONFIG: AIZoomConfig = {
  enabled: false,
  minZoomLevel: 1.0,
  maxZoomLevel: 3.0,
  defaultZoomLevel: 1.0,
  sensitivity: 0.6,
  minKeyframeInterval: 2000,
  smoothingFactor: 0.3,
  heatmapResolution: 20,
  prioritizeClicks: true,
}

/** Default keyboard shortcuts */
const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    action: 'start-recording',
    keybinding: 'CommandOrControl+Shift+R',
    description: 'Start recording',
  },
  {
    action: 'stop-recording',
    keybinding: 'CommandOrControl+Shift+S',
    description: 'Stop recording',
  },
  {
    action: 'pause-recording',
    keybinding: 'CommandOrControl+Shift+P',
    description: 'Pause/Resume recording',
  },
  {
    action: 'export-video',
    keybinding: 'CommandOrControl+Shift+E',
    description: 'Export current recording',
  },
  {
    action: 'toggle-ai-zoom',
    keybinding: 'CommandOrControl+Shift+Z',
    description: 'Toggle AI zoom tracking',
  },
]

/** Complete default application settings */
export const DEFAULT_SETTINGS: AppSettings = {
  // Recording defaults
  defaultQuality: 'high' as RecordingQuality,
  defaultFps: 30,
  defaultFormat: 'mp4' as ExportFormat,
  defaultResolution: '1080p' as ExportResolution,
  defaultAspectRatio: '16:9' as AspectRatio,

  // Audio settings
  captureSystemAudio: true,
  captureMicrophone: false,
  microphoneDeviceId: '',

  // Video settings
  showCursor: true,
  defaultBitrate: 5000,

  // AI Zoom settings
  aiZoomEnabled: false,
  aiZoomConfig: DEFAULT_AI_ZOOM_CONFIG,

  // Appearance
  theme: 'dark',
  language: 'zh-CN',

  // Storage
  outputDirectory: '',
  autoSave: true,
  maxAutoSaveCount: 50,

  // Shortcuts
  shortcuts: DEFAULT_SHORTCUTS,
}

// ============================================================================
// Settings Validation
// ============================================================================

/** Valid recording quality values */
const VALID_QUALITIES: RecordingQuality[] = ['low', 'medium', 'high', 'ultra']

/** Valid export formats */
const VALID_FORMATS: ExportFormat[] = ['mp4', 'gif', 'webm']

/** Valid resolutions */
const VALID_RESOLUTIONS: ExportResolution[] = ['1080p', '720p', '480p', 'custom']

/** Valid aspect ratios */
const VALID_ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:5', '4:3']

/** Valid theme values */
const VALID_THEMES = ['dark', 'light', 'system']

/** Valid FPS range */
const MIN_FPS = 1
const MAX_FPS = 120

/** Valid bitrate range (kbps) */
const MIN_BITRATE = 500
const MAX_BITRATE = 50000

/**
 * Validate a single setting value
 * @param key - The setting key
 * @param value - The value to validate
 * @returns True if the value is valid
 */
function validateSettingValue(key: string, value: unknown): boolean {
  switch (key) {
    case 'defaultQuality':
      return typeof value === 'string' && VALID_QUALITIES.includes(value as RecordingQuality)

    case 'defaultFps':
      return typeof value === 'number' && value >= MIN_FPS && value <= MAX_FPS

    case 'defaultFormat':
      return typeof value === 'string' && VALID_FORMATS.includes(value as ExportFormat)

    case 'defaultResolution':
      return typeof value === 'string' && VALID_RESOLUTIONS.includes(value as ExportResolution)

    case 'defaultAspectRatio':
      return typeof value === 'string' && VALID_ASPECT_RATIOS.includes(value as AspectRatio)

    case 'captureSystemAudio':
    case 'captureMicrophone':
    case 'showCursor':
    case 'autoSave':
    case 'aiZoomEnabled':
      return typeof value === 'boolean'

    case 'microphoneDeviceId':
    case 'outputDirectory':
    case 'language':
      return typeof value === 'string'

    case 'defaultBitrate':
      return typeof value === 'number' && value >= MIN_BITRATE && value <= MAX_BITRATE

    case 'maxAutoSaveCount':
      return typeof value === 'number' && value >= 1 && value <= 500

    case 'theme':
      return typeof value === 'string' && VALID_THEMES.includes(value)

    case 'aiZoomConfig':
      return validateAIZoomConfig(value as Partial<AIZoomConfig>)

    case 'shortcuts':
      return Array.isArray(value) && value.every(isValidShortcut)

    default:
      // Unknown settings are not validated but accepted
      return true
  }
}

/**
 * Validate AI zoom configuration
 */
function validateAIZoomConfig(config: Partial<AIZoomConfig>): boolean {
  if (typeof config !== 'object' || config === null) return false

  if (config.enabled !== undefined && typeof config.enabled !== 'boolean') return false
  if (config.minZoomLevel !== undefined && typeof config.minZoomLevel !== 'number') return false
  if (config.maxZoomLevel !== undefined && typeof config.maxZoomLevel !== 'number') return false
  if (config.defaultZoomLevel !== undefined && typeof config.defaultZoomLevel !== 'number') return false
  if (config.sensitivity !== undefined && (typeof config.sensitivity !== 'number' || config.sensitivity < 0 || config.sensitivity > 1)) return false
  if (config.minKeyframeInterval !== undefined && typeof config.minKeyframeInterval !== 'number') return false
  if (config.smoothingFactor !== undefined && (typeof config.smoothingFactor !== 'number' || config.smoothingFactor < 0 || config.smoothingFactor > 1)) return false
  if (config.heatmapResolution !== undefined && typeof config.heatmapResolution !== 'number') return false
  if (config.prioritizeClicks !== undefined && typeof config.prioritizeClicks !== 'boolean') return false

  return true
}

/**
 * Validate a keyboard shortcut definition
 */
function isValidShortcut(shortcut: unknown): boolean {
  if (typeof shortcut !== 'object' || shortcut === null) return false
  const s = shortcut as Record<string, unknown>
  return (
    typeof s.action === 'string' &&
    typeof s.keybinding === 'string' &&
    typeof s.description === 'string'
  )
}

// ============================================================================
// Settings Manager Class
// ============================================================================

/**
 * SettingsManager handles reading, writing, validating, importing,
 * and exporting application settings.
 *
 * In the Electron main process, this uses electron-store for persistence.
 * A simple in-memory fallback is provided for testing or non-Electron contexts.
 */
export class SettingsManager {
  private store: Map<string, unknown> | null = null
  private useElectronStore: boolean = false

  constructor() {
    this.initialize()
  }

  /**
   * Initialize the settings store
   * Attempts to use electron-store; falls back to in-memory Map
   */
  private initialize(): void {
    try {
      // Dynamic require to avoid issues in non-Electron environments
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ElectronStore = require('electron-store')
      this.store = new ElectronStore({
        name: 'screenforge-settings',
        defaults: DEFAULT_SETTINGS,
      }) as unknown as Map<string, unknown>
      this.useElectronStore = true
    } catch {
      // Fallback to in-memory store (useful for development / testing)
      console.warn('[SettingsManager] electron-store not available, using in-memory store')
      this.store = new Map<string, unknown>()
      this.loadDefaults()
    }
  }

  /**
   * Load default settings into the store
   */
  private loadDefaults(): void {
    if (!this.store) return
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      this.store.set(key, value)
    }
  }

  /**
   * Get a single setting value
   * @param key - The setting key
   * @returns The setting value, or the default if not set
   */
  get<T = unknown>(key: string): T {
    if (!this.store) {
      return DEFAULT_SETTINGS[key as keyof AppSettings] as unknown as T
    }

    try {
      if (this.useElectronStore && typeof (this.store as any).get === 'function') {
        return (this.store as any).get(key, DEFAULT_SETTINGS[key as keyof AppSettings]) as T
      }
      const value = this.store.get(key)
      return (value !== undefined ? value : DEFAULT_SETTINGS[key as keyof AppSettings]) as T
    } catch (error) {
      console.error(`[SettingsManager] Error reading setting "${key}":`, error)
      return DEFAULT_SETTINGS[key as keyof AppSettings] as unknown as T
    }
  }

  /**
   * Set a single setting value with validation
   * @param key - The setting key
   * @param value - The new value
   * @returns True if the value was set successfully
   */
  set<T = unknown>(key: string, value: T): boolean {
    if (!validateSettingValue(key, value)) {
      console.error(`[SettingsManager] Invalid value for setting "${key}":`, value)
      return false
    }

    try {
      if (this.useElectronStore && typeof (this.store as any).set === 'function') {
        (this.store as any).set(key, value)
      } else {
        this.store!.set(key, value)
      }
      return true
    } catch (error) {
      console.error(`[SettingsManager] Error writing setting "${key}":`, error)
      return false
    }
  }

  /**
   * Get all settings as a complete AppSettings object
   * @returns The full settings object
   */
  getAll(): AppSettings {
    const settings: Partial<AppSettings> = {}

    for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof AppSettings>) {
      settings[key] = this.get(key)
    }

    return settings as AppSettings
  }

  /**
   * Update multiple settings at once with validation
   * @param partial - Partial settings object to merge
   * @returns True if all settings were updated successfully
   */
  update(partial: Partial<AppSettings>): boolean {
    let allValid = true

    for (const [key, value] of Object.entries(partial)) {
      if (!validateSettingValue(key, value)) {
        console.error(`[SettingsManager] Invalid value for setting "${key}":`, value)
        allValid = false
        continue
      }

      const success = this.set(key, value)
      if (!success) {
        allValid = false
      }
    }

    return allValid
  }

  /**
   * Reset all settings to their default values
   */
  reset(): void {
    try {
      if (this.useElectronStore && typeof (this.store as any).clear === 'function') {
        (this.store as any).clear()
      } else {
        this.store!.clear()
      }
      this.loadDefaults()
    } catch (error) {
      console.error('[SettingsManager] Error resetting settings:', error)
    }
  }

  /**
   * Export settings as a JSON string
   * @returns JSON string of current settings
   */
  exportJSON(): string {
    const settings = this.getAll()
    return JSON.stringify(settings, null, 2)
  }

  /**
   * Import settings from a JSON string with validation
   * @param jsonString - JSON string containing settings
   * @returns True if import was successful
   */
  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as Partial<AppSettings>

      if (typeof parsed !== 'object' || parsed === null) {
        console.error('[SettingsManager] Invalid settings JSON: not an object')
        return false
      }

      // Validate all keys before applying
      for (const [key, value] of Object.entries(parsed)) {
        if (!validateSettingValue(key, value)) {
          console.error(`[SettingsManager] Invalid value in imported settings for "${key}":`, value)
          return false
        }
      }

      // Apply validated settings
      return this.update(parsed)
    } catch (error) {
      console.error('[SettingsManager] Error importing settings:', error)
      return false
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/** Global settings manager instance */
let settingsManagerInstance: SettingsManager | null = null

/**
 * Get the singleton SettingsManager instance
 * @returns The shared SettingsManager
 */
export function getSettingsManager(): SettingsManager {
  if (!settingsManagerInstance) {
    settingsManagerInstance = new SettingsManager()
  }
  return settingsManagerInstance
}
