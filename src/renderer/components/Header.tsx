/**
 * ScreenForge - 顶部导航栏组件
 * 包含 Logo、导航标签、录制状态指示器、窗口控制按钮
 */

import React from 'react'
import { useAppContext, type ViewType } from '../context/AppContext'
import { useRecording } from '../hooks/useRecording'

/** 导航标签配置 */
const NAV_ITEMS: { key: ViewType; label: string; icon: string }[] = [
  { key: 'home', label: '主页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'editor', label: '编辑器', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { key: 'settings', label: '设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const Header: React.FC = () => {
  const { state, navigateTo } = useAppContext()
  const { formattedDuration, isRecording, isPaused } = useRecording()

  /** 处理窗口最小化 */
  const handleMinimize = () => {
    window.electronAPI?.minimize()
  }

  /** 处理窗口最大化 */
  const handleMaximize = () => {
    window.electronAPI?.maximize()
  }

  /** 处理窗口关闭 */
  const handleClose = () => {
    window.electronAPI?.close()
  }

  return (
    <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 select-none">
      {/* 左侧：Logo + 导航 */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
          {/* ScreenForge Logo 图标 */}
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9.5 7.5v9l7-4.5z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-100 tracking-wide">ScreenForge</span>
        </div>

        {/* 导航标签 */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => navigateTo(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                state.currentView === item.key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 中间：录制状态指示器 */}
      <div className="flex items-center gap-3">
        {(isRecording || isPaused) && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
            {/* 录制状态指示灯 */}
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isRecording ? 'bg-red-500 animate-indicator-pulse' : 'bg-yellow-500'
              }`}
            />
            <span className="text-xs font-mono text-gray-300">
              {isPaused ? '已暂停' : '录制中'}
            </span>
            <span className="text-xs font-mono text-red-400">{formattedDuration}</span>
          </div>
        )}
      </div>

      {/* 右侧：窗口控制按钮 */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-150"
          title="最小化"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-150"
          title="最大化"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="1" />
          </svg>
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-red-600 transition-colors duration-150"
          title="关闭"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
