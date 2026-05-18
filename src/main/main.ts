/**
 * ScreenForge - Electron Main Process Entry
 * Initializes the application window, system tray, and IPC handlers.
 * Manages the lifecycle of recording, export, and AI zoom modules.
 */

import { app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage, screen } from 'electron'
import * as path from 'path'
import { IPC_CHANNELS } from '../types'
import type {
  RecordingConfig,
  RecordingSource,
  ExportConfig,
  ExportProgress,
  AudioDeviceInfo,
  AppSettings,
  RecordingState,
  ZoomKeyframe,
  AIZoomConfig,
} from '../types'
import { getSettingsManager } from './settings'
import { getScreenRecorder } from './recorder'
import { getVideoExporter } from './exporter'
import { getAIZoomAnalyzer, removeAIZoomAnalyzer } from './ai-zoom'

// ============================================================================
// Global References
// ============================================================================

/** Main application window */
let mainWindow: BrowserWindow | null = null

/** System tray instance */
let tray: Tray | null = null

/** Whether the app is quitting (to distinguish from window close) */
let isQuitting: boolean = false

/** Temporary file path for the last recorded video blob */
let lastRecordingBlobPath: string | null = null

// ============================================================================
// Window Creation
// ============================================================================

/**
 * Create the main application BrowserWindow
 */
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false, // Frameless window for custom title bar
    titleBarStyle: 'hidden',
    backgroundColor: '#0f172a', // Dark theme background (slate-900)
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
    show: false, // Show after ready-to-show to avoid flash
  })

  // Load the renderer
  if (process.env.NODE_ENV === 'development' || process.env.ELECTRON_RENDERER_URL) {
    // Development: load from Vite dev server
    const rendererUrl = process.env.ELECTRON_RENDERER_URL || 'http://localhost:5173'
    mainWindow.loadURL(rendererUrl)
    // Open DevTools in development
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // Production: load from built files
    const rendererPath = path.join(__dirname, '../renderer/index.html')
    mainWindow.loadFile(rendererPath)
  }

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  // Clean up when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow safe protocols only
    if (url.startsWith('https://') || url.startsWith('http://')) {
      // Open in default browser
      // shell.openExternal(url) // Uncomment if needed
    }
    return { action: 'deny' }
  })
}

// ============================================================================
// System Tray
// ============================================================================

/**
 * Create the system tray icon and context menu
 */
function createTray(): void {
  // Create a simple tray icon (16x16 pixel buffer)
  const icon = nativeImage.createEmpty()
  try {
    // Try to load the app icon
    const iconPath = path.join(process.resourcesPath || __dirname, 'resources', 'icon.png')
    const loadedIcon = nativeImage.createFromPath(iconPath)
    if (!loadedIcon.isEmpty()) {
      tray = new Tray(loadedIcon.resize({ width: 16, height: 16 }))
    } else {
      throw new Error('Icon not found')
    }
  } catch {
    // Fallback: create a minimal icon programmatically
    const size = 16
    const buffer = Buffer.alloc(size * size * 4, 0)
    // Draw a simple blue circle
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - size / 2
        const dy = y - size / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= size / 2) {
          const offset = (y * size + x) * 4
          buffer[offset] = 59     // R (primary-500)
          buffer[offset + 1] = 130 // G
          buffer[offset + 2] = 246 // B
          buffer[offset + 3] = 255 // A
        }
      }
    }
    const fallbackIcon = nativeImage.createFromBuffer(buffer, { width: size, height: size })
    tray = new Tray(fallbackIcon)
  }

  if (!tray) return

  tray.setToolTip('ScreenForge - Screen Recording')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ScreenForge',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      },
    },
    { type: 'separator' },
    {
      label: 'Start Recording',
      click: () => {
        mainWindow?.webContents.send('tray-start-recording')
      },
    },
    {
      label: 'Stop Recording',
      click: () => {
        mainWindow?.webContents.send('tray-stop-recording')
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  // Click tray icon to show window
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus()
      } else {
        mainWindow.show()
      }
    }
  })
}

// ============================================================================
// IPC Handlers - Source Management
// ============================================================================

/**
 * Register IPC handler for getting available screen/window sources
 */
function registerGetSourcesHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_SOURCES, async (): Promise<RecordingSource[]> => {
    try {
      const { desktopCapturer } = require('electron')
      const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
        thumbnailSize: { width: 320, height: 180 },
        fetchWindowIcons: true,
      })

      return sources.map((source: any, index: number) => ({
        id: source.id,
        name: source.name,
        type: source.id.startsWith('screen:') ? 'screen' as const : 'window' as const,
        thumbnail: source.thumbnail?.toDataURL() || undefined,
        displaySize: source.display_size
          ? { width: source.display_size.width, height: source.display_size.height }
          : undefined,
        // Fallback display size from primary screen
        ...(source.display_size ? {} : {
          displaySize: screen.getPrimaryDisplay()?.workAreaSize
            ? { width: screen.getPrimaryDisplay()!.workAreaSize.width, height: screen.getPrimaryDisplay()!.workAreaSize.height }
            : { width: 1920, height: 1080 },
        }),
      }))
    } catch (error) {
      console.error('[Main] Failed to get sources:', error)
      throw new Error(`Failed to get recording sources: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

/**
 * Register IPC handler for getting audio devices
 */
function registerGetAudioDevicesHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_AUDIO_DEVICES, async (): Promise<AudioDeviceInfo[]> => {
    try {
      // In Electron, we need to use the renderer process to enumerate devices
      // via navigator.mediaDevices.enumerateDevices(). For the main process,
      // we return a placeholder that will be enriched by the preload script.
      return []
    } catch (error) {
      console.error('[Main] Failed to get audio devices:', error)
      return []
    }
  })
}

// ============================================================================
// IPC Handlers - Recording Control
// ============================================================================

/**
 * Register IPC handler for starting a recording
 */
function registerStartRecordingHandler(): void {
  ipcMain.handle(IPC_CHANNELS.START_RECORDING, async (_event, config: RecordingConfig): Promise<void> => {
    try {
      const recorder = getScreenRecorder()
      await recorder.start(config)

      // Notify renderer about state change
      mainWindow?.webContents.send('recording-state-change', recorder.getState())
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      mainWindow?.webContents.send('recording-error', message)
      throw error
    }
  })
}

/**
 * Register IPC handler for stopping a recording
 */
function registerStopRecordingHandler(): void {
  ipcMain.handle(IPC_CHANNELS.STOP_RECORDING, async (): Promise<{ blobData: ArrayBuffer; metadata: any }> => {
    try {
      const recorder = getScreenRecorder()
      const { blob, metadata } = await recorder.stop()

      // Convert Blob to ArrayBuffer for IPC transfer
      const arrayBuffer = await blob.arrayBuffer()

      // Save blob to a temporary file for later export
      const fs = require('fs')
      const os = require('os')
      const tempDir = os.tmpdir()
      lastRecordingBlobPath = path.join(tempDir, `screenforge-${metadata.id}.webm`)
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(lastRecordingBlobPath, buffer)

      // Notify renderer about state change
      mainWindow?.webContents.send('recording-state-change', recorder.getState())

      return {
        blobData: arrayBuffer,
        metadata: {
          ...metadata,
          filePath: lastRecordingBlobPath,
          fileSize: buffer.length,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      mainWindow?.webContents.send('recording-error', message)
      throw error
    }
  })
}

/**
 * Register IPC handler for pausing a recording
 */
function registerPauseRecordingHandler(): void {
  ipcMain.handle(IPC_CHANNELS.PAUSE_RECORDING, async (): Promise<void> => {
    try {
      const recorder = getScreenRecorder()
      recorder.pause()
      mainWindow?.webContents.send('recording-state-change', recorder.getState())
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      mainWindow?.webContents.send('recording-error', message)
      throw error
    }
  })
}

/**
 * Register IPC handler for resuming a recording
 */
function registerResumeRecordingHandler(): void {
  ipcMain.handle(IPC_CHANNELS.RESUME_RECORDING, async (): Promise<void> => {
    try {
      const recorder = getScreenRecorder()
      recorder.resume()
      mainWindow?.webContents.send('recording-state-change', recorder.getState())
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      mainWindow?.webContents.send('recording-error', message)
      throw error
    }
  })
}

/**
 * Register IPC handler for getting recording state
 */
function registerGetRecordingStateHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_RECORDING_STATE, async (): Promise<RecordingState> => {
    const recorder = getScreenRecorder()
    return recorder.getState()
  })
}

// ============================================================================
// IPC Handlers - Export
// ============================================================================

/**
 * Register IPC handler for exporting a video
 */
function registerExportVideoHandler(): void {
  ipcMain.handle(IPC_CHANNELS.EXPORT_VIDEO, async (_event, config: ExportConfig): Promise<void> => {
    try {
      const exporter = getVideoExporter()

      await exporter.export(config, (progress: ExportProgress) => {
        // Send progress updates to the renderer
        mainWindow?.webContents.send('export-progress', progress)
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      mainWindow?.webContents.send('export-progress', {
        percent: 0,
        stage: 'error',
        errorMessage: message,
      })
      throw error
    }
  })
}

/**
 * Register IPC handler for cancelling an export
 */
function registerCancelExportHandler(): void {
  ipcMain.handle(IPC_CHANNELS.CANCEL_EXPORT, async (): Promise<void> => {
    const exporter = getVideoExporter()
    exporter.cancel()
  })
}

/**
 * Register IPC handler for getting export progress
 */
function registerGetExportProgressHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_EXPORT_PROGRESS, async (): Promise<ExportProgress | null> => {
    // Progress is sent via push events, this is a fallback
    return null
  })
}

// ============================================================================
// IPC Handlers - AI Zoom
// ============================================================================

/**
 * Register IPC handler for analyzing AI zoom
 */
function registerAnalyzeAIZoomHandler(): void {
  ipcMain.handle(IPC_CHANNELS.ANALYZE_AI_ZOOM, async (_event, recordingId: string): Promise<any> => {
    try {
      const recorder = getScreenRecorder()
      const mouseActivities = recorder.getMouseActivities()

      // Get video metadata (use sensible defaults if not available)
      const videoWidth = 1920
      const videoHeight = 1080
      const totalDuration = mouseActivities.length > 0
        ? mouseActivities[mouseActivities.length - 1].timestamp
        : 0

      const settings = getSettingsManager()
      const aiZoomConfig = settings.get('aiZoomConfig')

      const analyzer = getAIZoomAnalyzer(
        recordingId,
        videoWidth,
        videoHeight,
        totalDuration,
        aiZoomConfig as Partial<AIZoomConfig> | undefined
      )

      analyzer.setMouseActivities(mouseActivities)
      return analyzer.analyze()
    } catch (error) {
      console.error('[Main] AI zoom analysis failed:', error)
      throw new Error(`AI zoom analysis failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

/**
 * Register IPC handler for adding a zoom keyframe
 */
function registerAddZoomKeyframeHandler(): void {
  ipcMain.handle(IPC_CHANNELS.ADD_ZOOM_KEYFRAME, async (_event, keyframe: ZoomKeyframe, recordingId: string): Promise<void> => {
    try {
      const analyzer = getAIZoomAnalyzer(recordingId, 1920, 1080, 0)
      analyzer.addManualKeyframe(keyframe)
    } catch (error) {
      throw new Error(`Failed to add zoom keyframe: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

/**
 * Register IPC handler for removing a zoom keyframe
 */
function registerRemoveZoomKeyframeHandler(): void {
  ipcMain.handle(IPC_CHANNELS.REMOVE_ZOOM_KEYFRAME, async (_event, timestamp: number, recordingId: string): Promise<void> => {
    try {
      const analyzer = getAIZoomAnalyzer(recordingId, 1920, 1080, 0)
      analyzer.removeManualKeyframe(timestamp)
    } catch (error) {
      throw new Error(`Failed to remove zoom keyframe: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

/**
 * Register IPC handler for exporting zoom configuration
 */
function registerExportZoomConfigHandler(): void {
  ipcMain.handle(IPC_CHANNELS.EXPORT_ZOOM_CONFIG, async (_event, recordingId: string): Promise<string> => {
    try {
      const analyzer = getAIZoomAnalyzer(recordingId, 1920, 1080, 0)
      return analyzer.exportJSON()
    } catch (error) {
      throw new Error(`Failed to export zoom config: ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

// ============================================================================
// IPC Handlers - File Dialogs
// ============================================================================

/**
 * Register IPC handler for opening a file dialog
 */
function registerOpenFileDialogHandler(): void {
  ipcMain.handle(IPC_CHANNELS.OPEN_FILE_DIALOG, async (_event, options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }): Promise<string | null> => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: 'Select File',
      properties: ['openFile'],
      filters: options?.filters || [
        { name: 'Video Files', extensions: ['mp4', 'webm', 'gif', 'avi', 'mov'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: options?.defaultPath,
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })
}

/**
 * Register IPC handler for saving a file dialog
 */
function registerSaveFileDialogHandler(): void {
  ipcMain.handle(IPC_CHANNELS.SAVE_FILE_DIALOG, async (_event, options?: {
    filters?: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }): Promise<string | null> => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      title: 'Save File',
      filters: options?.filters || [
        { name: 'MP4 Video', extensions: ['mp4'] },
        { name: 'WebM Video', extensions: ['webm'] },
        { name: 'GIF Animation', extensions: ['gif'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: options?.defaultPath,
    })

    if (result.canceled) {
      return null
    }

    return result.filePath
  })
}

// ============================================================================
// IPC Handlers - App Info
// ============================================================================

/**
 * Register IPC handler for getting app version
 */
function registerGetAppVersionHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, async (): Promise<string> => {
    return app.getVersion()
  })
}

// ============================================================================
// IPC Handlers - Settings
// ============================================================================

/**
 * Register IPC handler for getting settings
 */
function registerGetSettingsHandler(): void {
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async (): Promise<AppSettings> => {
    const manager = getSettingsManager()
    return manager.getAll()
  })
}

/**
 * Register IPC handler for saving settings
 */
function registerSaveSettingsHandler(): void {
  ipcMain.handle(IPC_CHANNELS.SAVE_SETTINGS, async (_event, settings: Partial<AppSettings>): Promise<void> => {
    const manager = getSettingsManager()
    const success = manager.update(settings)
    if (!success) {
      throw new Error('Failed to save settings: validation error')
    }
  })
}

/**
 * Register IPC handler for resetting settings
 */
function registerResetSettingsHandler(): void {
  ipcMain.handle(IPC_CHANNELS.RESET_SETTINGS, async (): Promise<void> => {
    const manager = getSettingsManager()
    manager.reset()
  })
}

/**
 * Register IPC handler for exporting settings
 */
function registerExportSettingsHandler(): void {
  ipcMain.handle(IPC_CHANNELS.EXPORT_SETTINGS, async (): Promise<string> => {
    const manager = getSettingsManager()
    return manager.exportJSON()
  })
}

/**
 * Register IPC handler for importing settings
 */
function registerImportSettingsHandler(): void {
  ipcMain.handle(IPC_CHANNELS.IMPORT_SETTINGS, async (_event, jsonString: string): Promise<void> => {
    const manager = getSettingsManager()
    const success = manager.importJSON(jsonString)
    if (!success) {
      throw new Error('Failed to import settings: validation error')
    }
  })
}

// ============================================================================
// IPC Handlers - Window Control
// ============================================================================

/**
 * Register IPC handlers for window control (minimize, maximize, close)
 */
function registerWindowControlHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.MINIMIZE_WINDOW, async (): Promise<void> => {
    mainWindow?.minimize()
  })

  ipcMain.handle(IPC_CHANNELS.MAXIMIZE_WINDOW, async (): Promise<void> => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle(IPC_CHANNELS.CLOSE_WINDOW, async (): Promise<void> => {
    mainWindow?.close()
  })
}

// ============================================================================
// IPC Handler Registration
// ============================================================================

/**
 * Register all IPC handlers
 */
function registerAllHandlers(): void {
  // Source management
  registerGetSourcesHandler()
  registerGetAudioDevicesHandler()

  // Recording control
  registerStartRecordingHandler()
  registerStopRecordingHandler()
  registerPauseRecordingHandler()
  registerResumeRecordingHandler()
  registerGetRecordingStateHandler()

  // Export
  registerExportVideoHandler()
  registerCancelExportHandler()
  registerGetExportProgressHandler()

  // AI Zoom
  registerAnalyzeAIZoomHandler()
  registerAddZoomKeyframeHandler()
  registerRemoveZoomKeyframeHandler()
  registerExportZoomConfigHandler()

  // File dialogs
  registerOpenFileDialogHandler()
  registerSaveFileDialogHandler()

  // App info
  registerGetAppVersionHandler()

  // Settings
  registerGetSettingsHandler()
  registerSaveSettingsHandler()
  registerResetSettingsHandler()
  registerExportSettingsHandler()
  registerImportSettingsHandler()

  // Window control
  registerWindowControlHandlers()
}

// ============================================================================
// App Lifecycle
// ============================================================================

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  // If a second instance is launched, focus the existing window
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // App is ready
  app.whenReady().then(() => {
    console.log('[ScreenForge] Application starting...')

    // Create the main window
    createMainWindow()

    // Create system tray
    createTray()

    // Register all IPC handlers
    registerAllHandlers()

    console.log('[ScreenForge] Application ready')
  })

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    } else {
      mainWindow?.show()
    }
  })

  // Handle app quit
  app.on('before-quit', () => {
    isQuitting = true

    // Cleanup resources
    try {
      const recorder = getScreenRecorder()
      recorder.destroy()
    } catch {
      // Ignore cleanup errors during quit
    }

    // Clean up temp recording files
    if (lastRecordingBlobPath) {
      try {
        const fs = require('fs')
        if (fs.existsSync(lastRecordingBlobPath)) {
          fs.unlinkSync(lastRecordingBlobPath)
        }
      } catch {
        // Ignore temp file cleanup errors
      }
    }
  })

  // All windows closed
  app.on('window-all-closed', () => {
    // On macOS, keep the app running (tray)
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
