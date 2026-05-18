/**
 * ScreenForge - 标注工具栏组件
 * 提供文字、箭头、矩形标注工具及颜色选择、撤销/重做功能
 */

import React from 'react'
import { useAppContext, type AnnotationType, type Annotation } from '../context/AppContext'

/** 标注工具配置 */
const ANNOTATION_TOOLS: { type: AnnotationType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'text',
    label: '文字',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    type: 'arrow',
    label: '箭头',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19L19 5" />
        <path d="M9 5h10v10" />
      </svg>
    ),
  },
  {
    type: 'rectangle',
    label: '矩形',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
]

/** 预设颜色 */
const PRESET_COLORS = [
  '#EF4444', // 红色
  '#F59E0B', // 黄色
  '#10B981', // 绿色
  '#3B82F6', // 蓝色
  '#8B5CF6', // 紫色
  '#FFFFFF', // 白色
]

interface AnnotationToolbarProps {
  /** 当前标注颜色 */
  color?: string
  /** 颜色变化回调 */
  onColorChange?: (color: string) => void
  /** 撤销回调 */
  onUndo?: () => void
  /** 重做回调 */
  onRedo?: () => void
  /** 清除所有标注回调 */
  onClearAll?: () => void
  /** 自定义类名 */
  className?: string
}

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  color = '#EF4444',
  onColorChange,
  onUndo,
  onRedo,
  onClearAll,
  className = '',
}) => {
  const { state, dispatch } = useAppContext()
  const { currentAnnotationTool, annotations } = state

  /** 选择标注工具 */
  const handleSelectTool = (type: AnnotationType) => {
    dispatch({
      type: 'SET_CURRENT_ANNOTATION_TOOL',
      payload: currentAnnotationTool === type ? 'none' : type,
    })
  }

  /** 清除所有标注 */
  const handleClearAll = () => {
    dispatch({ type: 'SET_ANNOTATIONS', payload: [] })
    onClearAll?.()
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 标注工具按钮 */}
      <div className="flex items-center gap-0.5 bg-gray-900 rounded-lg p-0.5">
        {ANNOTATION_TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => handleSelectTool(tool.type)}
            title={tool.label}
            className={`btn-icon p-1.5 rounded-md ${
              currentAnnotationTool === tool.type ? 'active' : ''
            }`}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-700" />

      {/* 颜色选择器 */}
      <div className="flex items-center gap-1">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange?.(c)}
            className={`w-5 h-5 rounded-full border-2 transition-transform duration-150 hover:scale-110 ${
              color === c ? 'border-white scale-110' : 'border-gray-600'
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-700" />

      {/* 撤销/重做 */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onUndo}
          disabled={annotations.length === 0}
          className="btn-icon p-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
          title="撤销"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h10a5 5 0 015 5v2" />
            <path d="M3 10l4-4M3 10l4 4" />
          </svg>
        </button>
        <button
          onClick={onRedo}
          className="btn-icon p-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
          title="重做"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10H11a5 5 0 00-5 5v2" />
            <path d="M21 10l-4-4M21 10l-4 4" />
          </svg>
        </button>
      </div>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-700" />

      {/* 清除所有 */}
      <button
        onClick={handleClearAll}
        disabled={annotations.length === 0}
        className="btn-icon p-1.5 text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
        title="清除所有标注"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        </svg>
      </button>

      {/* 标注计数 */}
      {annotations.length > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          {annotations.length} 个标注
        </span>
      )}
    </div>
  )
}

export default AnnotationToolbar
