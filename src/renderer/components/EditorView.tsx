/**
 * ScreenForge - 编辑器视图组件
 * 包含视频预览、时间线、工具栏和导出面板
 */

import React, { useState, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import Timeline from './Timeline'
import ExportPanel from './ExportPanel'
import AnnotationToolbar from './AnnotationToolbar'
import { formatTimeAuto } from '../utils/formatters'

/** 播放速度选项 */
const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

const EditorView: React.FC = () => {
  const { state, dispatch } = useAppContext()
  const { editingRecording, playbackSpeed } = state

  /** 播放状态 */
  const [isPlaying, setIsPlaying] = useState(false)
  /** 当前播放时间 */
  const [currentTime, setCurrentTime] = useState(0)
  /** 裁剪区域 */
  const [cropStart, setCropStart] = useState(0)
  const [cropEnd, setCropEnd] = useState(editingRecording?.duration || 60)
  /** 标注颜色 */
  const [annotationColor, setAnnotationColor] = useState('#EF4444')
  /** 是否显示导出面板 */
  const [showExportPanel, setShowExportPanel] = useState(false)
  /** 撤销栈 */
  const [undoStack, setUndoStack] = useState<typeof state.annotations[]>([])
  /** 重做栈 */
  const [redoStack, setRedoStack] = useState<typeof state.annotations[]>([])

  /** 视频时长（秒） */
  const videoDuration = editingRecording?.duration || 60

  /** 播放/暂停切换 */
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  /** 跳转到起始位置 */
  const handleSkipToStart = () => {
    setCurrentTime(cropStart)
  }

  /** 跳转到结束位置 */
  const handleSkipToEnd = () => {
    setCurrentTime(cropEnd)
  }

  /** 设置播放速度 */
  const handleSpeedChange = (speed: number) => {
    dispatch({ type: 'SET_PLAYBACK_SPEED', payload: speed })
  }

  /** 撤销标注 */
  const handleUndo = () => {
    if (state.annotations.length > 0) {
      const newUndoStack = [...undoStack, state.annotations]
      setUndoStack(newUndoStack)
      const newAnnotations = state.annotations.slice(0, -1)
      dispatch({ type: 'SET_ANNOTATIONS', payload: newAnnotations })
      setRedoStack([])
    }
  }

  /** 重做标注 */
  const handleRedo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1]
      setUndoStack(undoStack.slice(0, -1))
      setRedoStack([...redoStack, state.annotations])
      dispatch({ type: 'SET_ANNOTATIONS', payload: lastState })
    }
  }

  /** 没有编辑文件时的空状态 */
  if (!editingRecording) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-500 text-sm">暂无编辑文件</p>
          <p className="text-gray-600 text-xs mt-1">请在主页选择一个录制文件进行编辑</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        {/* 左侧工具 */}
        <div className="flex items-center gap-3">
          {/* 返回主页 */}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="btn-icon p-1.5"
            title="返回主页"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-700" />

          {/* 文件名 */}
          <span className="text-xs text-gray-300 truncate max-w-[200px]">
            {editingRecording.fileName}
          </span>
        </div>

        {/* 中间 - 标注工具栏 */}
        <AnnotationToolbar
          color={annotationColor}
          onColorChange={setAnnotationColor}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearAll={() => {
            setUndoStack([...undoStack, state.annotations])
            dispatch({ type: 'SET_ANNOTATIONS', payload: [] })
          }}
        />

        {/* 右侧工具 */}
        <div className="flex items-center gap-2">
          {/* 速度调节 */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 text-xs rounded-md transition-colors duration-150 ${
                  playbackSpeed === speed
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-700" />

          {/* 导出按钮 */}
          <button
            onClick={() => setShowExportPanel(!showExportPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors duration-150 ${
              showExportPanel
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            导出
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 视频预览区域 */}
        <div className="flex-1 flex flex-col">
          {/* 预览画面 */}
          <div className="flex-1 flex items-center justify-center bg-gray-950 p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              {/* 视频占位 */}
              <div className="w-full h-full flex items-center justify-center">
                {editingRecording.thumbnailUrl ? (
                  <img
                    src={editingRecording.thumbnailUrl}
                    alt={editingRecording.fileName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-700 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <p className="text-gray-600 text-xs">视频预览</p>
                  </div>
                )}
              </div>

              {/* 标注覆盖层 */}
              {state.annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute"
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    color: annotation.color,
                  }}
                >
                  {annotation.type === 'text' && (
                    <span className="text-sm font-bold bg-black/50 px-1 rounded">
                      {annotation.text || '文字标注'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 播放控制 */}
          <div className="h-12 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-4 px-4">
            {/* 跳到起始 */}
            <button onClick={handleSkipToStart} className="btn-icon p-1.5" title="跳到起始">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 19H5V5h6M19 5l-7 7 7 7" />
              </svg>
            </button>

            {/* 后退5秒 */}
            <button className="btn-icon p-1.5" title="后退5秒">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.5 8.5L7 12l5.5 3.5V8.5z" />
                <path d="M18.5 8.5L13 12l5.5 3.5V8.5z" />
              </svg>
            </button>

            {/* 播放/暂停 */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 前进5秒 */}
            <button className="btn-icon p-1.5" title="前进5秒">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5.5 8.5L11 12l-5.5 3.5V8.5z" />
                <path d="M11.5 8.5L17 12l-5.5 3.5V8.5z" />
              </svg>
            </button>

            {/* 跳到结束 */}
            <button onClick={handleSkipToEnd} className="btn-icon p-1.5" title="跳到结束">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 19h6V5h-6M5 5l7 7-7 7" />
              </svg>
            </button>

            {/* 时间显示 */}
            <span className="text-xs text-gray-400 font-mono ml-4">
              {formatTimeAuto(currentTime)} / {formatTimeAuto(videoDuration)}
            </span>
          </div>

          {/* 时间线 */}
          <div className="px-4 pb-3">
            <Timeline
              duration={videoDuration}
              currentTime={currentTime}
              cropStart={cropStart}
              cropEnd={cropEnd}
              onTimeChange={setCurrentTime}
              onCropStartChange={setCropStart}
              onCropEndChange={setCropEnd}
            />
          </div>
        </div>

        {/* 右侧导出面板 */}
        {showExportPanel && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto p-4 animate-slide-in-right">
            <ExportPanel
              inputPath={editingRecording.filePath}
              duration={videoDuration}
              cropStart={cropStart}
              cropEnd={cropEnd}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorView
