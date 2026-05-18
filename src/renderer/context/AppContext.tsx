/**
 * ScreenForge - 全局应用状态 Context
 * 管理视图切换、录制状态、设置等全局状态
 */

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

/* ========================================
 * 类型定义
 * ======================================== */

/** 应用视图类型 */
export type ViewType = 'home' | 'editor' | 'settings'

/** 录制状态类型 */
export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped'

/** 录制模式类型 */
export type RecordingMode = 'fullscreen' | 'window' | 'region'

/** 导出格式类型 */
export type ExportFormat = 'mp4' | 'gif' | 'webm'

/** 导出分辨率类型 */
export type ExportResolution = '1080p' | '720p' | '480p' | 'original'

/** 宽高比类型 */
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3'

/** 录制质量类型 */
export type RecordingQuality = 'high' | 'medium' | 'low'

/** AI缩放灵敏度类型 */
export type ZoomSensitivity = 'low' | 'medium' | 'high'

/** 屏幕源信息 */
export interface ScreenSource {
  id: string
  name: string
  thumbnailUrl?: string
  type: 'screen' | 'window'
  width: number
  height: number
}

/** 最近录制项 */
export interface RecentRecording {
  id: string
  fileName: string
  filePath: string
  duration: number
  fileSize: number
  width: number
  height: number
  createdAt: Date
  thumbnailUrl?: string
}

/** 应用设置 */
export interface AppSettings {
  /** 录制设置 */
  recordingQuality: RecordingQuality
  recordingFps: 30 | 60
  recordingFormat: ExportFormat
  /** AI缩放设置 */
  aiZoomEnabled: boolean
  zoomSensitivity: ZoomSensitivity
  zoomSmoothness: number
  /** 导出设置 */
  outputDirectory: string
  defaultResolution: ExportResolution
  defaultAspectRatio: AspectRatio
  /** 快捷键设置 */
  shortcutStartStop: string
  shortcutPauseResume: string
  shortcutScreenshot: string
}

/** 标注类型 */
export type AnnotationType = 'text' | 'arrow' | 'rectangle' | 'none'

/** 标注项 */
export interface Annotation {
  id: string
  type: AnnotationType
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  timestamp: number
}

/** 应用状态 */
export interface AppState {
  /** 当前视图 */
  currentView: ViewType
  /** 录制状态 */
  recordingStatus: RecordingStatus
  /** 录制模式 */
  recordingMode: RecordingMode
  /** 录制时长（秒） */
  recordingDuration: number
  /** 当前选中的源 */
  selectedSource: ScreenSource | null
  /** 可用源列表 */
  availableSources: ScreenSource[]
  /** 麦克风开关 */
  microphoneEnabled: boolean
  /** 系统音频开关 */
  systemAudioEnabled: boolean
  /** 摄像头开关 */
  cameraEnabled: boolean
  /** AI缩放开关 */
  aiZoomEnabled: boolean
  /** 当前录制文件路径 */
  currentRecordingPath: string | null
  /** 最近录制列表 */
  recentRecordings: RecentRecording[]
  /** 应用设置 */
  settings: AppSettings
  /** 当前编辑的录制 */
  editingRecording: RecentRecording | null
  /** 标注列表 */
  annotations: Annotation[]
  /** 当前标注工具 */
  currentAnnotationTool: AnnotationType
  /** 导出进度（0-100） */
  exportProgress: number
  /** 是否正在导出 */
  isExporting: boolean
  /** 视频播放速度 */
  playbackSpeed: number
  /** 视频分辨率 */
  videoWidth: number
  videoHeight: number
  /** 视频帧率 */
  videoFps: number
}

/* ========================================
 * 默认值
 * ======================================== */

export const DEFAULT_SETTINGS: AppSettings = {
  recordingQuality: 'high',
  recordingFps: 30,
  recordingFormat: 'mp4',
  aiZoomEnabled: true,
  zoomSensitivity: 'medium',
  zoomSmoothness: 0.5,
  outputDirectory: '',
  defaultResolution: '1080p',
  defaultAspectRatio: '16:9',
  shortcutStartStop: 'F9',
  shortcutPauseResume: 'F10',
  shortcutScreenshot: 'F11',
}

export const INITIAL_STATE: AppState = {
  currentView: 'home',
  recordingStatus: 'idle',
  recordingMode: 'fullscreen',
  recordingDuration: 0,
  selectedSource: null,
  availableSources: [],
  microphoneEnabled: false,
  systemAudioEnabled: true,
  cameraEnabled: false,
  aiZoomEnabled: true,
  currentRecordingPath: null,
  recentRecordings: [],
  settings: DEFAULT_SETTINGS,
  editingRecording: null,
  annotations: [],
  currentAnnotationTool: 'none',
  exportProgress: 0,
  isExporting: false,
  playbackSpeed: 1,
  videoWidth: 1920,
  videoHeight: 1080,
  videoFps: 30,
}

/* ========================================
 * Action 类型
 * ======================================== */

