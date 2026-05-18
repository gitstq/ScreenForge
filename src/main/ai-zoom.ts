/**
 * ScreenForge - AI Zoom Module
 * Analyzes mouse activity to generate intelligent zoom keyframes
 * for dynamic video output. Produces smooth zoom-in/zoom-out effects
 * that follow the user's attention during screen recordings.
 */

import type {
  MouseActivityPoint,
  ZoomKeyframe,
  HeatmapCell,
  AIZoomConfig,
  AIZoomResult,
} from '../types'

// ============================================================================
// Default Configuration
// ============================================================================

/** Default AI zoom configuration */
const DEFAULT_CONFIG: AIZoomConfig = {
  enabled: true,
  minZoomLevel: 1.0,
  maxZoomLevel: 2.5,
  defaultZoomLevel: 1.0,
  sensitivity: 0.6,
  minKeyframeInterval: 2000,
  smoothingFactor: 0.3,
  heatmapResolution: 20,
  prioritizeClicks: true,
}

// ============================================================================
// AIZoomAnalyzer Class
// ============================================================================

/**
 * AIZoomAnalyzer processes mouse activity data from a recording session
 * to generate intelligent zoom keyframes. It creates a heatmap of activity,
 * identifies areas of interest, and produces smooth zoom transitions.
 */
export class AIZoomAnalyzer {
  private config: AIZoomConfig
  private mouseActivities: MouseActivityPoint[] = []
  private videoWidth: number
  private videoHeight: number
  private totalDuration: number

  // Analysis results
  private heatmap: HeatmapCell[] = []
  private keyframes: ZoomKeyframe[] = []
  private manualKeyframes: ZoomKeyframe[] = []

  constructor(
    videoWidth: number,
    videoHeight: number,
    totalDuration: number,
    config?: Partial<AIZoomConfig>
  ) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    this.totalDuration = totalDuration
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Set the mouse activity data to analyze
   * @param activities - Array of mouse activity points from the recording
   */
  setMouseActivities(activities: MouseActivityPoint[]): void {
    this.mouseActivities = activities
  }

  /**
   * Run the full analysis pipeline
   * @returns Complete AI zoom analysis result
   */
  analyze(): AIZoomResult {
    if (this.mouseActivities.length === 0) {
      return this.createEmptyResult()
    }

    // Step 1: Generate activity heatmap
    this.heatmap = this.generateHeatmap()

    // Step 2: Detect activity clusters and generate keyframes
    const autoKeyframes = this.generateKeyframesFromActivity()

    // Step 3: Merge with manual keyframes
    this.keyframes = this.mergeKeyframes(autoKeyframes, this.manualKeyframes)

    // Step 4: Apply smooth interpolation
    this.keyframes = this.applySmoothing(this.keyframes)

    // Step 5: Ensure we start and end at default zoom
    this.keyframes = this.addBoundaryKeyframes(this.keyframes)

    // Step 6: Sort by timestamp
    this.keyframes.sort((a, b) => a.timestamp - b.timestamp)

    return {
      keyframes: this.keyframes,
      heatmap: this.heatmap,
      totalDuration: this.totalDuration,
      videoSize: {
        width: this.videoWidth,
        height: this.videoHeight,
      },
    }
  }

  /**
   * Add a manual zoom keyframe
   * @param keyframe - The keyframe to add
   */
  addManualKeyframe(keyframe: ZoomKeyframe): void {
    const validated: ZoomKeyframe = {
      timestamp: Math.max(0, Math.min(keyframe.timestamp, this.totalDuration)),
      centerX: Math.max(0, Math.min(keyframe.centerX, this.videoWidth)),
      centerY: Math.max(0, Math.min(keyframe.centerY, this.videoHeight)),
      zoomLevel: Math.max(this.config.minZoomLevel, Math.min(keyframe.zoomLevel, this.config.maxZoomLevel)),
      easing: keyframe.easing || 'ease-in-out',
      transitionDuration: keyframe.transitionDuration || 1000,
      isManual: true,
    }

    this.manualKeyframes.push(validated)
  }

  /**
   * Remove a manual keyframe by timestamp
   * @param timestamp - The timestamp of the keyframe to remove
   */
  removeManualKeyframe(timestamp: number): void {
    this.manualKeyframes = this.manualKeyframes.filter(
      kf => Math.abs(kf.timestamp - timestamp) > 100 // 100ms tolerance
    )
  }

  /**
   * Get the current keyframes (including manual overrides)
   */
  getKeyframes(): ZoomKeyframe[] {
    return [...this.keyframes]
  }

