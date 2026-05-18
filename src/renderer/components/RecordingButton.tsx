/**
 * ScreenForge - 录制按钮组件
 * 大圆形录制按钮，支持录制/暂停/停止状态切换
 */

import React from 'react'
import { useRecording } from '../hooks/useRecording'

interface RecordingButtonProps {
  /** 自定义类名 */
  className?: string
  /** 自定义尺寸 */
  size?: 'sm' | 'md' | 'lg'
}

/** 尺寸配置 */
const SIZE_CONFIG = {
  sm: {
    outer: 'w-14 h-14',
    inner: 'w-5 h-5',
    paused: 'w-4 h-4',
  },
  md: {
    outer: 'w-20 h-20',
    inner: 'w-8 h-8',
    paused: 'w-6 h-6',
  },
  lg: {
    outer: 'w-28 h-28',
    inner: 'w-12 h-12',
    paused: 'w-8 h-8',
  },
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ className = '', size = 'lg' }) => {
  const { status, isRecording, isPaused, formattedDuration, toggle, togglePause } = useRecording()
  const config = SIZE_CONFIG[size]

  /** 根据录制状态确定按钮行为 */
  const handleClick = () => {
    if (status === 'idle' || status === 'stopped') {
      toggle()
    } else if (isRecording) {
      togglePause()
    } else if (isPaused) {
      togglePause()
    }
  }

  /** 获取按钮标题文本 */
  const getTitle = (): string => {
    switch (status) {
      case 'idle':
      case 'stopped':
        return '开始录制'
      case 'recording':
        return '暂停录制'
      case 'paused':
        return '继续录制'
      default:
        return '开始录制'
    }
  }

  /** 是否显示脉冲动画 */
  const showPulse = isRecording

  /** 是否显示停止按钮覆盖层 */
  const showStopOverlay = isRecording || isPaused

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 主录制按钮 */}
      <button
        onClick={handleClick}
        title={getTitle()}
        className={`
          ${config.outer} rounded-full flex items-center justify-center
          transition-all duration-200 ease-in-out cursor-pointer
          ${showPulse ? 'animate-recording-pulse' : ''}
          ${status === 'idle' || status === 'stopped'
            ? 'bg-red-600 hover:bg-red-500 active:bg-red-700'
            : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600'
          }
          focus:outline-none focus:ring-4 focus:ring-red-500/30
        `}
      >
        {/* 内部图标 */}
        {isPaused ? (
          /* 暂停图标 - 两条竖线 */
          <div className="flex items-center gap-1">
            <div className={`${config.paused} bg-yellow-400 rounded-sm`} />
            <div className={`${config.paused} bg-yellow-400 rounded-sm`} />
          </div>
        ) : showStopOverlay ? (
          /* 停止图标 - 方形 */
          <div className={`${config.inner} bg-red-500 rounded-md`} />
        ) : (
          /* 录制图标 - 圆形 */
          <div className={`${config.inner} bg-white rounded-full`} />
        )}
      </button>

      {/* 状态文本 */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-1">{getTitle()}</p>
        {(isRecording || isPaused) && (
          <p className={`text-lg font-mono font-semibold ${isPaused ? 'text-yellow-400' : 'text-red-400'}`}>
            {formattedDuration}
          </p>
        )}
      </div>

      {/* 快捷键提示 */}
      <p className="text-xs text-gray-600">
        {status === 'idle' || status === 'stopped' ? (
          <>按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-xs">F9</kbd> 开始录制</>
        ) : (
          <>
            按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-xs">F9</kbd> 停止
            <span className="mx-1">|</span>
            按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-xs">F10</kbd> {isRecording ? '暂停' : '继续'}
          </>
        )}
      </p>
    </div>
  )
}

export default RecordingButton
