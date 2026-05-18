/**
 * ScreenForge - 设置视图组件
 * 提供录制、AI缩放、导出、快捷键等设置选项
 */

import React from 'react'
import { useSettings } from '../hooks/useSettings'
import type {
  RecordingQuality,
  ExportFormat,
  ExportResolution,
  AspectRatio,
  ZoomSensitivity,
} from '../context/AppContext'

/** Toggle 开关组件 */
const Toggle: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm text-gray-200">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'active' : ''}`}
    >
      <span className="toggle-dot" />
    </button>
  </div>
)

/** 选择器组件 */
const SelectOption: React.FC<{
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-gray-400">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

/** 滑块组件 */
const SliderOption: React.FC<{
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  displayValue?: string
}> = ({ label, value, min, max, step, onChange, displayValue }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs text-gray-400">{label}</label>
      <span className="text-xs text-gray-300 font-mono">{displayValue || value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
        [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-red-500
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:hover:bg-red-400"
    />
  </div>
)

/** 设置分组标题 */
const SectionTitle: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mt-6 mb-3 first:mt-0">
    {icon && <span className="text-gray-500">{icon}</span>}
    <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
    <div className="flex-1 h-px bg-gray-800" />
  </div>
)

const SettingsView: React.FC = () => {
  const { settings, isLoading, isSaving, updateSettings, resetToDefault, saveSettings } =
    useSettings()

  /** 处理重置设置 */
  const handleReset = () => {
    if (window.confirm('确定要重置所有设置为默认值吗？')) {
      resetToDefault()
    }
  }

  /** 打开外部链接 */
  const openExternal = (url: string) => {
    window.electronAPI?.openExternal(url)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 text-sm">加载设置中...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-100">设置</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              恢复默认
            </button>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="btn-primary text-xs px-3 py-1.5"
            >
              {isSaving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        {/* ========================================
         * 录制设置
         * ======================================== */}
        <SectionTitle
          title="录制设置"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectOption
            label="默认录制质量"
            value={settings.recordingQuality}
            options={[
              { value: 'high', label: '高质量' },
              { value: 'medium', label: '中等质量' },
              { value: 'low', label: '低质量' },
            ]}
            onChange={(v) => updateSettings({ recordingQuality: v as RecordingQuality })}
          />

          <SelectOption
            label="默认帧率"
            value={String(settings.recordingFps)}
            options={[
              { value: '30', label: '30 FPS' },
              { value: '60', label: '60 FPS' },
            ]}
            onChange={(v) => updateSettings({ recordingFps: Number(v) as 30 | 60 })}
          />

          <SelectOption
            label="默认格式"
            value={settings.recordingFormat}
            options={[
              { value: 'mp4', label: 'MP4' },
              { value: 'gif', label: 'GIF' },
              { value: 'webm', label: 'WebM' },
            ]}
            onChange={(v) => updateSettings({ recordingFormat: v as ExportFormat })}
          />
        </div>

        {/* ========================================
         * AI缩放设置
         * ======================================== */}
        <SectionTitle
          title="AI智能缩放"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          }
        />

        <Toggle
          checked={settings.aiZoomEnabled}
          onChange={(v) => updateSettings({ aiZoomEnabled: v })}
          label="启用AI智能缩放"
          description="录制时自动跟踪鼠标位置进行缩放"
        />

        {settings.aiZoomEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <SelectOption
              label="缩放灵敏度"
              value={settings.zoomSensitivity}
              options={[
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' },
              ]}
              onChange={(v) => updateSettings({ zoomSensitivity: v as ZoomSensitivity })}
            />

            <SliderOption
              label="缩放平滑度"
              value={settings.zoomSmoothness}
              min={0}
              max={1}
              step={0.1}
              onChange={(v) => updateSettings({ zoomSmoothness: v })}
              displayValue={(settings.zoomSmoothness * 100).toFixed(0) + '%'}
            />
          </div>
        )}

        {/* ========================================
         * 导出设置
         * ======================================== */}
        <SectionTitle
          title="导出设置"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectOption
            label="默认分辨率"
            value={settings.defaultResolution}
            options={[
              { value: 'original', label: '原始' },
              { value: '1080p', label: '1080p' },
              { value: '720p', label: '720p' },
              { value: '480p', label: '480p' },
            ]}
            onChange={(v) => updateSettings({ defaultResolution: v as ExportResolution })}
          />

          <SelectOption
            label="默认宽高比"
            value={settings.defaultAspectRatio}
            options={[
              { value: '16:9', label: '16:9' },
              { value: '9:16', label: '9:16' },
              { value: '1:1', label: '1:1' },
              { value: '4:5', label: '4:5' },
              { value: '4:3', label: '4:3' },
            ]}
            onChange={(v) => updateSettings({ defaultAspectRatio: v as AspectRatio })}
          />
        </div>

        {/* 输出目录 */}
        <div className="flex flex-col gap-1.5 mt-4">
          <label className="text-xs text-gray-400">默认输出目录</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.outputDirectory || '默认（桌面）'}
              readOnly
              className="flex-1 text-xs cursor-default"
            />
            <button className="btn-secondary text-xs px-3 py-2">
              浏览
            </button>
          </div>
        </div>

        {/* ========================================
         * 快捷键设置
         * ======================================== */}
        <SectionTitle
          title="快捷键"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8" />
            </svg>
          }
        />

        <div className="flex flex-col gap-3">
          {/* 开始/停止录制 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-200">开始/停止录制</span>
            <kbd className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-300 font-mono">
              {settings.shortcutStartStop}
            </kbd>
          </div>

          {/* 暂停/继续 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-200">暂停/继续录制</span>
            <kbd className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-300 font-mono">
              {settings.shortcutPauseResume}
            </kbd>
          </div>

          {/* 截图 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-200">截图</span>
            <kbd className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-xs text-gray-300 font-mono">
              {settings.shortcutScreenshot}
            </kbd>
          </div>
        </div>

        {/* ========================================
         * 关于信息
         * ======================================== */}
        <SectionTitle
          title="关于"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          }
        />

        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">版本</span>
            <span className="text-sm text-gray-400">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">开源协议</span>
            <span className="text-sm text-gray-400">MIT License</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">GitHub</span>
            <button
              onClick={() => openExternal('https://github.com/screenforge/screenforge')}
              className="text-sm text-red-400 hover:text-red-300 transition-colors duration-150"
            >
              screenforge/screenforge
            </button>
          </div>
        </div>

        {/* 底部留白 */}
        <div className="h-8" />
      </div>
    </div>
  )
}

export default SettingsView
