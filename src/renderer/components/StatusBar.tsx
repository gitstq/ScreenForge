/**
 * ScreenForge - 底部状态栏组件
 * 显示当前时间、录制时长、分辨率、帧率、文件大小等信息
 */

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useRecording } from '../hooks/useRecording'
import { getCurrentTime, formatResolution, formatFileSize, estimateFileSize } from '../utils/formatters'

const StatusBar: React.FC = () => {
  const { state } = useAppContext()
  const { formattedDuration, isRecording } = useRecording()
  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  /** 每秒更新当前时间 */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  /** 估算当前录制文件大小 */
  const estimatedSize = isRecording
    ? formatFileSize(estimateFileSize(state.recordingDuration, 8))
    : '--'

  return (
    <footer className="h-7 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-500 select-none">
      {/* 左侧信息 */}
      <div className="flex items-center gap-4">
        {/* 当前时间 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {currentTime}
        </span>

        {/* 录制时长 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
          {isRecording || state.recordingStatus === 'paused' ? formattedDuration : '00:00'}
        </span>
      </div>

      {/* 右侧信息 */}
      <div className="flex items-center gap-4">
        {/* 分辨率 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          {formatResolution(state.videoWidth, state.videoHeight)}
        </span>

        {/* 帧率 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {state.videoFps} FPS
        </span>

        {/* 文件大小估算 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          {estimatedSize}
        </span>
      </div>
    </footer>
  )
}

export default StatusBar
