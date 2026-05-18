/**
 * ScreenForge - 主页视图组件
 * 包含录制按钮、模式选择、源选择器、音频/摄像头控制和最近录制列表
 */

import React, { useState, useEffect } from 'react'
import { useAppContext, type RecordingMode, type ScreenSource } from '../context/AppContext'
import RecordingButton from './RecordingButton'
import SourceSelector from './SourceSelector'
import { formatTimeAuto, formatFileSize, formatResolution } from '../utils/formatters'

/** 录制模式选项 */
const RECORDING_MODES: { value: RecordingMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'fullscreen',
    label: '全屏',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
      </svg>
    ),
  },
  {
    value: 'window',
    label: '窗口',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: 'region',
    label: '自定义区域',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L2 6" />
        <path d="M2 2h4v4" />
        <path d="M18 2l4 4" />
        <path d="M22 2h-4v4" />
        <path d="M6 22l-4-4" />
        <path d="M2 22h4v-4" />
        <path d="M18 22l4-4" />
        <path d="M22 22h-4v-4" />
      </svg>
    ),
  },
]

const HomeView: React.FC = () => {
  const { state, dispatch, navigateTo } = useAppContext()
  const [showSources, setShowSources] = useState(false)
  const [showQuickSettings, setShowQuickSettings] = useState(false)

  /** 加载可用源列表 */
  useEffect(() => {
    const loadSources = async () => {
      try {
        if (window.electronAPI?.getSources) {
          const sources = await window.electronAPI.getSources()
          if (Array.isArray(sources)) {
            dispatch({ type: 'SET_AVAILABLE_SOURCES', payload: sources as ScreenSource[] })
          }
        }
      } catch (err) {
        console.error('获取源列表失败:', err)
      }
    }
    loadSources()
  }, [dispatch])

  /** 处理源选择 */
  const handleSourceSelect = (source: ScreenSource) => {
    dispatch({ type: 'SET_SELECTED_SOURCE', payload: source })
    dispatch({ type: 'SET_VIDEO_INFO', payload: { width: source.width, height: source.height, fps: state.settings.recordingFps } })
  }

  /** 处理最近录制项点击 - 进入编辑器 */
  const handleRecentClick = (recording: typeof state.recentRecordings[0]) => {
    dispatch({ type: 'SET_EDITING_RECORDING', payload: recording })
    navigateTo('editor')
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 左侧面板 - 录制控制 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        {/* 录制按钮 */}
        <RecordingButton />

        {/* 录制模式选择 */}
        <div className="flex items-center gap-2">
          {RECORDING_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => dispatch({ type: 'SET_RECORDING_MODE', payload: mode.value })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                state.recordingMode === mode.value
                  ? 'bg-gray-800 text-white border border-gray-600'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        {/* 音频和摄像头控制 */}
        <div className="flex items-center gap-4">
          {/* 麦克风开关 */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MICROPHONE' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
              state.microphoneEnabled
                ? 'bg-gray-800 text-white border border-gray-600'
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
            title="麦克风"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <path d="M12 19v4M8 23h8" />
            </svg>
            麦克风
          </button>

          {/* 系统音频开关 */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SYSTEM_AUDIO' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
              state.systemAudioEnabled
                ? 'bg-gray-800 text-white border border-gray-600'
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
            title="系统音频"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
            系统音频
          </button>

          {/* 摄像头开关 */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CAMERA' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
              state.cameraEnabled
                ? 'bg-gray-800 text-white border border-gray-600'
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
            title="摄像头"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            摄像头
          </button>

          {/* AI缩放开关 */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_AI_ZOOM' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
              state.aiZoomEnabled
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
            title="AI智能缩放"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            AI缩放
          </button>
        </div>

        {/* 摄像头预览（小窗口画中画） */}
        {state.cameraEnabled && (
          <div className="w-48 h-36 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
              摄像头预览
            </div>
          </div>
        )}
      </div>

      {/* 右侧面板 - 源选择和最近录制 */}
      <div className="w-80 bg-gray-900/50 border-l border-gray-800 flex flex-col overflow-hidden">
        {/* 面板切换标签 */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setShowSources(true)}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
              showSources
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            录制源
          </button>
          <button
            onClick={() => setShowSources(false)}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
              !showSources
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            最近录制
          </button>
        </div>

        {/* 面板内容 */}
        <div className="flex-1 overflow-y-auto p-3">
          {showSources ? (
            /* 源选择器 */
            <SourceSelector onSelect={handleSourceSelect} />
          ) : (
            /* 最近录制列表 */
            <div className="flex flex-col gap-2">
              {state.recentRecordings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9.5 7.5v9l7-4.5z" />
                  </svg>
                  <p>暂无录制记录</p>
                  <p className="mt-1 text-gray-600">点击录制按钮开始</p>
                </div>
              ) : (
                state.recentRecordings.map((recording) => (
                  <button
                    key={recording.id}
                    onClick={() => handleRecentClick(recording)}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-150 text-left"
                  >
                    {/* 缩略图 */}
                    <div className="w-24 h-14 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {recording.thumbnailUrl ? (
                        <img
                          src={recording.thumbnailUrl}
                          alt={recording.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </div>

                    {/* 录制信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 truncate">
                        {recording.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatTimeAuto(recording.duration)} | {formatResolution(recording.width, recording.height)}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {formatFileSize(recording.fileSize)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeView
