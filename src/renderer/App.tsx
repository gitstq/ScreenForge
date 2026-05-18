/**
 * ScreenForge - 主应用组件
 * 管理视图切换、全局快捷键监听，组合所有子组件
 */

import React, { useEffect, useCallback } from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import { useRecording } from './hooks/useRecording'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import HomeView from './components/HomeView'
import EditorView from './components/EditorView'
import SettingsView from './components/SettingsView'

/** 应用内容组件（需要在 AppProvider 内部） */
const AppContent: React.FC = () => {
  const { state } = useAppContext()
  const { toggle, togglePause, isRecording, isPaused } = useRecording()

  /** 全局快捷键监听 */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // F9 - 开始/停止录制
      if (e.key === 'F9') {
        e.preventDefault()
        toggle()
        return
      }

      // F10 - 暂停/继续录制
      if (e.key === 'F10') {
        e.preventDefault()
        if (isRecording || isPaused) {
          togglePause()
        }
        return
      }

      // F11 - 截图
      if (e.key === 'F11') {
        e.preventDefault()
        // TODO: 实现截图功能
        console.log('截图快捷键触发')
        return
      }

      // Escape - 返回主页
      if (e.key === 'Escape') {
        if (state.currentView !== 'home') {
          // 使用 dispatch 需要从 context 获取
        }
      }
    },
    [toggle, togglePause, isRecording, isPaused, state.currentView]
  )

  /** 注册全局快捷键 */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  /** 防止页面右键菜单 */
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  /** 根据当前视图渲染对应内容 */
  const renderView = () => {
    switch (state.currentView) {
      case 'home':
        return <HomeView />
      case 'editor':
        return <EditorView />
      case 'settings':
        return <SettingsView />
      default:
        return <HomeView />
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-950">
      {/* 顶部导航栏 */}
      <Header />

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>

      {/* 底部状态栏 */}
      <StatusBar />
    </div>
  )
}

/** 根组件 - 包裹 AppProvider */
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
