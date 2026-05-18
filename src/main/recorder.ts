/**
 * ScreenForge - Recording Engine Module
 * Encapsulates MediaRecorder for screen, audio, and webcam capture.
 * Tracks mouse activity for AI zoom analysis.
 */

import { v4 as uuidv4 } from 'uuid'
import {
  RecordingState,
  RecordingConfig,
  VideoMetadata,
  MouseActivityPoint,
} from '../types'

// ============================================================================
// Quality Presets
// ============================================================================

/** Video bitrate presets mapped to quality levels */
const QUALITY_BITRATES: Record<string, number> = {
  low: 1500,     // 1.5 Mbps
  medium: 3000,  // 3 Mbps
  high: 5000,    // 5 Mbps
  ultra: 8000,   // 8 Mbps
}

// ============================================================================
// ScreenRecorder Class
// ============================================================================

/**
 * ScreenRecorder manages the full lifecycle of a screen recording session.
 * It captures screen video, system audio, microphone audio, and optionally
 * webcam video, combining them into a single MediaRecorder output.
 */
export class ScreenRecorder {
  // Core recording state
  private state: RecordingState = RecordingState.Idle
  private mediaRecorder: MediaRecorder | null = null
  private combinedStream: MediaStream | null = null

  // Individual streams
  private screenStream: MediaStream | null = null
  private audioStream: MediaStream | null = null
  private microphoneStream: MediaStream | null = null
  private webcamStream: MediaStream | null = null

  // Recording data
  private chunks: Blob[] = []
  private recordingStartTime: number = 0
  private recordingConfig: RecordingConfig | null = null

