/**
 * ScreenForge - Video Export Module
 * Handles video processing and export using fluent-ffmpeg.
 * Supports MP4 (H.264), GIF, WebM formats with resolution,
 * aspect ratio, frame rate, and background replacement options.
 */

import * as path from 'path'
import * as fs from 'fs'
import type {
  ExportConfig,
  ExportProgress,
  ExportFormat,
  ExportResolution,
  AspectRatio,
  BackgroundConfig,
} from '../types'

// ============================================================================
// Resolution Presets
// ============================================================================

/** Resolution dimension presets */
const RESOLUTION_MAP: Record<Exclude<ExportResolution, 'custom'>, { width: number; height: number }> = {
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
  '480p': { width: 854, height: 480 },
}

/** Aspect ratio width:height pairs */
const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '1:1': 1,
  '4:5': 4 / 5,
  '4:3': 4 / 3,
}

/** Default bitrate for each format (kbps) */
const FORMAT_DEFAULT_BITRATES: Record<ExportFormat, number> = {
  mp4: 5000,
  webm: 4000,
  gif: 500,
}

// ============================================================================
// VideoExporter Class
// ============================================================================

/**
 * VideoExporter handles video processing and export using FFmpeg.
 * It supports multiple output formats, resolution scaling, aspect ratio
 * cropping, frame rate adjustment, and background replacement.
 */
export class VideoExporter {
  /** Current FFmpeg command being executed */
  private currentCommand: any = null
  /** Whether an export has been cancelled */
  private cancelled: boolean = false
  /** Progress callback */
  private progressCallback: ((progress: ExportProgress) => void) | null = null

  /**
   * Export a video according to the given configuration
   * @param config - Export configuration
   * @param onProgress - Optional progress callback
   * @returns Promise that resolves when export is complete
   */
  async export(config: ExportConfig, onProgress?: (progress: ExportProgress) => void): Promise<void> {
    this.validateConfig(config)
    this.cancelled = false
    this.progressCallback = onProgress || null

    this.emitProgress({
      percent: 0,
      stage: 'preparing',
    })

    try {
      // Ensure output directory exists
      const outputDir = path.dirname(config.outputPath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Get FFmpeg instance
      const ffmpeg = this.getFFmpeg()

      // Build the FFmpeg command based on format
      let command = ffmpeg.input(config.sourcePath)

      // Apply background replacement if configured
      if (config.background && config.background.type !== 'none') {
        command = this.applyBackground(command, config.background, config)
      }

      // Apply AI zoom keyframes if configured
      if (config.applyAIZoom && config.aiZoomKeyframesPath) {
        command = this.applyAIZoomKeyframes(command, config)
      }

      // Apply format-specific settings
      command = this.applyFormatSettings(command, config)

      // Apply resolution and aspect ratio
      command = this.applyResolution(command, config)

      // Apply frame rate
      if (config.fps) {
        command = command.fps(config.fps)
      }

      // Apply bitrate
      const bitrate = config.bitrate || FORMAT_DEFAULT_BITRATES[config.format]
      command = command.videoBitrate(`${bitrate}k`)

      // Set output
      command = command.output(config.outputPath)

      // Run the command
      await this.runCommand(command, config)

      this.emitProgress({
        percent: 100,
        stage: 'done',
      })
    } catch (error) {
      if (this.cancelled) {
        this.emitProgress({
          percent: 0,
          stage: 'error',
          errorMessage: 'Export cancelled by user',
        })
      } else {
        const message = error instanceof Error ? error.message : String(error)
        this.emitProgress({
          percent: 0,
          stage: 'error',
          errorMessage: message,
        })
        throw new Error(`Export failed: ${message}`)
      }
    } finally {
      this.currentCommand = null
      this.progressCallback = null
    }
  }

  /**
   * Cancel the current export operation
   */
  cancel(): void {
    this.cancelled = true

    if (this.currentCommand) {
      try {
        this.currentCommand.kill('SIGKILL')
      } catch {
        // Command may have already finished
      }
    }
  }

  // ============================================================================
  // FFmpeg Command Building
  // ============================================================================

  /**
   * Get the fluent-ffmpeg instance
   */
  private getFFmpeg(): any {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpeg = require('fluent-ffmpeg')
      return ffmpeg
    } catch (error) {
      throw new Error(
        'FFmpeg is not available. Please install FFmpeg on your system and ensure it is in your PATH.'
      )
    }
  }

  /**
   * Apply format-specific encoding settings
   */
  private applyFormatSettings(command: any, config: ExportConfig): any {
    switch (config.format) {
      case 'mp4':
        // H.264 encoding with AAC audio
        command = command
          .videoCodec('libx264')
          .audioCodec('aac')
          .addOutputOptions([
            '-preset', 'medium',
            '-crf', '23',
            '-movflags', '+faststart',
            '-pix_fmt', 'yuv420p',
          ])
        break

      case 'webm':
        // VP9 encoding with Opus audio
        command = command
          .videoCodec('libvpx-vp9')
          .audioCodec('libopus')
          .addOutputOptions([
            '-b:v', '0',
            '-crf', '30',
            '-deadline', 'realtime',
            '-cpu-used', '4',
          ])
        break

      case 'gif':
        // GIF encoding with optimized palette
        command = command
          .noAudio()
          .addOutputOptions([
            '-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
          ])
        break
    }

    return command
  }

