/**
 * ScreenForge - 设置 Hook
 * 管理应用设置的加载、保存和变更通知
 */

import { useState, useEffect, useCallback } from 'react'
import { useAppContext, DEFAULT_SETTINGS } from '../context/AppContext'
import type { AppSettings } from '../context/AppContext'

/** 设置 Hook 返回值 */
interface UseSettingsReturn {
  /** 当前设置 */
  settings: AppSettings
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否正在保存 */
  isSaving: boolean
  /** 错误信息 */
  error: string | null
  /** 更新设置（部分更新） */
  updateSettings: (updates: Partial<AppSettings>) => void
  /** 重置为默认设置 */
  resetToDefault: () => void
  /** 保存设置到持久化存储 */
  saveSettings: () => Promise<void>
  /** 重新加载设置 */
  reloadSettings: () => Promise<void>
}

/** 设置存储键名 */
const SETTINGS_STORAGE_KEY = 'screenforge-settings'

/**
 * 设置管理 Hook
 * 提供设置的加载、保存和更新功能
 */
export function useSettings(): UseSettingsReturn {
  const { state, dispatch } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const settings = state.settings

  /** 从持久化存储加载设置 */
  const loadSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 优先尝试 Electron API
      if (window.electronAPI?.loadSettings) {
        const loaded = await window.electronAPI.loadSettings()
        if (loaded && typeof loaded === 'object') {
          dispatch({ type: 'UPDATE_SETTINGS', payload: loaded as Partial<AppSettings> })
          return
        }
      }

      // 回退到 localStorage
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载设置失败'
      setError(message)
      console.error('加载设置失败:', err)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  /** 保存设置到持久化存储 */
  const saveSettings = useCallback(async () => {
    setIsSaving(true)
    setError(null)

    try {
      // 优先尝试 Electron API
      if (window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings(settings as any)
      }

      // 同时保存到 localStorage 作为备份
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存设置失败'
      setError(message)
      console.error('保存设置失败:', err)
    } finally {
      setIsSaving(false)
    }
  }, [settings])

  /** 更新设置（部分更新） */
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: updates })
    },
    [dispatch]
  )

  /** 重置为默认设置 */
  const resetToDefault = useCallback(() => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: DEFAULT_SETTINGS })
  }, [dispatch])

  /** 初始化时加载设置 */
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSettings,
    resetToDefault,
    saveSettings,
    reloadSettings: loadSettings,
  }
}
