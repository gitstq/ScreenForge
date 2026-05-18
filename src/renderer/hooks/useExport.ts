/**
 * ScreenForge - 导出 Hook
 * 管理视频导出状态、进度追踪和取消功能
 */

import { useState, useCallback, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import type { AppAction, ExportFormat, ExportResolution, AspectRatio } from '../context/AppContext'

/** 导出选项 */
export interface ExportOptions {
  /** 输入文件路径 */
  inputPath: string
  /** 输出文件路径 */
  outputPath: string
  /** 导出格式 */
  format: ExportFormat
  /** 导出分辨率 */
  resolution: ExportResolution
  /** 宽高比 */
  aspectRatio: AspectRatio
  /** 帧率 */
  fps: 30 | 60
  /** 裁剪起始时间（秒） */
  startTime: number
  /** 裁剪结束时间（秒） */
  endTime: number
  /** 背景类型 */
  backgroundType: 'solid' | 'gradient' | 'image' | 'blur'
  /** 背景颜色/值 */
  backgroundValue: string
}

/** 导出 Hook 返回值 */
interface UseExportReturn {
  /** 是否正在导出 */
  isExporting: boolean
  /** 导出进度（0-100） */
  progress: number
  /** 错误信息 */
  error: string | null
  /** 是否导出完成 */
  isCompleted: boolean
  /** 开始导出 */
  startExport: (options: ExportOptions) => Promise<void>
  /** 取消导出 */
  cancelExport: () => Promise<void>
  /** 重置导出状态 */
  resetExport: () => void
}

/**
 * 导出管理 Hook
 * 提供视频导出功能和进度追踪
 */
export function useExport(): UseExportReturn {
  const { dispatch } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  /** 开始导出 */
  const startExport = useCallback(
    async (options: ExportOptions) => {
      try {
        setError(null)
        setIsCompleted(false)
        dispatch({ type: 'SET_IS_EXPORTING', payload: true })
        dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 0 })

        abortControllerRef.current = new AbortController()

        // 调用 Electron 主进程 API 进行导出
        if (window.electronAPI?.exportVideo) {
          await window.electronAPI.exportVideo({
            ...options,
            onProgress: (progress: number) => {
              dispatch({ type: 'SET_EXPORT_PROGRESS', payload: Math.min(progress, 100) })
            },
            signal: abortControllerRef.current.signal,
          })
        } else {
          // 模拟导出进度（开发/演示模式）
          await simulateExport(dispatch)
        }

        dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 100 })
        setIsCompleted(true)
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // 用户取消导出
          dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 0 })
        } else {
          const message = err instanceof Error ? err.message : '导出失败'
          setError(message)
          console.error('导出失败:', err)
        }
      } finally {
        dispatch({ type: 'SET_IS_EXPORTING', payload: false })
        abortControllerRef.current = null
      }
    },
    [dispatch]
  )

  /** 取消导出 */
  const cancelExport = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    try {
      if (window.electronAPI?.cancelExport) {
        await window.electronAPI.cancelExport()
      }
    } catch (err) {
      console.error('取消导出失败:', err)
    }

    dispatch({ type: 'SET_IS_EXPORTING', payload: false })
    dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 0 })
    setError(null)
    setIsCompleted(false)
  }, [dispatch])

  /** 重置导出状态 */
  const resetExport = useCallback(() => {
    setError(null)
    setIsCompleted(false)
    dispatch({ type: 'SET_EXPORT_PROGRESS', payload: 0 })
  }, [dispatch])

  return {
    isExporting: false,
    progress: 0,
    error,
    isCompleted,
    startExport,
    cancelExport,
    resetExport,
  }
}

/**
 * 模拟导出进度（开发模式）
 * @param dispatch - 状态分发函数
 */
async function simulateExport(
  dispatch: React.Dispatch<AppAction>
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 1
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        resolve()
      }
      dispatch({ type: 'SET_EXPORT_PROGRESS', payload: Math.floor(progress) })
    }, 200)
  })
}