  /**
   * Apply resolution scaling and aspect ratio cropping
   */
  private applyResolution(command: any, config: ExportConfig): any {
    let targetWidth: number
    let targetHeight: number

    // Determine target dimensions
    if (config.resolution === 'custom' && config.customWidth && config.customHeight) {
      targetWidth = config.customWidth
      targetHeight = config.customHeight
    } else {
      const preset = RESOLUTION_MAP[config.resolution as Exclude<ExportResolution, 'custom'>]
      if (preset) {
        targetWidth = preset.width
        targetHeight = preset.height
      } else {
        // Default to 1080p
        targetWidth = 1920
        targetHeight = 1080
      }
    }

    // Apply aspect ratio cropping if specified
    if (config.aspectRatio) {
      const targetRatio = ASPECT_RATIO_MAP[config.aspectRatio]
      if (targetRatio) {
        const currentRatio = targetWidth / targetHeight
        let cropWidth: number
        let cropHeight: number

        if (currentRatio > targetRatio) {
          // Current is wider, crop sides
          cropHeight = targetHeight
          cropWidth = Math.round(targetHeight * targetRatio)
        } else {
          // Current is taller, crop top/bottom
          cropWidth = targetWidth
          cropHeight = Math.round(targetWidth / targetRatio)
        }

        // Ensure even dimensions (required by many codecs)
        cropWidth = this.makeEven(cropWidth)
        cropHeight = this.makeEven(cropHeight)

        // Scale first, then crop to center
        const scaleFilter = `scale=${cropWidth}:${cropHeight}:force_original_aspect_ratio=increase`
        const cropFilter = `crop=${cropWidth}:${cropHeight}`
        const padFilter = `pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2`

        command = command.addOutputOptions([
          '-vf', `${scaleFilter},${cropFilter},${padFilter}`,
        ])

        return command
      }
    }

    // Simple scale without aspect ratio change
    command = command.size(`${targetWidth}x${targetHeight}`)
    return command
  }

  /**
   * Apply background replacement
   */
  private applyBackground(command: any, background: BackgroundConfig, _config: ExportConfig): any {
    switch (background.type) {
      case 'solid':
        if (background.color) {
          command = command.addOutputOptions([
            '-vf', `colorkey=0x000000:0.01:0.0,format=yuva420p,overlay=(W-w)/2:(H-h)/2`,
          ])
          // For solid background, we use a color source as base
          // This is a simplified approach - full chroma key requires more complex filter chains
        }
        break

      case 'gradient':
        if (background.gradient) {
          // Create gradient using FFmpeg's color filter
          const { startColor, endColor, direction } = background.gradient
          command = command.addOutputOptions([
            '-vf', `scale=1920:1080,format=yuv420p`,
          ])
          // Note: Full gradient background replacement requires a two-pass approach
          // with overlay. This is a placeholder for the filter chain.
          void startColor
          void endColor
          void direction
        }
        break

      case 'image':
        if (background.imagePath && fs.existsSync(background.imagePath)) {
          command = command
            .input(background.imagePath)
            .complexFilter([
              '[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[bg]',
              '[0:v][bg]overlay=(W-w)/2:(H-h)/2',
            ])
        }
        break

      case 'blur':
        const blurIntensity = background.blurIntensity || 10
        command = command.addOutputOptions([
          '-vf', `split[original][copy];[copy]scale=iw/4:ih/4,boxblur=${blurIntensity}:${blurIntensity},scale=iw*4:ih*4[blurred];[original][blurred]overlay`,
        ])
        break
    }

    return command
  }

  /**
   * Apply AI zoom keyframes for dynamic zoom effects
   */
  private applyAIZoomKeyframes(command: any, config: ExportConfig): any {
    try {
      const keyframesPath = config.aiZoomKeyframesPath
      if (!keyframesPath || !fs.existsSync(keyframesPath)) {
        return command
      }

      const keyframesData = JSON.parse(fs.readFileSync(keyframesPath, 'utf-8'))
      const keyframes = keyframesData.keyframes || []

      if (keyframes.length === 0) {
        return command
      }

      // Build zoompan filter expression from keyframes
      // Each keyframe defines a zoom level and center point at a specific time
      const zoomExpressions: string[] = []

      for (const kf of keyframes) {
        const timeInSeconds = kf.timestamp / 1000
        const zoom = kf.zoomLevel || 1.0
        const x = kf.centerX || 0
        const y = kf.centerY || 0

        zoomExpressions.push(
          `between(t\\,${timeInSeconds}\\,${timeInSeconds + (kf.transitionDuration || 2000) / 1000})` +
          `*${zoom}+`
        )
      }

      // Build the complete zoompan filter
      // Note: This is a simplified implementation. A production-ready version
      // would need smooth interpolation between keyframes.
      if (zoomExpressions.length > 0) {
        const zoomExpr = zoomExpressions.join('').replace(/\+$/, '')
        command = command.addOutputOptions([
          '-vf', `zoompan=z='${zoomExpr}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=${config.fps || 30}`,
        ])
      }
    } catch (error) {
      console.warn('[VideoExporter] Failed to apply AI zoom keyframes:', error)
    }

    return command
  }