  // Mouse activity tracking
  private mouseActivities: MouseActivityPoint[] = []
  private mouseTrackingInterval: ReturnType<typeof setInterval> | null = null
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 }

  // Event callbacks
  private onStateChangeCallbacks: Array<(state: RecordingState) => void> = []
  private onErrorCallbacks: Array<(error: string) => void> = []

  constructor() {
    // Bind event handlers
    this.handleDataAvailable = this.handleDataAvailable.bind(this)
    this.handleRecorderStop = this.handleRecorderStop.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Get the current recording state
   */
  getState(): RecordingState {
    return this.state
  }

  /**
   * Get the current recording configuration
   */
  getConfig(): RecordingConfig | null {
    return this.recordingConfig
  }

  /**
   * Get collected mouse activity data
   */
  getMouseActivities(): MouseActivityPoint[] {
    return [...this.mouseActivities]
  }

  /**
   * Start a new recording session
   * @param config - Recording configuration
   * @throws Error if already recording or if stream acquisition fails
   */
  async start(config: RecordingConfig): Promise<void> {
    if (this.state === RecordingState.Recording) {
      throw new Error('Recording is already in progress')
    }

    try {
      this.recordingConfig = config
      this.chunks = []
      this.mouseActivities = []

      // Acquire all required streams
      this.screenStream = await this.acquireScreenStream(config)
      this.audioStream = await this.acquireAudioStream(config)
      this.microphoneStream = await this.acquireMicrophoneStream(config)
      this.webcamStream = await this.acquireWebcamStream(config)

      // Combine all streams
      this.combinedStream = this.combineStreams()

      // Determine MIME type and codec
      const mimeType = this.selectMimeType()
      const bitrate = QUALITY_BITRATES[config.quality] || QUALITY_BITRATES.high

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.combinedStream, {
        mimeType,
        videoBitsPerSecond: bitrate * 1000,
      })

      // Attach event handlers
      this.mediaRecorder.ondataavailable = this.handleDataAvailable
      this.mediaRecorder.onstop = this.handleRecorderStop
      this.mediaRecorder.onerror = this.handleError

      // Start recording with timeslice for progressive data collection
      this.mediaRecorder.start(1000) // Collect data every 1 second
      this.recordingStartTime = Date.now()

      // Start mouse tracking if AI zoom is enabled
      if (config.enableAIZoom) {
        this.startMouseTracking()
      }

      this.setState(RecordingState.Recording)
    } catch (error) {
      this.cleanupStreams()
      const message = error instanceof Error ? error.message : String(error)
      this.notifyError(message)
      throw new Error(`Failed to start recording: ${message}`)
    }
  }

  /**
   * Stop the current recording session
   * @returns A promise that resolves with the recorded Blob and metadata
   */
  async stop(): Promise<{ blob: Blob; metadata: VideoMetadata }> {
    if (this.state !== RecordingState.Recording && this.state !== RecordingState.Paused) {
      throw new Error('No active recording to stop')
    }

    this.setState(RecordingState.Stopping)

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder is not initialized'))
        return
      }

      // Store resolve/reject to be called from the onstop handler
      this.pendingStopResolve = resolve
      this.pendingStopReject = reject

      // Stop mouse tracking
      this.stopMouseTracking()

      // Request stop (this triggers ondataavailable one last time, then onstop)
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
    })
  }

  /**
   * Pause the current recording
   */
  pause(): void {
    if (this.state !== RecordingState.Recording) {
      throw new Error('Cannot pause: not currently recording')
    }

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      this.stopMouseTracking()
      this.setState(RecordingState.Paused)
    }
  }

  /**
   * Resume a paused recording
   */
  resume(): void {
    if (this.state !== RecordingState.Paused) {
      throw new Error('Cannot resume: recording is not paused')
    }

    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      if (this.recordingConfig?.enableAIZoom) {
        this.startMouseTracking()
      }
      this.setState(RecordingState.Recording)
    }
  }

  /**
   * Register a callback for state changes
   * @returns Unsubscribe function
   */
  onStateChange(callback: (state: RecordingState) => void): () => void {
    this.onStateChangeCallbacks.push(callback)
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Register a callback for errors
   * @returns Unsubscribe function
   */
  onError(callback: (error: string) => void): () => void {
    this.onErrorCallbacks.push(callback)
    return () => {
      this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Completely destroy the recorder and release all resources
   */
  destroy(): void {
    this.stopMouseTracking()

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch {
        // Ignore errors during cleanup
      }
    }

    this.cleanupStreams()
    this.mediaRecorder = null
    this.combinedStream = null
    this.chunks = []
    this.mouseActivities = []
    this.onStateChangeCallbacks = []
    this.onErrorCallbacks = []
    this.setState(RecordingState.Idle)
  }

  // ============================================================================
  // Stream Acquisition
  // ============================================================================

  /**
   * Acquire the screen/video stream using desktopCapturer or getDisplayMedia
   */
  private async acquireScreenStream(config: RecordingConfig): Promise<MediaStream> {
    try {
      // Use the Electron desktopCapturer API if available
      const { desktopCapturer } = require('electron')

      const sourceId = config.source.id
      const sources = await desktopCapturer.getSources({
        types: config.source.type === 'window' ? ['window'] : ['screen'],
      })

      const source = sources.find((s: any) => s.id === sourceId)
      if (!source) {
        throw new Error(`Recording source "${config.source.name}" not found`)
      }

      // Use navigator.mediaDevices.getDisplayMedia with the specific source
      // In Electron, we need to use the source ID directly
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            minWidth: config.area?.width || config.source.displaySize?.width || 1920,
            minHeight: config.area?.height || config.source.displaySize?.height || 1080,
            maxFrameRate: config.fps,
          },
        } as any,
      })

      return stream
    } catch {
      // Fallback: try standard getDisplayMedia (non-Electron environments)
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: config.fps,
            width: config.area?.width || undefined,
            height: config.area?.height || undefined,
          },
          audio: config.captureSystemAudio,
        })
        return stream
      } catch (error) {
        throw new Error(`Failed to acquire screen stream: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  /**
   * Acquire system audio stream (if supported)
   */
  private async acquireAudioStream(_config: RecordingConfig): Promise<MediaStream | null> {
    // System audio is typically captured alongside the screen stream
    // via getDisplayMedia. If the screen stream already has audio tracks,
    // we don't need a separate audio stream.
    if (this.screenStream) {
      const audioTracks = this.screenStream.getAudioTracks()
      if (audioTracks.length > 0) {
        return null // Audio is already in the screen stream
      }
    }
    return null
  }

  /**
   * Acquire microphone audio stream
   */
  private async acquireMicrophoneStream(config: RecordingConfig): Promise<MediaStream | null> {
    if (!config.captureMicrophone) return null

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: config.microphoneDeviceId
            ? { exact: config.microphoneDeviceId }
            : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      return stream
    } catch (error) {
      console.warn('[ScreenRecorder] Failed to acquire microphone:', error)
      return null
    }
  }

  /**
   * Acquire webcam video stream
   */
  private async acquireWebcamStream(config: RecordingConfig): Promise<MediaStream | null> {
    if (!config.captureWebcam) return null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: config.fps },
        },
        audio: false,
      })
      return stream
    } catch (error) {
      console.warn('[ScreenRecorder] Failed to acquire webcam:', error)
      return null
    }
  }

  // ============================================================================
  // Stream Combining
  // ============================================================================

  /**
   * Combine all individual streams into a single MediaStream
   */
  private combineStreams(): MediaStream {
    const combined = new MediaStream()

    // Add video tracks from screen stream
    if (this.screenStream) {
      for (const track of this.screenStream.getVideoTracks()) {
        combined.addTrack(track)
      }
      // Add audio tracks from screen stream (system audio)
      for (const track of this.screenStream.getAudioTracks()) {
        combined.addTrack(track)
      }
    }

    // Add audio tracks from microphone
    if (this.microphoneStream) {
      for (const track of this.microphoneStream.getAudioTracks()) {
        combined.addTrack(track)
      }
    }

    // Note: Webcam tracks are tracked separately for overlay purposes.
    // They can be composited during export rather than in the raw recording.

    return combined
  }

  // ============================================================================
  // MediaRecorder Event Handlers
  // ============================================================================

  /**
   * Handle incoming recorded data chunks
   */
  private handleDataAvailable(event: BlobEvent): void {
    if (event.data && event.data.size > 0) {
      this.chunks.push(event.data)
    }
  }

  /**
   * Handle recorder stop event - assemble the final blob
   */
  private handleRecorderStop(): void {
    const mimeType = this.mediaRecorder?.mimeType || 'video/webm;codecs=vp9'
    const blob = new Blob(this.chunks, { type: mimeType })

    // Build metadata
    const videoTrack = this.screenStream?.getVideoTracks()[0]
    const settings = videoTrack?.getSettings()

    const metadata: VideoMetadata = {
      id: uuidv4(),
      startTime: new Date(this.recordingStartTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: (Date.now() - this.recordingStartTime) / 1000,
      width: settings?.width || this.recordingConfig?.source.displaySize?.width || 1920,
      height: settings?.height || this.recordingConfig?.source.displaySize?.height || 1080,
      fps: settings?.frameRate || this.recordingConfig?.fps || 30,
      mimeType,
      hasSystemAudio: !!this.screenStream?.getAudioTracks().length,
      hasMicrophone: !!this.microphoneStream?.getAudioTracks().length,
      hasWebcam: !!this.webcamStream?.getVideoTracks().length,
    }

    // Resolve the pending stop promise
    if (this.pendingStopResolve) {
      this.pendingStopResolve({ blob, metadata })
      this.pendingStopResolve = null
      this.pendingStopReject = null
    }

    // Cleanup
    this.cleanupStreams()
    this.setState(RecordingState.Idle)
  }

  /**
   * Handle recorder errors
   */
  private handleError(event: Event): void {
    const errorEvent = event as ErrorEvent
    const message = errorEvent.message || 'Unknown recording error'
    console.error('[ScreenRecorder] Error:', message)
    this.notifyError(message)

    if (this.pendingStopReject) {
      this.pendingStopReject(new Error(message))
      this.pendingStopResolve = null
      this.pendingStopReject = null
    }

    this.cleanupStreams()
    this.setState(RecordingState.Idle)
  }

  // Pending promise handlers for stop()
  private pendingStopResolve: ((result: { blob: Blob; metadata: VideoMetadata }) => void) | null = null
  private pendingStopReject: ((error: Error) => void) | null = null

  // ============================================================================
  // MIME Type Selection
  // ============================================================================

  /**
   * Select the best available MIME type for recording
   */
  private selectMimeType(): string {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
    ]

    for (const mime of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        return mime
      }
    }

    // Fallback - let the browser decide
    return ''
  }

  // ============================================================================
  // Mouse Activity Tracking
  // ============================================================================

  /**
   * Start tracking mouse position for AI zoom analysis
   */
  private startMouseTracking(): void {
    if (this.mouseTrackingInterval) return

    // Sample mouse position at regular intervals
    this.mouseTrackingInterval = setInterval(() => {
      if (this.state !== RecordingState.Recording) return

      const timestamp = Date.now() - this.recordingStartTime

      this.mouseActivities.push({
        timestamp,
        x: this.lastMousePosition.x,
        y: this.lastMousePosition.y,
        isClick: false,
      })
    }, 100) // Sample every 100ms

    // Listen for mouse move events (works in Electron renderer)
    try {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('click', this.handleMouseClick)
    } catch {
      // Document may not be available in main process context
    }
  }

  /**
   * Stop tracking mouse position
   */
  private stopMouseTracking(): void {
    if (this.mouseTrackingInterval) {
      clearInterval(this.mouseTrackingInterval)
      this.mouseTrackingInterval = null
    }

    try {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('click', this.handleMouseClick)
    } catch {
      // Document may not be available
    }
  }

  /**
   * Handle mouse move events
   */
  private handleMouseMove = (event: MouseEvent): void => {
    this.lastMousePosition = {
      x: event.screenX,
      y: event.screenY,
    }
  }

  /**
   * Handle mouse click events - marked as high-priority activity points
   */
  private handleMouseClick = (event: MouseEvent): void => {
    if (this.state !== RecordingState.Recording) return

    const timestamp = Date.now() - this.recordingStartTime

    this.mouseActivities.push({
      timestamp,
      x: event.screenX,
      y: event.screenY,
      isClick: true,
    })
  }

  // ============================================================================
  // State Management
  // ============================================================================

  /**
   * Update recording state and notify listeners
   */
  private setState(newState: RecordingState): void {
    const oldState = this.state
    this.state = newState

    if (oldState !== newState) {
      console.log(`[ScreenRecorder] State: ${oldState} -> ${newState}`)
      this.onStateChangeCallbacks.forEach(cb => {
        try {
          cb(newState)
        } catch (error) {
          console.error('[ScreenRecorder] Error in state change callback:', error)
        }
      })
    }
  }

  /**
   * Notify all error listeners
   */
  private notifyError(message: string): void {
    this.onErrorCallbacks.forEach(cb => {
      try {
        cb(message)
      } catch (error) {
        console.error('[ScreenRecorder] Error in error callback:', error)
      }
    })
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  /**
   * Stop and release all acquired streams
   */
  private cleanupStreams(): void {
    const stopStream = (stream: MediaStream | null) => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }

    stopStream(this.screenStream)
    stopStream(this.audioStream)
    stopStream(this.microphoneStream)
    stopStream(this.webcamStream)

    this.screenStream = null
    this.audioStream = null
    this.microphoneStream = null
    this.webcamStream = null
    this.combinedStream = null
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/** Global screen recorder instance */
let recorderInstance: ScreenRecorder | null = null

/**
 * Get the singleton ScreenRecorder instance
 * @returns The shared ScreenRecorder
 */
export function getScreenRecorder(): ScreenRecorder {
  if (!recorderInstance) {
    recorderInstance = new ScreenRecorder()
  }
  return recorderInstance
}