  /**
   * Get the activity heatmap
   */
  getHeatmap(): HeatmapCell[] {
    return [...this.heatmap]
  }

  /**
   * Export the zoom configuration as JSON string
   * @returns JSON string of the complete zoom result
   */
  exportJSON(): string {
    return JSON.stringify({
      keyframes: this.keyframes,
      heatmap: this.heatmap,
      totalDuration: this.totalDuration,
      videoSize: {
        width: this.videoWidth,
        height: this.videoHeight,
      },
      config: this.config,
    }, null, 2)
  }

  /**
   * Import zoom configuration from JSON string
   * @param jsonString - JSON string containing zoom configuration
   */
  importJSON(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString)

      if (data.keyframes && Array.isArray(data.keyframes)) {
        // Separate manual from auto keyframes
        this.manualKeyframes = data.keyframes
          .filter((kf: ZoomKeyframe) => kf.isManual)
        this.keyframes = data.keyframes
      }

      if (data.config) {
        this.config = { ...DEFAULT_CONFIG, ...data.config }
      }
    } catch (error) {
      throw new Error(`Failed to import zoom config: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // ============================================================================
  // Heatmap Generation
  // ============================================================================

  /**
   * Generate an activity heatmap from mouse data
   * Divides the screen into a grid and counts activity in each cell
   */
  private generateHeatmap(): HeatmapCell[] {
    const resolution = this.config.heatmapResolution
    const cellWidth = this.videoWidth / resolution
    const cellHeight = this.videoHeight / resolution

    // Initialize grid
    const grid: number[][] = Array.from({ length: resolution }, () =>
      Array.from({ length: resolution }, () => 0)
    )

    // Accumulate activity
    for (const point of this.mouseActivities) {
      const col = Math.min(
        Math.floor(point.x / cellWidth),
        resolution - 1
      )
      const row = Math.min(
        Math.floor(point.y / cellHeight),
        resolution - 1
      )

      // Clicks get higher weight
      const weight = point.isClick && this.config.prioritizeClicks ? 5.0 : 1.0
      grid[row][col] += weight
    }

    // Normalize to 0-1 range
    let maxActivity = 0
    for (let row = 0; row < resolution; row++) {
      for (let col = 0; col < resolution; col++) {
        maxActivity = Math.max(maxActivity, grid[row][col])
      }
    }

    // Convert to HeatmapCell array
    const cells: HeatmapCell[] = []
    for (let row = 0; row < resolution; row++) {
      for (let col = 0; col < resolution; col++) {
        cells.push({
          col,
          row,
          intensity: maxActivity > 0 ? grid[row][col] / maxActivity : 0,
        })
      }
    }

    return cells
  }

  // ============================================================================
  // Keyframe Generation
  // ============================================================================

  /**
   * Generate zoom keyframes based on activity analysis
   * Identifies clusters of activity and creates zoom-in/zoom-out pairs
   */
  private generateKeyframesFromActivity(): ZoomKeyframe[] {
    const keyframes: ZoomKeyframe[] = []
    const resolution = this.config.heatmapResolution
    const cellWidth = this.videoWidth / resolution
    const cellHeight = this.videoHeight / resolution

    // Divide the recording into time windows
    const windowSize = this.config.minKeyframeInterval
    const numWindows = Math.ceil(this.totalDuration / windowSize)

    for (let w = 0; w < numWindows; w++) {
      const windowStart = w * windowSize
      const windowEnd = Math.min((w + 1) * windowSize, this.totalDuration)

      // Get mouse activities in this time window
      const windowActivities = this.mouseActivities.filter(
        p => p.timestamp >= windowStart && p.timestamp < windowEnd
      )

      if (windowActivities.length < 3) {
        // Not enough activity in this window, skip
        continue
      }

      // Calculate activity center of mass
      let weightedX = 0
      let weightedY = 0
      let totalWeight = 0

      for (const point of windowActivities) {
        const weight = point.isClick && this.config.prioritizeClicks ? 5.0 : 1.0
        weightedX += point.x * weight
        weightedY += point.y * weight
        totalWeight += weight
      }

      const centerX = weightedX / totalWeight
      const centerY = weightedY / totalWeight

      // Calculate activity concentration (how focused the activity is)
      const spread = this.calculateSpread(windowActivities, centerX, centerY)

      // Higher concentration = higher zoom level
      const normalizedSpread = Math.min(spread / (this.videoWidth * 0.3), 1.0)
      const zoomLevel = this.config.defaultZoomLevel +
        (this.config.maxZoomLevel - this.config.defaultZoomLevel) *
        (1 - normalizedSpread) *
        this.config.sensitivity

      // Only create a keyframe if zoom is significantly different from default
      if (Math.abs(zoomLevel - this.config.defaultZoomLevel) > 0.1) {
        const clampedZoom = Math.max(
          this.config.minZoomLevel,
          Math.min(zoomLevel, this.config.maxZoomLevel)
        )

        keyframes.push({
          timestamp: (windowStart + windowEnd) / 2,
          centerX,
          centerY,
          zoomLevel: Math.round(clampedZoom * 100) / 100,
          easing: 'ease-in-out',
          transitionDuration: Math.round(windowSize * 0.4),
          isManual: false,
        })
      }
    }

    return keyframes
  }

  /**
   * Calculate the spatial spread of mouse activities
   * Lower spread = more focused activity = higher zoom
   */
  private calculateSpread(
    activities: MouseActivityPoint[],
    centerX: number,
    centerY: number
  ): number {
    if (activities.length === 0) return 0

    let totalDistance = 0

    for (const point of activities) {
      const dx = point.x - centerX
      const dy = point.y - centerY
      totalDistance += Math.sqrt(dx * dx + dy * dy)
    }

    return totalDistance / activities.length
  }

  // ============================================================================
  // Keyframe Merging and Smoothing
  // ============================================================================

  /**
   * Merge auto-generated keyframes with manual overrides
   * Manual keyframes take precedence within their time window
   */
  private mergeKeyframes(
    autoKeyframes: ZoomKeyframe[],
    manualKeyframes: ZoomKeyframe[]
  ): ZoomKeyframe[] {
    const merged = [...autoKeyframes]

    for (const manual of manualKeyframes) {
      // Find and remove auto keyframes that are too close to the manual one
      const minInterval = this.config.minKeyframeInterval / 2

      const filtered = merged.filter(
        kf => Math.abs(kf.timestamp - manual.timestamp) > minInterval
      )

      filtered.push(manual)
      merged.length = 0
      merged.push(...filtered)
    }

    return merged
  }

  /**
   * Apply smoothing to keyframe sequence
   * Reduces jitter by interpolating zoom levels between keyframes
   */
  private applySmoothing(keyframes: ZoomKeyframe[]): ZoomKeyframe[] {
    if (keyframes.length <= 2) return keyframes

    const smoothed: ZoomKeyframe[] = []
    const factor = this.config.smoothingFactor

    for (let i = 0; i < keyframes.length; i++) {
      const current = keyframes[i]

      if (i === 0 || i === keyframes.length - 1) {
        // Keep first and last keyframes as-is
        smoothed.push({ ...current })
        continue
      }

      const prev = keyframes[i - 1]
      const next = keyframes[i + 1]

      // Smooth zoom level using weighted average with neighbors
      const smoothedZoom = current.zoomLevel * (1 - factor) +
        ((prev.zoomLevel + next.zoomLevel) / 2) * factor

      // Smooth center position
      const smoothedCenterX = current.centerX * (1 - factor) +
        ((prev.centerX + next.centerX) / 2) * factor

      const smoothedCenterY = current.centerY * (1 - factor) +
        ((prev.centerY + next.centerY) / 2) * factor

      smoothed.push({
        ...current,
        zoomLevel: Math.round(smoothedZoom * 100) / 100,
        centerX: Math.round(smoothedCenterX),
        centerY: Math.round(smoothedCenterY),
      })
    }

    return smoothed
  }

  /**
   * Add boundary keyframes at the start and end of the recording
   * to ensure smooth zoom-in at the beginning and zoom-out at the end
   */
  private addBoundaryKeyframes(keyframes: ZoomKeyframe[]): ZoomKeyframe[] {
    const result = [...keyframes]

    // Add start keyframe (zoomed out)
    if (result.length === 0 || result[0].timestamp > 500) {
      result.unshift({
        timestamp: 0,
        centerX: this.videoWidth / 2,
        centerY: this.videoHeight / 2,
        zoomLevel: this.config.defaultZoomLevel,
        easing: 'ease-out',
        transitionDuration: 1000,
        isManual: false,
      })
    }

    // Add end keyframe (zoomed out)
    const lastTimestamp = result[result.length - 1].timestamp
    if (lastTimestamp < this.totalDuration - 500) {
      result.push({
        timestamp: this.totalDuration,
        centerX: this.videoWidth / 2,
        centerY: this.videoHeight / 2,
        zoomLevel: this.config.defaultZoomLevel,
        easing: 'ease-in',
        transitionDuration: 1000,
        isManual: false,
      })
    }

    return result
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Create an empty result when no data is available
   */
  private createEmptyResult(): AIZoomResult {
    return {
      keyframes: [
        {
          timestamp: 0,
          centerX: this.videoWidth / 2,
          centerY: this.videoHeight / 2,
          zoomLevel: this.config.defaultZoomLevel,
          easing: 'linear',
          transitionDuration: 0,
          isManual: false,
        },
      ],
      heatmap: [],
      totalDuration: this.totalDuration,
      videoSize: {
        width: this.videoWidth,
        height: this.videoHeight,
      },
    }
  }

  /**
   * Interpolate between two keyframes at a given time
   * Used for generating smooth zoom curves
   */
  static interpolateKeyframes(
    keyframes: ZoomKeyframe[],
    timeMs: number
  ): { centerX: number; centerY: number; zoomLevel: number } {
    if (keyframes.length === 0) {
      return { centerX: 0, centerY: 0, zoomLevel: 1.0 }
    }

    // Find the two keyframes surrounding the given time
    let prevKf = keyframes[0]
    let nextKf = keyframes[keyframes.length - 1]

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (timeMs >= keyframes[i].timestamp && timeMs <= keyframes[i + 1].timestamp) {
        prevKf = keyframes[i]
        nextKf = keyframes[i + 1]
        break
      }
    }

    // If before the first keyframe or after the last
    if (timeMs <= prevKf.timestamp) {
      return {
        centerX: prevKf.centerX,
        centerY: prevKf.centerY,
        zoomLevel: prevKf.zoomLevel,
      }
    }

    if (timeMs >= nextKf.timestamp) {
      return {
        centerX: nextKf.centerX,
        centerY: nextKf.centerY,
        zoomLevel: nextKf.zoomLevel,
      }
    }

    // Calculate interpolation progress
    const segmentDuration = nextKf.timestamp - prevKf.timestamp
    const elapsed = timeMs - prevKf.timestamp
    let t = segmentDuration > 0 ? elapsed / segmentDuration : 0

    // Apply easing function
    t = AIZoomAnalyzer.applyEasing(t, nextKf.easing)

    // Interpolate values
    return {
      centerX: prevKf.centerX + (nextKf.centerX - prevKf.centerX) * t,
      centerY: prevKf.centerY + (nextKf.centerY - prevKf.centerY) * t,
      zoomLevel: prevKf.zoomLevel + (nextKf.zoomLevel - prevKf.zoomLevel) * t,
    }
  }

  /**
   * Apply an easing function to a progress value
   * @param t - Progress value (0-1)
   * @param easing - Easing function type
   * @returns Eased progress value (0-1)
   */
  private static applyEasing(t: number, easing: string): number {
    switch (easing) {
      case 'ease-in':
        return t * t

      case 'ease-out':
        return t * (2 - t)

      case 'ease-in-out':
        return t < 0.5
          ? 2 * t * t
          : -1 + (4 - 2 * t) * t

      case 'linear':
      default:
        return t
    }
  }
}

// ============================================================================
// Singleton & Factory
// ============================================================================

/** Active analyzer instances keyed by recording ID */
const analyzerInstances: Map<string, AIZoomAnalyzer> = new Map()

/**
 * Create or get an AI zoom analyzer for a specific recording
 * @param recordingId - Unique recording identifier
 * @param videoWidth - Video width in pixels
 * @param videoHeight - Video height in pixels
 * @param totalDuration - Total recording duration in ms
 * @param config - Optional AI zoom configuration overrides
 * @returns The AIZoomAnalyzer instance
 */
export function getAIZoomAnalyzer(
  recordingId: string,
  videoWidth: number,
  videoHeight: number,
  totalDuration: number,
  config?: Partial<AIZoomConfig>
): AIZoomAnalyzer {
  let analyzer = analyzerInstances.get(recordingId)

  if (!analyzer) {
    analyzer = new AIZoomAnalyzer(videoWidth, videoHeight, totalDuration, config)
    analyzerInstances.set(recordingId, analyzer)
  }

  return analyzer
}

/**
 * Remove an analyzer instance (cleanup)
 * @param recordingId - The recording ID to remove
 */
export function removeAIZoomAnalyzer(recordingId: string): void {
  analyzerInstances.delete(recordingId)
}
