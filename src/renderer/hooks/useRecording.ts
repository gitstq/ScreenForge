/**
 * ScreenForge - 录制 Hook
 * 管理录制状态、计时器，调用 Electron API 进行录制控制
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import type { RecordingStatus } from '../context/AppContext'

/** 录制 Hook 返回值 */
interface UseRecordingReturn {
  /** 当前录制状态 */
  status: RecordingStatus
  /** 录制时长（秒） */
  duration: number
  /** 格式化后的录制时长 */
  formattedDuration: string
  /** 是否正在录制 */
  isRecording: boolean
  /** 是否暂停 */
  isPaused: boolean
  /** 是否空闲 */
  isIdle: boolean
  /** 错误信息 */
  error: string | null
  /** 开始录制 */
  start: () => void
  /** 停止录制 */
  stop: () => void
  /** 暂停录制 */
  pause: () => void
  /** 继续录制 */
  resume: () => void
  /** 切换录制状态（开始/停止） */
  toggle: () => void
  /** 切换暂停状态（暂停/继续） */
  togglePause: () => void
}

/**
 * 录制管理 Hook
 * 提供录制状态管理和计时功能
 */
export function useRecording(): UseRecordingReturn {
  const { state, dispatch, startRecording, stopRecording, pauseRecording, resumeRecording } =
    useAppContext()
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)

  const { recordingStatus, recordingDuration } = state

  /** 格式化录制时长 */
  const formattedDuration = formatDuration(recordingDuration)

  const isRecording = recordingStatus === 'recording'
  const isPaused = recordingStatus === 'paused'
  const isIdle = recordingStatus === 'idle'

  /** 启动计时器 */
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000
      dispatch({ type: 'SET_RECORDING_DURATION', payload: elapsed })
    }, 100)
  }, [dispatch])

  /** 停止计时器 */
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    accumulatedRef.current = 0
  }, [])

  /** 暂停计时器 */
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000
    }
  }, [])

  /** 调用 Electron API 开始录制 */
  const start = useCallback(async () => {
    try {
      setError(null)

      // 调用 Electron 主进程 API（如果可用）
      if (window.electronAPI?.startRecording) {
        await window.electronAPI.startRecording({
          mode: state.recordingMode,
          sourceId: state.selectedSource?.id,
          microphoneEnabled: state.microphoneEnabled,
          systemAudioEnabled: state.systemAudioEnabled,
          cameraEnabled: state.cameraEnabled,
          aiZoomEnabled: state.aiZoomEnabled,
          fps: state.settings.recordingFps,
          quality: state.settings.recordingQuality,
        })
      }

      accumulatedRef.current = 0
      startRecording()
      startTimer()
    } catch (err) {
      const message = err instanceof Error ? err.message : '录制启动失败'
      setError(message)
      console.error('录制启动失败:', err)
    }
  }, [
    state.recordingMode,
    state.selectedSource,
    state.microphoneEnabled,
    state.systemAudioEnabled,
    state.cameraEnabled,
    state.aiZoomEnabled,
    state.settings.recordingFps,
    state.settings.recordingQuality,
    startRecording,
    startTimer,
  ])

  /** 调用 Electron API 停止录制 */
  const stop = useCallback(async () => {
    try {
      setError(null)

      if (window.electronAPI?.stopRecording) {
        const result = await window.electronAPI.stopRecording()
        if (result?.filePath) {
          dispatch({ type: 'SET_CURRENT_RECORDING', payload: result.filePath })
        }
      }

      stopTimer()
      stopRecording()
    } catch (err) {
      const message = err instanceof Error ? err.message : '录制停止失败'
      setError(message)
      console.error('录制停止失败:', err)
    }
  }, [dispatch, stopTimer, stopRecording])

  /** 调用 Electron API 暂停录制 */
  const pause = useCallback(async () => {
    try {
      setError(null)

      if (window.electronAPI?.pauseRecording) {
        await window.electronAPI.pauseRecording()
      }

      pauseTimer()
      pauseRecording()
    } catch (err) {
      const message = err instanceof Error ? err.message : '暂停失败'
      setError(message)
      console.error('暂停失败:', err)
    }
  }, [pauseTimer, pauseRecording])

  /** 调用 Electron API 继续录制 */
  const resume = useCallback(async () => {
    try {
      setError(null)

      if (window.electronAPI?.resumeRecording) {
        await window.electronAPI.resumeRecording()
      }

      resumeRecording()
      startTimer()
    } catch (err) {
      const message = err instanceof Error ? err.message : '继续录制失败'
      setError(message)
      console.error('继续录制失败:', err)
    }
  }, [resumeRecording, startTimer])

  /** 切换录制状态 */
  const toggle = useCallback(() => {
    if (isRecording || isPaused) {
      stop()
    } else {
      start()
    }
  }, [isRecording, isPaused, start, stop])

  /** 切换暂停状态 */
  const togglePause = useCallback(() => {
    if (isRecording) {
      pause()
    } else if (isPaused) {
      resume()
    }
  }, [isRecording, isPaused, pause, resume])

  /** 组件卸载时清理计时器 */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return {
    status: recordingStatus,
    duration: recordingDuration,
    formattedDuration,
    isRecording,
    isPaused,
    isIdle,
    error,
    start,
    stop,
    pause,
    resume,
    toggle,
    togglePause,
  }
}

/**
 * 格式化录制时长
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/* ========================================
 * Electron API 类型声明（全局）
 * ======================================== */

declare global {
  interface Window {
    electronAPI?: {
      startRecording: (options: Record<string, unknown>) => Promise<unknown>
      stopRecording: () => Promise<{ filePath?: string } | null>
      pauseRecording: () => Promise<void>
      resumeRecording: () => Promise<void>
      getSources: () => Promise<unknown[]>
      exportVideo: (options: Record<string, unknown>) => Promise<void>
      cancelExport: () => Promise<void>
      saveSettings: (settings: Record<string, unknown>) => Promise<void>
      loadSettings: () => Promise<Record<string, unknown>>
      openExternal: (url: string) => Promise<void>
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
    }
  }
}