export type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_RECORDING_STATUS'; payload: RecordingStatus }
  | { type: 'SET_RECORDING_MODE'; payload: RecordingMode }
  | { type: 'SET_RECORDING_DURATION'; payload: number }
  | { type: 'SET_SELECTED_SOURCE'; payload: ScreenSource | null }
  | { type: 'SET_AVAILABLE_SOURCES'; payload: ScreenSource[] }
  | { type: 'TOGGLE_MICROPHONE' }
  | { type: 'TOGGLE_SYSTEM_AUDIO' }
  | { type: 'TOGGLE_CAMERA' }
  | { type: 'TOGGLE_AI_ZOOM' }
  | { type: 'SET_CURRENT_RECORDING'; payload: string | null }
  | { type: 'ADD_RECENT_RECORDING'; payload: RecentRecording }
  | { type: 'SET_RECENT_RECORDINGS'; payload: RecentRecording[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_EDITING_RECORDING'; payload: RecentRecording | null }
  | { type: 'ADD_ANNOTATION'; payload: Annotation }
  | { type: 'REMOVE_ANNOTATION'; payload: string }
  | { type: 'SET_ANNOTATIONS'; payload: Annotation[] }
  | { type: 'SET_CURRENT_ANNOTATION_TOOL'; payload: AnnotationType }
  | { type: 'SET_EXPORT_PROGRESS'; payload: number }
  | { type: 'SET_IS_EXPORTING'; payload: boolean }
  | { type: 'SET_PLAYBACK_SPEED'; payload: number }
  | { type: 'SET_VIDEO_INFO'; payload: { width: number; height: number; fps: number } }
  | { type: 'RESET_STATE' }

/* ========================================
 * Reducer
 * ======================================== */

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }

    case 'SET_RECORDING_STATUS':
      return { ...state, recordingStatus: action.payload }

    case 'SET_RECORDING_MODE':
      return { ...state, recordingMode: action.payload }

    case 'SET_RECORDING_DURATION':
      return { ...state, recordingDuration: action.payload }

    case 'SET_SELECTED_SOURCE':
      return { ...state, selectedSource: action.payload }

    case 'SET_AVAILABLE_SOURCES':
      return { ...state, availableSources: action.payload }

    case 'TOGGLE_MICROPHONE':
      return { ...state, microphoneEnabled: !state.microphoneEnabled }

    case 'TOGGLE_SYSTEM_AUDIO':
      return { ...state, systemAudioEnabled: !state.systemAudioEnabled }

    case 'TOGGLE_CAMERA':
      return { ...state, cameraEnabled: !state.cameraEnabled }

    case 'TOGGLE_AI_ZOOM':
      return { ...state, aiZoomEnabled: !state.aiZoomEnabled }

    case 'SET_CURRENT_RECORDING':
      return { ...state, currentRecordingPath: action.payload }

    case 'ADD_RECENT_RECORDING':
      return {
        ...state,
        recentRecordings: [action.payload, ...state.recentRecordings].slice(0, 20),
      }

    case 'SET_RECENT_RECORDINGS':
      return { ...state, recentRecordings: action.payload }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    case 'SET_EDITING_RECORDING':
      return { ...state, editingRecording: action.payload }

    case 'ADD_ANNOTATION':
      return { ...state, annotations: [...state.annotations, action.payload] }

    case 'REMOVE_ANNOTATION':
      return {
        ...state,
        annotations: state.annotations.filter((a) => a.id !== action.payload),
      }

    case 'SET_ANNOTATIONS':
      return { ...state, annotations: action.payload }

    case 'SET_CURRENT_ANNOTATION_TOOL':
      return { ...state, currentAnnotationTool: action.payload }

    case 'SET_EXPORT_PROGRESS':
      return { ...state, exportProgress: action.payload }

    case 'SET_IS_EXPORTING':
      return { ...state, isExporting: action.payload }

    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.payload }

    case 'SET_VIDEO_INFO':
      return {
        ...state,
        videoWidth: action.payload.width,
        videoHeight: action.payload.height,
        videoFps: action.payload.fps,
      }

    case 'RESET_STATE':
      return { ...INITIAL_STATE }

    default:
      return state
  }
}

/* ========================================
 * Context 定义
 * ======================================== */

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  /** 便捷方法 */
  navigateTo: (view: ViewType) => void
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

/* ========================================
 * Provider 组件
 * ======================================== */

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE)

  /** 导航到指定视图 */
  const navigateTo = useCallback(
    (view: ViewType) => {
      dispatch({ type: 'SET_VIEW', payload: view })
    },
    [dispatch]
  )

  /** 开始录制 */
  const startRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING_STATUS', payload: 'recording' })
    dispatch({ type: 'SET_RECORDING_DURATION', payload: 0 })
  }, [dispatch])

  /** 停止录制 */
  const stopRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING_STATUS', payload: 'stopped' })
  }, [dispatch])

  /** 暂停录制 */
  const pauseRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING_STATUS', payload: 'paused' })
  }, [dispatch])

  /** 继续录制 */
  const resumeRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING_STATUS', payload: 'recording' })
  }, [dispatch])

  const value: AppContextValue = {
    state,
    dispatch,
    navigateTo,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/* ========================================
 * 自定义 Hook
 * ======================================== */

/**
 * 使用全局应用状态
 * @returns AppContext 值
 * @throws 如果在 Provider 外使用则抛出错误
 */
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext 必须在 AppProvider 内部使用')
  }
  return context
}

export default AppContext