  // ============================================================================
  // Command Execution
  // ============================================================================

  /**
   * Run the FFmpeg command with progress tracking
   */
  private runCommand(command: any, _config: ExportConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentCommand = command

      this.emitProgress({
        percent: 0,
        stage: 'processing',
      })

      command
        .on('start', (commandLine: string) => {
          console.log('[VideoExporter] FFmpeg command:', commandLine)
          this.emitProgress({
            percent: 5,
            stage: 'processing',
          })
        })
        .on('progress', (progress: any) => {
          if (this.cancelled) return

          // Calculate progress percentage from FFmpeg progress
          const percent = progress.percent
            ? Math.min(Math.round(progress.percent), 99)
            : 0

          this.emitProgress({
            percent: Math.max(percent, 5),
            stage: 'encoding',
            currentFrame: progress.frames,
            speed: progress.currentSpeed ? parseFloat(progress.currentSpeed) : undefined,
          })
        })
        .on('end', () => {
          if (this.cancelled) {
            reject(new Error('Export cancelled'))
            return
          }

          this.emitProgress({
            percent: 100,
            stage: 'finalizing',
          })

          // Give a brief moment for the finalizing stage to be visible
          setTimeout(() => {
            resolve()
          }, 200)
        })
        .on('error', (err: Error) => {
          if (this.cancelled) {
            reject(new Error('Export cancelled'))
            return
          }

          console.error('[VideoExporter] FFmpeg error:', err.message)
          reject(err)
        })
        .run()
    })
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Emit progress to the registered callback
   */
  private emitProgress(progress: ExportProgress): void {
    if (this.progressCallback) {
      try {
        this.progressCallback(progress)
      } catch (error) {
        console.error('[VideoExporter] Error in progress callback:', error)
      }
    }
  }

  /**
   * Ensure a dimension value is even (required by many video codecs)
   */
  private makeEven(value: number): number {
    return Math.round(value / 2) * 2
  }

  /**
   * Validate export configuration
   * @throws Error if configuration is invalid
   */
  private validateConfig(config: ExportConfig): void {
    if (!config.sourcePath) {
      throw new Error('Source path is required')
    }

    if (!config.outputPath) {
      throw new Error('Output path is required')
    }

    if (!fs.existsSync(config.sourcePath)) {
      throw new Error(`Source file not found: ${config.sourcePath}`)
    }

    if (config.resolution === 'custom') {
      if (!config.customWidth || !config.customHeight) {
        throw new Error('Custom resolution requires both customWidth and customHeight')
      }
      if (config.customWidth < 64 || config.customHeight < 64) {
        throw new Error('Minimum resolution is 64x64')
      }
      if (config.customWidth > 7680 || config.customHeight > 4320) {
        throw new Error('Maximum resolution is 7680x4320 (8K)')
      }
    }

    if (config.fps !== undefined) {
      if (config.fps < 1 || config.fps > 120) {
        throw new Error('Frame rate must be between 1 and 120')
      }
    }

    if (config.bitrate !== undefined) {
      if (config.bitrate < 100 || config.bitrate > 100000) {
        throw new Error('Bitrate must be between 100 and 100000 kbps')
      }
    }

    if (config.background?.type === 'image' && config.background.imagePath) {
      if (!fs.existsSync(config.background.imagePath)) {
        throw new Error(`Background image not found: ${config.background.imagePath}`)
      }
    }
  }

  /**
   * Get the file extension for an export format
   */
  static getFormatExtension(format: ExportFormat): string {
    switch (format) {
      case 'mp4': return '.mp4'
      case 'webm': return '.webm'
      case 'gif': return '.gif'
    }
  }

  /**
   * Generate a default output filename
   */
  static generateOutputPath(
    directory: string,
    format: ExportFormat,
    prefix: string = 'screenforge-export'
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const extension = VideoExporter.getFormatExtension(format)
    return path.join(directory, `${prefix}_${timestamp}${extension}`)
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/** Global video exporter instance */
let exporterInstance: VideoExporter | null = null

/**
 * Get the singleton VideoExporter instance
 * @returns The shared VideoExporter
 */
export function getVideoExporter(): VideoExporter {
  if (!exporterInstance) {
    exporterInstance = new VideoExporter()
  }
  return exporterInstance
}
