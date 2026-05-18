/**
 * ScreenForge - 工具函数
 * 提供时间格式化、文件大小格式化等通用工具
 */

/**
 * 格式化时间为 mm:ss 格式
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化时间为 hh:mm:ss 格式
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTimeLong(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 根据时长自动选择合适的时间格式
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTimeAuto(seconds: number): string {
  if (seconds >= 3600) {
    return formatTimeLong(seconds)
  }
  return formatTime(seconds)
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的文件大小字符串（如 "1.5 MB"）
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * 格式化分辨率
 * @param width - 宽度
 * @param height - 高度
 * @returns 格式化后的分辨率字符串（如 "1920x1080"）
 */
export function formatResolution(width: number, height: number): string {
  return `${width}x${height}`
}

/**
 * 获取分辨率名称
 * @param width - 宽度
 * @param height - 高度
 * @returns 分辨率名称（如 "1080p"）
 */
export function getResolutionName(width: number, height: number): string {
  const resolutions: Record<string, string> = {
    '3840x2160': '4K',
    '2560x1440': '2K',
    '1920x1080': '1080p',
    '1280x720': '720p',
    '854x480': '480p',
  }
  return resolutions[`${width}x${height}`] || `${width}x${height}`
}

/**
 * 生成唯一文件名
 * @param prefix - 文件名前缀
 * @param extension - 文件扩展名（不含点号）
 * @returns 唯一文件名字符串
 */
export function generateUniqueFileName(
  prefix: string = 'ScreenForge',
  extension: string = 'mp4'
): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const random = Math.random().toString(36).substring(2, 6)
  return `${prefix}_${timestamp}_${random}.${extension}`
}

/**
 * 获取当前时间的格式化字符串
 * @returns 格式化后的当前时间（如 "14:30:25"）
 */
export function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour12: false })
}

/**
 * 获取当前日期的格式化字符串
 * @returns 格式化后的当前日期（如 "2024-01-15"）
 */
export function getCurrentDate(): string {
  const now = new Date()
  return now.toLocaleDateString('zh-CN')
}

/**
 * 估算视频文件大小
 * @param durationSeconds - 视频时长（秒）
 * @param bitrateMbps - 比特率（Mbps）
 * @returns 估算的文件大小（字节）
 */
export function estimateFileSize(durationSeconds: number, bitrateMbps: number = 8): number {
  return Math.ceil((durationSeconds * bitrateMbps * 1000000) / 8)
}

/**
 * 限制数值在指定范围内
 * @param value - 输入值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟毫秒数
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param fn - 要节流的函数
 * @param limit - 间隔毫秒数
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
