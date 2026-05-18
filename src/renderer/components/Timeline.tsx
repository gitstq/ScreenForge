/**
 * ScreenForge - 时间线组件
 * 视频时间线可视化，支持播放头拖拽、裁剪区域选择和缩放
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { formatTimeAuto, clamp } from '../utils/formatters'

interface TimelineProps {
  /** 总时长（秒） */
  duration: number
  /** 当前播放位置（秒） */
  currentTime: number
  /** 裁剪起始时间（秒） */
  cropStart: number
  /** 裁剪结束时间（秒） */
  cropEnd: number
  /** 播放位置变化回调 */
  onTimeChange: (time: number) => void
  /** 裁剪起始变化回调 */
  onCropStartChange: (time: number) => void
  /** 裁剪结束变化回调 */
  onCropEndChange: (time: number) => void
  /** 自定义类名 */
  className?: string
}

const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  cropStart,
  cropEnd,
  onTimeChange,
  onCropStartChange,
  onCropEndChange,
  className = '',
}) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false)
  const [isDraggingCropStart, setIsDraggingCropStart] = useState(false)
  const [isDraggingCropEnd, setIsDraggingCropEnd] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  /** 将像素位置转换为时间 */
  const positionToTime = useCallback(
    (clientX: number): number => {
      if (!timelineRef.current || duration <= 0) return 0
      const rect = timelineRef.current.getBoundingClientRect()
      const scrollWidth = rect.width * zoomLevel
      const scrollLeft = timelineRef.current.scrollLeft
      const x = clientX - rect.left + scrollLeft
      const ratio = clamp(x / scrollWidth, 0, 1)
      return ratio * duration
    },
    [duration, zoomLevel]
  )

  /** 处理鼠标按下 */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      const time = positionToTime(e.clientX)

      if (target.dataset.handle === 'crop-start') {
        setIsDraggingCropStart(true)
      } else if (target.dataset.handle === 'crop-end') {
        setIsDraggingCropEnd(true)
      } else {
        setIsDraggingPlayhead(true)
        onTimeChange(time)
      }
    },
    [positionToTime, onTimeChange]
  )

  /** 处理鼠标移动 */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const time = positionToTime(e.clientX)

      if (isDraggingPlayhead) {
        onTimeChange(clamp(time, 0, duration))
      } else if (isDraggingCropStart) {
        onCropStartChange(clamp(time, 0, cropEnd - 0.1))
      } else if (isDraggingCropEnd) {
        onCropEndChange(clamp(time, cropStart + 0.1, duration))
      }
    }

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false)
      setIsDraggingCropStart(false)
      setIsDraggingCropEnd(false)
    }

    if (isDraggingPlayhead || isDraggingCropStart || isDraggingCropEnd) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [
    isDraggingPlayhead,
    isDraggingCropStart,
    isDraggingCropEnd,
    positionToTime,
    onTimeChange,
    onCropStartChange,
    onCropEndChange,
    cropStart,
    cropEnd,
    duration,
  ])

  /** 生成时间刻度 */
  const generateTicks = (): { position: number; label: string }[] => {
    if (duration <= 0) return []
    const ticks: { position: number; label: string }[] = []
    // 根据缩放级别决定刻度间隔
    let interval = 1
    if (duration > 300) interval = 30
    else if (duration > 120) interval = 15
    else if (duration > 60) interval = 10
    else if (duration > 30) interval = 5

    for (let t = 0; t <= duration; t += interval) {
      ticks.push({
        position: (t / duration) * 100,
        label: formatTimeAuto(t),
      })
    }
    return ticks
  }

  const ticks = generateTicks()
  const playheadPosition = duration > 0 ? (currentTime / duration) * 100 : 0
  const cropStartPercent = duration > 0 ? (cropStart / duration) * 100 : 0
  const cropEndPercent = duration > 0 ? (cropEnd / duration) * 100 : 100

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* 时间线工具栏 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatTimeAuto(currentTime)}</span>
          <span className="text-gray-600">/</span>
          <span>{formatTimeAuto(duration)}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* 缩放控制 */}
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
            className="btn-icon p-1"
            title="缩小"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
          </button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(5, z + 0.5))}
            className="btn-icon p-1"
            title="放大"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6M11 8v6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 时间线主体 */}
      <div
        ref={timelineRef}
        className="relative h-16 bg-gray-800 rounded-lg overflow-x-auto overflow-y-hidden cursor-crosshair"
        onMouseDown={handleMouseDown}
        style={{ minWidth: `${zoomLevel * 100}%` }}
      >
        {/* 时间刻度 */}
        <div className="absolute inset-x-0 top-0 h-4 border-b border-gray-700">
          {ticks.map((tick, i) => (
            <div
              key={i}
              className="absolute top-0 h-full flex flex-col items-center"
              style={{ left: `${tick.position}%` }}
            >
              <div className="w-px h-2 bg-gray-600" />
              <span className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
                {tick.label}
              </span>
            </div>
          ))}
        </div>

        {/* 裁剪区域（暗色遮罩） */}
        <div
          className="absolute inset-y-0 left-0 bg-gray-900/60"
          style={{ width: `${cropStartPercent}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-gray-900/60"
          style={{ width: `${100 - cropEndPercent}%` }}
        />

        {/* 裁剪区域高亮 */}
        <div
          className="absolute top-4 bottom-0 bg-red-500/10 border-x border-red-500/30"
          style={{
            left: `${cropStartPercent}%`,
            width: `${cropEndPercent - cropStartPercent}%`,
          }}
        />

        {/* 裁剪起始手柄 */}
        <div
          data-handle="crop-start"
          className="crop-handle"
          style={{ left: `calc(${cropStartPercent}% - 6px)` }}
        />

        {/* 裁剪结束手柄 */}
        <div
          data-handle="crop-end"
          className="crop-handle"
          style={{ left: `calc(${cropEndPercent}% - 6px)` }}
        />

        {/* 播放头 */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
          style={{ left: `${playheadPosition}%` }}
        >
          {/* 播放头顶部三角 */}
          <div className="absolute -top-0 -left-1.5 w-3.5 h-3 bg-red-500 rounded-b-sm" />
        </div>
      </div>

      {/* 裁剪信息 */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500">
        <span>裁剪: {formatTimeAuto(cropStart)} - {formatTimeAuto(cropEnd)}</span>
        <span>时长: {formatTimeAuto(cropEnd - cropStart)}</span>
      </div>
    </div>
  )
}

export default Timeline
