/**
 * ScreenForge - 源选择器组件
 * 显示可用的屏幕和窗口列表，支持搜索过滤和选中高亮
 */

import React, { useState, useMemo } from 'react'
import { useAppContext, type ScreenSource } from '../context/AppContext'

interface SourceSelectorProps {
  /** 自定义类名 */
  className?: string
  /** 选择源回调 */
  onSelect?: (source: ScreenSource) => void
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ className = '', onSelect }) => {
  const { state, dispatch } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'screen' | 'window'>('all')

  /** 过滤源列表 */
  const filteredSources = useMemo(() => {
    return state.availableSources.filter((source) => {
      const matchesType = filterType === 'all' || source.type === filterType
      const matchesSearch =
        searchQuery === '' ||
        source.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [state.availableSources, filterType, searchQuery])

  /** 处理源选择 */
  const handleSelect = (source: ScreenSource) => {
    dispatch({ type: 'SET_SELECTED_SOURCE', payload: source })
    onSelect?.(source)
  }

  /** 加载可用源列表 */
  const handleRefresh = async () => {
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

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* 搜索栏和过滤 */}
      <div className="flex items-center gap-2">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="搜索屏幕或窗口..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs"
          />
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          className="btn-icon p-1.5"
          title="刷新源列表"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* 过滤标签 */}
      <div className="flex items-center gap-1">
        {[
          { key: 'all' as const, label: '全部' },
          { key: 'screen' as const, label: '屏幕' },
          { key: 'window' as const, label: '窗口' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors duration-150 ${
              filterType === tab.key
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 源列表 */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {filteredSources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            {searchQuery ? '没有找到匹配的源' : '暂无可用的屏幕或窗口'}
          </div>
        ) : (
          filteredSources.map((source) => {
            const isSelected = state.selectedSource?.id === source.id
            return (
              <button
                key={source.id}
                onClick={() => handleSelect(source)}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 text-left ${
                  isSelected
                    ? 'bg-gray-800 border border-red-500/50'
                    : 'bg-gray-900 border border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                }`}
              >
                {/* 缩略图 */}
                <div
                  className={`w-20 h-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center ${
                    isSelected ? 'ring-1 ring-red-500' : ''
                  }`}
                >
                  {source.thumbnailUrl ? (
                    <img
                      src={source.thumbnailUrl}
                      alt={source.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  )}
                </div>

                {/* 源信息 */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {source.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {source.type === 'screen' ? '屏幕' : '窗口'} - {source.width}x{source.height}
                  </p>
                </div>

                {/* 选中指示器 */}
                {isSelected && (
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SourceSelector
