/**
 * ScreenForge - 导出面板组件
 * 提供视频导出设置和进度显示
 */

import React, { useState } from 'react'
import { useExport, type ExportOptions } from '../hooks/useExport'
import type { ExportFormat, ExportResolution, AspectRatio } from '../context/AppContext'

interface ExportPanelProps {
  /** 输入文件路径 */
  inputPath: string
  /** 视频时长（秒） */
  duration: number
  /** 裁剪起始时间 */
  cropStart: number
  /** 裁剪结束时间 */
  cropEnd: number
  /** 自定义类名 */
  className?: string
}

/** 导出格式选项 */
const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'mp4', label: 'MP4' },
  { value: 'gif', label: 'GIF' },
  { value: 'webm', label: 'WebM' },
]

/** 分辨率选项 */
const RESOLUTION_OPTIONS: { value: ExportResolution; label: string }[] = [
  { value: 'original', label: '原始' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
]

/** 宽高比选项 */
const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:5', label: '4:5' },
  { value: '4:3', label: '4:3' },
]

/** 帧率选项 */
const FPS_OPTIONS: { value: 30 | 60; label: string }[] = [
  { value: 30, label: '30 FPS' },
  { value: 60, label: '60 FPS' },
]

const ExportPanel: React.FC<ExportPanelProps> = ({
  inputPath,
  duration,
  cropStart,
  cropEnd,
  className = '',
}) => {
  const { isExporting, progress, error, isCompleted, startExport, cancelExport, resetExport } =
    useExport()

  const [format, setFormat] = useState<ExportFormat>('mp4')
  const [resolution, setResolution] = useState<ExportResolution>('1080p')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [fps, setFps] = useState<30 | 60>(30)
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient' | 'image' | 'blur'>('blur')
  const [backgroundValue, setBackgroundValue] = useState('#000000')

  /** 处理导出 */
  const handleExport = async () => {
    const options: ExportOptions = {
      inputPath,
      outputPath: '',
      format,
      resolution,
      aspectRatio,
      fps,
      startTime: cropStart,
      endTime: cropEnd,
      backgroundType,
      backgroundValue,
    }
    await startExport(options)
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* 标题 */}
      <h3 className="text-sm font-semibold text-gray-200">导出设置</h3>

      {/* 格式选择 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">格式</label>
        <div className="flex gap-1">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                format === opt.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 分辨率选择 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">分辨率</label>
        <div className="grid grid-cols-2 gap-1">
          {RESOLUTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setResolution(opt.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                resolution === opt.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 宽高比选择 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">宽高比</label>
        <div className="flex gap-1">
          {ASPECT_RATIO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAspectRatio(opt.value)}
              className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                aspectRatio === opt.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 帧率选择 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">帧率</label>
        <div className="flex gap-1">
          {FPS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFps(opt.value)}
              className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                fps === opt.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 背景设置 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">背景</label>
        <div className="flex gap-1">
          {[
            { value: 'blur' as const, label: '模糊' },
            { value: 'solid' as const, label: '纯色' },
            { value: 'gradient' as const, label: '渐变' },
            { value: 'image' as const, label: '图片' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBackgroundType(opt.value)}
              className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                backgroundType === opt.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 导出进度 */}
      {(isExporting || isCompleted) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {isCompleted ? '导出完成' : '正在导出...'}
            </span>
            <span className="text-gray-300 font-mono">{Math.round(progress)}%</span>
          </div>
          {/* 进度条 */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                isCompleted ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {isExporting ? (
          <button onClick={cancelExport} className="btn-secondary flex-1 text-xs">
            取消导出
          </button>
        ) : isCompleted ? (
          <button onClick={resetExport} className="btn-primary flex-1 text-xs">
            重新导出
          </button>
        ) : (
          <button
            onClick={handleExport}
            disabled={!inputPath}
            className="btn-primary flex-1 text-xs"
          >
            导出视频
          </button>
        )}
      </div>
    </div>
  )
}

export default ExportPanel
