<p align="center">
  <a href="#zh-cn">简体中文</a> &nbsp;|&nbsp;
  <a href="#zh-tw">繁體中文</a> &nbsp;|&nbsp;
  <a href="#en">English</a>
</p>

---

<a id="zh-cn"></a>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<h1 align="center">🎬 ScreenForge</h1>

<p align="center">
  <strong>轻量级智能录屏演示引擎</strong><br>
  一款免费开源的 Screen Studio 替代品，让每一帧画面都精彩纷呈 ✨
</p>

---

## 🎉 项目介绍

**ScreenForge** 是一款基于 **Electron + React + TypeScript** 构建的轻量级智能录屏演示引擎。它不仅仅是一个录屏工具，更是一个专注于**内容创作与演示表达**的智能引擎。

### 💎 核心价值

在当今的内容创作时代，一款优秀的录屏工具是每个开发者和创作者的刚需。然而，市面上主流的录屏演示软件要么**价格昂贵**（如 Screen Studio 售价 $89），要么**功能臃肿**、**导出格式受限**，让许多个人开发者和小团队望而却步。

ScreenForge 诞生于这样一个简单的信念：**每个人都应该拥有一个免费、强大、优雅的录屏演示工具**。

### 🔥 解决的用户痛点

| 痛点 | ScreenForge 的解决方案 |
|------|------------------------|
| 💰 付费录屏软件昂贵 | 完全免费开源，MIT 协议 |
| 🐌 功能臃肿、启动缓慢 | 轻量级架构，秒级启动 |
| 📐 导出格式受限 | 支持 MP4/GIF/WebM 多格式 |
| 🎯 缺乏智能聚焦 | AI 智能缩放，自动跟踪鼠标 |
| 🎨 画面单调乏味 | 背景替换 + 标注 + 模板系统 |

### ⭐ 自研差异化亮点

- 🧠 **AI 智能缩放** — 基于鼠标热力图分析，自动聚焦活动区域，让你的演示视频更具专业感
- ⚡ **零依赖核心引擎** — 录制核心不依赖任何第三方服务，离线也能完美运行
- 🖥️ **跨平台支持** — 一套代码，Windows / macOS / Linux 全平台覆盖
- 📋 **模板预设系统** — 一键应用精心设计的模板，快速产出专业级演示视频

### 💡 灵感来源

灵感来源于 [Screen Studio](https://www.screenstudio.com/) 和 [OBS Studio](https://obsproject.com/)，我们希望将 Screen Studio 的**精美演示效果**与 OBS Studio 的**开源自由精神**融为一体，打造一款人人都能用得上的智能录屏工具。

---

## ✨ 核心特性

### 🎬 智能录制引擎
支持 **全屏录制**、**窗口录制** 和 **自定义区域录制** 三种模式，灵活适配各种使用场景。无论是全屏演示还是局部操作展示，都能精准捕捉每一帧画面。

### 🎙️ 多源音频采集
同时支持 **麦克风输入** 和 **系统音频录制**，可独立调节音量。录制教程时，你的讲解和系统声音都能完美收录。

### 📷 摄像头画中画
支持 **摄像头画面叠加**，可自由调整位置和大小。在演示的同时展示真人讲解，让你的视频更具亲和力和专业度。

### 🤖 AI 智能缩放
基于 **鼠标热力图分析算法**，自动识别并聚焦鼠标活动区域，智能调整画面缩放比例。无需手动编辑，即可产出具有电影级运镜效果的演示视频。

### 🎨 背景替换
支持多种背景模式：**纯色填充**、**渐变色**、**自定义图片** 和 **背景模糊**。轻松打造干净专业的演示画面，告别杂乱桌面。

### ✂️ 时间线编辑
内置直观的时间线编辑器，支持 **片段裁剪** 和 **播放速度调节**（0.5x ~ 2x）。精准控制视频节奏，去除冗余内容。

### 📝 标注工具
提供 **文字标注**、**箭头指示** 和 **矩形框选** 三种标注工具，配备 **6 色预设**（红/橙/黄/绿/蓝/紫），让你的演示重点一目了然。

### 📤 多格式导出
支持导出为 **MP4 (H.264)**、**GIF** 和 **WebM (VP9)** 三种格式，满足不同平台的分享需求。社交媒体、技术文档、产品演示，一键搞定。

### 🖥️ 多分辨率与宽高比
支持 **1080p / 720p / 480p** 多种分辨率，以及 **16:9 / 9:16 / 1:1 / 4:5 / 4:3** 多种宽高比预设。无论是横屏演示还是竖屏短视频，都能完美适配。

### 🌙 深色主题
精心打造的 **深色主题 UI**，长时间使用不疲劳，专业感十足。整体界面基于 Tailwind CSS 构建，简洁优雅。

### ⌨️ 快捷键支持
全局快捷键让录制操作行云流水：
- `F9` — 开始 / 停止录制
- `F10` — 暂停 / 继续录制
- `F11` — 截取当前画面

### 🔧 模板预设系统
内置多套精心设计的模板预设，涵盖 **产品演示**、**教程录制**、**Bug 复现** 等常见场景。一键应用，快速开始专业级录制。

---

## 🚀 快速开始

### 📋 环境要求

| 依赖 | 最低版本 | 推荐版本 |
|------|---------|---------|
| 🟢 Node.js | >= 18.0.0 | 20.x LTS |
| 📦 npm | >= 9.0.0 | 10.x |
| 🎬 FFmpeg | >= 5.0 | 6.x（导出功能需要） |

### 🛠️ 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/gitstq/ScreenForge.git

# 2. 进入项目目录
cd ScreenForge

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

启动成功后，Electron 窗口将自动打开，即可开始使用 ScreenForge 🎉

> **提示**：首次启动可能需要几秒钟时间编译 TypeScript，请耐心等待。

---

## 📖 详细使用指南

### 🎥 录制模式说明

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| 🖥️ 全屏录制 | 捕获整个屏幕画面 | 产品演示、全流程展示 |
| 🪟 窗口录制 | 仅捕获指定窗口内容 | 应用教程、功能展示 |
| ✂️ 自定义区域 | 框选屏幕任意矩形区域 | 局部操作演示、Bug 复现 |

### 🎵 音频设置

- **麦克风录音** — 在设置面板中启用麦克风，选择输入设备并调节音量
- **系统音频** — 启用系统音频采集，录制应用/系统的声音输出
- **独立音量控制** — 麦克风和系统音频可分别调节，互不干扰

### 🤖 AI 缩放配置

在录制设置中开启 AI 智能缩放：

1. **灵敏度调节** — 控制缩放响应速度（低/中/高三档）
2. **缩放比例** — 设置最大缩放倍数（1.5x / 2x / 3x / 4x）
3. **平滑过渡** — 启用后缩放动画更加流畅自然
4. **热力图分析** — 基于鼠标移动轨迹和停留时间，智能判断焦点区域

### ✏️ 编辑器使用

录制完成后进入编辑器：

1. **时间线浏览** — 拖动时间轴预览视频内容
2. **片段裁剪** — 选中不需要的片段，点击删除即可裁剪
3. **速度调节** — 选中片段后调节播放速度（0.5x / 0.75x / 1x / 1.25x / 1.5x / 2x）
4. **添加标注** — 暂停在目标帧，选择标注工具进行标注

### 📤 导出选项说明

| 选项 | 说明 |
|------|------|
| 📁 格式选择 | MP4 (H.264) / GIF / WebM (VP9) |
| 📐 分辨率 | 1080p / 720p / 480p |
| 🖼️ 宽高比 | 16:9 / 9:16 / 1:1 / 4:5 / 4:3 |
| 🎨 背景 | 保留原始 / 纯色 / 渐变 / 图片 / 模糊 |
| 📷 画中画 | 开启/关闭摄像头叠加 |
| 📝 标注 | 保留/移除已添加的标注 |

### ⌨️ 快捷键列表

| 快捷键 | 功能 |
|--------|------|
| `F9` | 开始 / 停止录制 |
| `F10` | 暂停 / 继续录制 |
| `F11` | 截取当前画面 |
| `Ctrl + Z` | 撤销操作 |
| `Ctrl + Shift + Z` | 重做操作 |
| `Space` | 播放 / 暂停预览 |
| `Delete` | 删除选中片段 |

---

## 💡 设计思路与迭代规划

### 🎯 设计理念

ScreenForge 遵循以下核心设计理念：

- **轻量优先** — 核心引擎零外部依赖，启动快、占用少
- **智能辅助** — AI 技术赋能创作，减少手动编辑工作量
- **开箱即用** — 合理的默认配置，新手也能快速上手
- **高度可扩展** — 模块化架构，方便社区贡献和功能扩展

### 🔧 技术选型原因

| 技术 | 选型理由 |
|------|---------|
| **Electron 33** | 成熟的跨平台桌面应用框架，丰富的原生 API 支持 |
| **React 18** | 组件化开发，生态丰富，性能优异 |
| **TypeScript** | 类型安全，提升代码质量和开发体验 |
| **Vite** | 极速的热更新和构建速度 |
| **Tailwind CSS** | 原子化 CSS，快速构建一致且美观的 UI |
| **FFmpeg** | 业界标准的音视频处理工具，格式支持全面 |

### 🗺️ 后续迭代计划

#### v1.1 — 自动字幕 📝
- 语音识别自动生成字幕
- 支持手动编辑和调整字幕时间轴
- 多语言字幕支持

#### v1.2 — 多语言配音 🌍
- AI 语音合成配音
- 多语言/多音色选择
- 配音与原声混流

#### v1.3 — 云同步 ☁️
- 项目文件云端备份
- 多设备同步
- 分享链接生成

#### v2.0 — 插件系统 🧩
- 开放插件 API
- 插件市场
- 社区生态建设

### 🤝 社区贡献方向

我们欢迎以下方向的贡献：

- 🎨 **UI/UX 设计** — 界面优化、交互动效、新主题
- 📖 **文档** — 使用教程、API 文档、多语言翻译
- 🐛 **Bug 修复** — 问题排查与修复
- ✨ **新功能** — 特性提案与实现
- 🧪 **测试** — 单元测试、集成测试、E2E 测试

---

## 📦 打包与部署指南

### 🏗️ 构建命令

```bash
# 构建 Windows 安装包
npm run build:win

# 构建 macOS 安装包
npm run build:mac

# 构建 Linux 安装包
npm run build:linux
```

### 🎬 FFmpeg 安装说明

FFmpeg 是导出功能的必要依赖，请根据你的操作系统进行安装：

#### Windows

```bash
# 方式一：使用 winget（Windows 10+）
winget install FFmpeg

# 方式二：使用 Chocolatey
choco install ffmpeg

# 方式三：使用 Scoop
scoop install ffmpeg
```

安装后请确保 FFmpeg 已添加到系统 PATH 环境变量中。

#### macOS

```bash
# 使用 Homebrew
brew install ffmpeg
```

#### Linux

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

### ⚠️ 注意事项

- macOS 打包需要 **Apple Developer 账号** 和对应的证书
- Windows 打包建议在 **Windows 10/11** 环境下进行
- Linux 打包需要安装 `rpm` 或 `dpkg` 等打包工具
- 首次打包可能需要下载 Electron 二进制文件，请确保网络通畅
- 生产环境构建请使用 `npm run build` 进行优化构建

---

## 🤝 贡献指南

我们非常欢迎任何形式的贡献！无论是提交 Bug 报告、功能建议，还是直接提交代码，都是对项目的巨大支持。

### 📝 PR 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**type 类型说明：**

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链相关 |
| `ci` | CI/CD 配置 |

**提交示例：**

```
feat(recorder): add AI auto-zoom feature
fix(export): resolve GIF export crash on macOS
docs(readme): add multi-language support
```

### 🐛 Issue 反馈规则

提交 Issue 时，请尽量包含以下信息：

1. **环境信息** — 操作系统版本、Node.js 版本、ScreenForge 版本
2. **问题描述** — 详细描述遇到的问题
3. **复现步骤** — 提供可复现的操作步骤
4. **期望行为** — 描述你期望的正确行为
5. **截图/日志** — 如有可能，附上相关截图或日志信息

### 🛠️ 开发环境搭建

```bash
# 1. Fork 本仓库
# 2. 克隆你的 Fork
git clone https://github.com/<your-username>/ScreenForge.git

# 3. 安装依赖
cd ScreenForge
npm install

# 4. 启动开发模式
npm run dev

# 5. 运行测试
npm run test

# 6. 代码检查
npm run lint
```

---

## 📄 开源协议

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

```
MIT License

Copyright (c) 2025 ScreenForge Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/ScreenForge">ScreenForge Team</a>
</p>

---
---

<a id="zh-tw"></a>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<h1 align="center">🎬 ScreenForge</h1>

<p align="center">
  <strong>輕量級智慧錄屏演示引擎</strong><br>
  一款免費開源的 Screen Studio 替代品，讓每一幀畫面都精彩紛呈 ✨
</p>

---

## 🎉 專案介紹

**ScreenForge** 是一款基於 **Electron + React + TypeScript** 建構的輕量級智慧錄屏演示引擎。它不僅僅是一個錄屏工具，更是一個專注於**內容創作與演示表達**的智慧引擎。

### 💎 核心價值

在當今的內容創作時代，一款優秀的錄屏工具是每個開發者和創作者的剛需。然而，市面上主流的錄屏演示軟體要麼**價格昂貴**（如 Screen Studio 售價 $89），要麼**功能臃腫**、**匯出格式受限**，讓許多個人開發者和小團隊望而卻步。

ScreenForge 誕生於這樣一個簡單的信念：**每個人都應該擁有一個免費、強大、優雅的錄屏演示工具**。

### 🔥 解決的使用者痛點

| 痛點 | ScreenForge 的解決方案 |
|------|------------------------|
| 💰 付費錄屏軟體昂貴 | 完全免費開源，MIT 協議 |
| 🐌 功能臃腫、啟動緩慢 | 輕量級架構，秒級啟動 |
| 📐 匯出格式受限 | 支援 MP4/GIF/WebM 多格式 |
| 🎯 缺乏智慧聚焦 | AI 智慧縮放，自動追蹤滑鼠 |
| 🎨 畫面單調乏味 | 背景替換 + 標註 + 模板系統 |

### ⭐ 自研差異化亮點

- 🧠 **AI 智慧縮放** — 基於滑鼠熱力圖分析，自動聚焦活動區域，讓你的演示影片更具專業感
- ⚡ **零依賴核心引擎** — 錄製核心不依賴任何第三方服務，離線也能完美運作
- 🖥️ **跨平台支援** — 一套程式碼，Windows / macOS / Linux 全平台覆蓋
- 📋 **模板預設系統** — 一鍵應用精心設計的模板，快速產出專業級演示影片

### 💡 靈感來源

靈感來源於 [Screen Studio](https://www.screenstudio.com/) 和 [OBS Studio](https://obsproject.com/)，我們希望將 Screen Studio 的**精美演示效果**與 OBS Studio 的**開源自由精神**融為一體，打造一款人人都能用得上的智慧錄屏工具。

---

## ✨ 核心特性

### 🎬 智慧錄製引擎
支援 **全螢幕錄製**、**視窗錄製** 和 **自訂區域錄製** 三種模式，靈活適配各種使用場景。無論是全螢幕演示還是局部操作展示，都能精準捕捉每一幀畫面。

### 🎙️ 多源音訊採集
同時支援 **麥克風輸入** 和 **系統音訊錄製**，可獨立調節音量。錄製教學時，你的講解和系統聲音都能完美收錄。

### 📷 攝影機畫中畫
支援 **攝影機畫面疊加**，可自由調整位置和大小。在演示的同時展示真人講解，讓你的影片更具親和力與專業度。

### 🤖 AI 智慧縮放
基於 **滑鼠熱力圖分析演算法**，自動識別並聚焦滑鼠活動區域，智慧調整畫面縮放比例。無需手動編輯，即可產出具有電影級運鏡效果的演示影片。

### 🎨 背景替換
支援多種背景模式：**純色填充**、**漸層色**、**自訂圖片** 和 **背景模糊**。輕鬆打造乾淨專業的演示畫面，告別雜亂桌面。

### ✂️ 時間軸編輯
內建直觀的時間軸編輯器，支援 **片段裁剪** 和 **播放速度調節**（0.5x ~ 2x）。精準控制影片節奏，去除冗餘內容。

### 📝 標註工具
提供 **文字標註**、**箭頭指示** 和 **矩形框選** 三種標註工具，配備 **6 色預設**（紅/橙/黃/綠/藍/紫），讓你的演示重點一目了然。

### 📤 多格式匯出
支援匯出為 **MP4 (H.264)**、**GIF** 和 **WebM (VP9)** 三種格式，滿足不同平台的分享需求。社群媒體、技術文件、產品演示，一鍵搞定。

### 🖥️ 多解析度與寬高比
支援 **1080p / 720p / 480p** 多種解析度，以及 **16:9 / 9:16 / 1:1 / 4:5 / 4:3** 多種寬高比預設。無論是橫屏演示還是直屏短影音，都能完美適配。

### 🌙 深色主題
精心打造的 **深色主題 UI**，長時間使用不疲勞，專業感十足。整體介面基於 Tailwind CSS 建構，簡潔優雅。

### ⌨️ 快捷鍵支援
全域快捷鍵讓錄製操作行雲流水：
- `F9` — 開始 / 停止錄製
- `F10` — 暫停 / 繼續錄製
- `F11` — 截取目前畫面

### 🔧 模板系統
內建多套精心設計的模板預設，涵蓋 **產品演示**、**教學錄製**、**Bug 重現** 等常見場景。一鍵應用，快速開始專業級錄製。

---

## 🚀 快速開始

### 📋 環境需求

| 依賴 | 最低版本 | 推薦版本 |
|------|---------|---------|
| 🟢 Node.js | >= 18.0.0 | 20.x LTS |
| 📦 npm | >= 9.0.0 | 10.x |
| 🎬 FFmpeg | >= 5.0 | 6.x（匯出功能需要） |

### 🛠️ 安裝步驟

```bash
# 1. 複製倉庫
git clone https://github.com/gitstq/ScreenForge.git

# 2. 進入專案資料夾
cd ScreenForge

# 3. 安裝依賴
npm install

# 4. 啟動開發伺服器
npm run dev
```

啟動成功後，Electron 視窗將自動開啟，即可開始使用 ScreenForge 🎉

> **提示**：首次啟動可能需要幾秒鐘時間編譯 TypeScript，請耐心等候。

---

## 📖 詳細使用指南

### 🎥 錄製模式說明

| 模式 | 說明 | 適用場景 |
|------|------|---------|
| 🖥️ 全螢幕錄製 | 捕獲整個螢幕畫面 | 產品演示、全流程展示 |
| 🪟 視窗錄製 | 僅捕獲指定視窗內容 | 應用教學、功能展示 |
| ✂️ 自訂區域 | 框選螢幕任意矩形區域 | 局部操作演示、Bug 重現 |

### 🎵 音訊設定

- **麥克風錄音** — 在設定面板中啟用麥克風，選擇輸入裝置並調節音量
- **系統音訊** — 啟用系統音訊採集，錄製應用/系統的聲音輸出
- **獨立音量控制** — 麥克風和系統音訊可分別調節，互不干擾

### 🤖 AI 縮放設定

在錄製設定中開啟 AI 智慧縮放：

1. **靈敏度調節** — 控制縮放回應速度（低/中/高三檔）
2. **縮放比例** — 設定最大縮放倍數（1.5x / 2x / 3x / 4x）
3. **平滑過渡** — 啟用後縮放動畫更加流暢自然
4. **熱力圖分析** — 基於滑鼠移動軌跡和停留時間，智慧判斷焦點區域

### ✏️ 編輯器使用

錄製完成後進入編輯器：

1. **時間軸瀏覽** — 拖動時間軸預覽影片內容
2. **片段裁剪** — 選中不需要的片段，點擊刪除即可裁剪
3. **速度調節** — 選中片段後調節播放速度（0.5x / 0.75x / 1x / 1.25x / 1.5x / 2x）
4. **新增標註** — 暫停在目標幀，選擇標註工具進行標註

### 📤 匯出選項說明

| 選項 | 說明 |
|------|------|
| 📁 格式選擇 | MP4 (H.264) / GIF / WebM (VP9) |
| 📐 解析度 | 1080p / 720p / 480p |
| 🖼️ 寬高比 | 16:9 / 9:16 / 1:1 / 4:5 / 4:3 |
| 🎨 背景 | 保留原始 / 純色 / 漸層 / 圖片 / 模糊 |
| 📷 畫中畫 | 開啟/關閉攝影機疊加 |
| 📝 標註 | 保留/移除已新增的標註 |

### ⌨️ 快捷鍵列表

| 快捷鍵 | 功能 |
|--------|------|
| `F9` | 開始 / 停止錄製 |
| `F10` | 暫停 / 繼續錄製 |
| `F11` | 截取目前畫面 |
| `Ctrl + Z` | 復原操作 |
| `Ctrl + Shift + Z` | 重做操作 |
| `Space` | 播放 / 暫停預覽 |
| `Delete` | 刪除選中片段 |

---

## 💡 設計思路與迭代規劃

### 🎯 設計理念

ScreenForge 遵循以下核心設計理念：

- **輕量優先** — 核心引擎零外部依賴，啟動快、佔用少
- **智慧輔助** — AI 技術賦能創作，減少手動編輯工作量
- **開箱即用** — 合理的預設配置，新手也能快速上手
- **高度可擴展** — 模組化架構，方便社群貢獻和功能擴展

### 🔧 技術選型原因

| 技術 | 選型理由 |
|------|---------|
| **Electron 33** | 成熟的跨平台桌面應用框架，豐富的原生 API 支援 |
| **React 18** | 元件化開發，生態豐富，效能優異 |
| **TypeScript** | 型別安全，提升程式碼品質和開發體驗 |
| **Vite** | 極速的熱更新和建置速度 |
| **Tailwind CSS** | 原子化 CSS，快速建構一致且美觀的 UI |
| **FFmpeg** | 業界標準的音視訊處理工具，格式支援全面 |

### 🗺️ 後續迭代計畫

#### v1.1 — 自動字幕 📝
- 語音辨識自動產生字幕
- 支援手動編輯和調整字幕時間軸
- 多語言字幕支援

#### v1.2 — 多語言配音 🌍
- AI 語音合成配音
- 多語言/多音色選擇
- 配音與原聲混流

#### v1.3 — 雲端同步 ☁️
- 專案檔案雲端備份
- 多裝置同步
- 分享連結產生

#### v2.0 — 外掛系統 🧩
- 開放外掛 API
- 外掛市集
- 社群生態建設

### 🤝 社群貢獻方向

我們歡迎以下方向的貢獻：

- 🎨 **UI/UX 設計** — 介面優化、互動動效、新主題
- 📖 **文件** — 使用教學、API 文件、多語言翻譯
- 🐛 **Bug 修復** — 問題排查與修復
- ✨ **新功能** — 特性提案與實作
- 🧪 **測試** — 單元測試、整合測試、E2E 測試

---

## 📦 打包與部署指南

### 🏗️ 建置指令

```bash
# 建置 Windows 安裝包
npm run build:win

# 建置 macOS 安裝包
npm run build:mac

# 建置 Linux 安裝包
npm run build:linux
```

### 🎬 FFmpeg 安裝說明

FFmpeg 是匯出功能的必要依賴，請根據你的作業系統進行安裝：

#### Windows

```bash
# 方式一：使用 winget（Windows 10+）
winget install FFmpeg

# 方式二：使用 Chocolatey
choco install ffmpeg

# 方式三：使用 Scoop
scoop install ffmpeg
```

安裝後請確保 FFmpeg 已新增至系統 PATH 環境變數中。

#### macOS

```bash
# 使用 Homebrew
brew install ffmpeg
```

#### Linux

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

### ⚠️ 注意事項

- macOS 打包需要 **Apple Developer 帳號** 和對應的憑證
- Windows 打包建議在 **Windows 10/11** 環境下進行
- Linux 打包需要安裝 `rpm` 或 `dpkg` 等打包工具
- 首次打包可能需要下載 Electron 二進位檔案，請確保網路暢通
- 正式環境建置請使用 `npm run build` 進行最佳化建置

---

## 🤝 貢獻指南

我們非常歡迎任何形式的貢獻！無論是提交 Bug 回報、功能建議，還是直接提交程式碼，都是對專案的巨大支持。

### 📝 PR 提交規範

本專案遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**type 類型說明：**

| 類型 | 說明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修復 |
| `docs` | 文件更新 |
| `style` | 程式碼格式調整（不影響功能） |
| `refactor` | 程式碼重構 |
| `perf` | 效能最佳化 |
| `test` | 測試相關 |
| `chore` | 建置/工具鏈相關 |
| `ci` | CI/CD 設定 |

**提交範例：**

```
feat(recorder): add AI auto-zoom feature
fix(export): resolve GIF export crash on macOS
docs(readme): add multi-language support
```

### 🐛 Issue 回報規則

提交 Issue 時，請盡量包含以下資訊：

1. **環境資訊** — 作業系統版本、Node.js 版本、ScreenForge 版本
2. **問題描述** — 詳細描述遇到的問題
3. **重現步驟** — 提供可重現的操作步驟
4. **期望行為** — 描述你期望的正確行為
5. **截圖/日誌** — 如有可能，附上相關截圖或日誌資訊

### 🛠️ 開發環境建置

```bash
# 1. Fork 本倉庫
# 2. 複製你的 Fork
git clone https://github.com/<your-username>/ScreenForge.git

# 3. 安裝依賴
cd ScreenForge
npm install

# 4. 啟動開發模式
npm run dev

# 5. 執行測試
npm run test

# 6. 程式碼檢查
npm run lint
```

---

## 📄 開源協議

本專案基於 [MIT License](https://opensource.org/licenses/MIT) 開源。

```
MIT License

Copyright (c) 2025 ScreenForge Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/ScreenForge">ScreenForge Team</a>
</p>

---
---

<a id="en"></a>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<h1 align="center">🎬 ScreenForge</h1>

<p align="center">
  <strong>A Lightweight Intelligent Screen Recording & Presentation Engine</strong><br>
  A free and open-source alternative to Screen Studio — make every frame shine ✨
</p>

---

## 🎉 Introduction

**ScreenForge** is a lightweight intelligent screen recording and presentation engine built with **Electron + React + TypeScript**. It is more than just a screen recorder — it is an intelligent engine focused on **content creation and expressive presentations**.

### 💎 Core Value

In today's era of content creation, a great screen recording tool is essential for every developer and creator. However, mainstream recording and presentation software is either **expensive** (e.g., Screen Studio at $89), **bloated with unnecessary features**, or **limited in export formats**, putting it out of reach for many individual developers and small teams.

ScreenForge was born from a simple belief: **everyone deserves a free, powerful, and elegant screen recording and presentation tool**.

### 🔥 Problems We Solve

| Pain Point | ScreenForge's Solution |
|------------|------------------------|
| 💰 Expensive recording software | Completely free and open-source under MIT License |
| 🐌 Bloated software, slow startup | Lightweight architecture, launches in seconds |
| 📐 Limited export formats | Supports MP4 / GIF / WebM out of the box |
| 🎯 No intelligent focus | AI-powered smart zoom that tracks your mouse automatically |
| 🎨 Dull, unpolished visuals | Background replacement + annotations + template system |

### ⭐ What Makes Us Different

- 🧠 **AI Smart Zoom** — Analyzes mouse heatmap data to automatically focus on active areas, giving your demo videos a professional, cinematic feel
- ⚡ **Zero-Dependency Core Engine** — The recording core relies on no third-party services and works perfectly offline
- 🖥️ **Cross-Platform Support** — One codebase covering Windows / macOS / Linux
- 📋 **Template Preset System** — Apply carefully designed templates with a single click to produce professional-grade demo videos in no time

### 💡 Inspiration

Inspired by [Screen Studio](https://www.screenstudio.com/) and [OBS Studio](https://obsproject.com/), we aim to combine Screen Studio's **polished presentation quality** with OBS Studio's **open-source freedom**, creating an intelligent screen recording tool that anyone can use.

---

## ✨ Core Features

### 🎬 Smart Recording Engine
Supports **full screen**, **window**, and **custom region** recording modes to flexibly adapt to any scenario. Whether you're giving a full-screen presentation or demonstrating a specific area, every frame is captured with precision.

### 🎙️ Multi-Source Audio Capture
Simultaneously records **microphone input** and **system audio**, with independent volume controls. When recording tutorials, both your narration and system sounds are captured perfectly.

### 📷 Camera Picture-in-Picture
Supports **camera overlay** with adjustable position and size. Show your face alongside your screen recording to add a personal, professional touch to your videos.

### 🤖 AI Smart Zoom
Powered by a **mouse heatmap analysis algorithm**, it automatically identifies and focuses on active mouse areas, intelligently adjusting the zoom level. Produce cinematic pan-and-zoom effects without any manual editing.

### 🎨 Background Replacement
Supports multiple background modes: **solid color**, **gradient**, **custom image**, and **background blur**. Create clean, professional-looking recordings and say goodbye to cluttered desktops.

### ✂️ Timeline Editor
A built-in, intuitive timeline editor with **clip trimming** and **playback speed adjustment** (0.5x ~ 2x). Fine-tune your video's pacing and remove unwanted sections with ease.

### 📝 Annotation Tools
Three annotation tools — **text labels**, **arrows**, and **rectangle highlights** — with **6 preset colors** (red / orange / yellow / green / blue / purple). Make your key points stand out at a glance.

### 📤 Multi-Format Export
Export to **MP4 (H.264)**, **GIF**, and **WebM (VP9)** to meet the sharing needs of different platforms. Social media, technical docs, product demos — all handled with a single click.

### 🖥️ Multiple Resolutions & Aspect Ratios
Supports **1080p / 720p / 480p** resolutions and **16:9 / 9:16 / 1:1 / 4:5 / 4:3** aspect ratio presets. Whether it's a landscape presentation or a vertical short video, ScreenForge has you covered.

### 🌙 Dark Theme
A carefully crafted **dark-themed UI** that's easy on the eyes during long sessions, with a sleek, professional look. The entire interface is built with Tailwind CSS for a clean, modern aesthetic.

### ⌨️ Keyboard Shortcuts
Global keyboard shortcuts make recording effortless:
- `F9` — Start / Stop recording
- `F10` — Pause / Resume recording
- `F11` — Capture current frame

### 🔧 Template System
Comes with a collection of carefully designed template presets for common scenarios including **product demos**, **tutorial recordings**, and **bug reproductions**. Apply a template with one click and start recording like a pro.

---

## 🚀 Quick Start

### 📋 Prerequisites

| Dependency | Minimum Version | Recommended |
|------------|----------------|-------------|
| 🟢 Node.js | >= 18.0.0 | 20.x LTS |
| 📦 npm | >= 9.0.0 | 10.x |
| 🎬 FFmpeg | >= 5.0 | 6.x (required for export) |

### 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/gitstq/ScreenForge.git

# 2. Navigate to the project directory
cd ScreenForge

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Once launched, the Electron window will open automatically and you're ready to use ScreenForge! 🎉

> **Tip:** The first launch may take a few seconds to compile TypeScript. Please be patient.

---

## 📖 Detailed Usage Guide

### 🎥 Recording Modes

| Mode | Description | Best For |
|------|-------------|----------|
| 🖥️ Full Screen | Captures the entire screen | Product demos, full walkthroughs |
| 🪟 Window | Captures a specific window only | App tutorials, feature showcases |
| ✂️ Custom Region | Select any rectangular area on screen | Focused demos, bug reproductions |

### 🎵 Audio Settings

- **Microphone Recording** — Enable your mic in the settings panel, select the input device, and adjust the volume
- **System Audio** — Enable system audio capture to record application/system sound output
- **Independent Volume Control** — Microphone and system audio volumes can be adjusted separately

### 🤖 AI Zoom Configuration

Enable AI Smart Zoom in the recording settings:

1. **Sensitivity** — Control how quickly the zoom responds (Low / Medium / High)
2. **Zoom Level** — Set the maximum zoom factor (1.5x / 2x / 3x / 4x)
3. **Smooth Transitions** — Enable for smoother, more natural zoom animations
4. **Heatmap Analysis** — Intelligently determines focus areas based on mouse movement patterns and dwell time

### ✏️ Using the Editor

After recording, enter the editor:

1. **Timeline Navigation** — Drag the timeline to preview video content
2. **Clip Trimming** — Select unwanted segments and delete them
3. **Speed Adjustment** — Adjust playback speed for selected clips (0.5x / 0.75x / 1x / 1.25x / 1.5x / 2x)
4. **Add Annotations** — Pause at the target frame and use annotation tools to highlight key points

### 📤 Export Options

| Option | Description |
|--------|-------------|
| 📁 Format | MP4 (H.264) / GIF / WebM (VP9) |
| 📐 Resolution | 1080p / 720p / 480p |
| 🖼️ Aspect Ratio | 16:9 / 9:16 / 1:1 / 4:5 / 4:3 |
| 🎨 Background | Original / Solid / Gradient / Image / Blur |
| 📷 Picture-in-Picture | Enable/disable camera overlay |
| 📝 Annotations | Keep/remove added annotations |

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F9` | Start / Stop recording |
| `F10` | Pause / Resume recording |
| `F11` | Capture current frame |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Space` | Play / Pause preview |
| `Delete` | Delete selected clip |

---

## 💡 Design Philosophy & Roadmap

### 🎯 Design Principles

ScreenForge is built on the following core principles:

- **Lightweight First** — Zero external dependencies for the core engine; fast startup and low resource usage
- **AI-Powered Assistance** — Leverage AI to reduce manual editing and boost creative productivity
- **Ready Out of the Box** — Sensible defaults so even beginners can get started immediately
- **Highly Extensible** — Modular architecture that makes it easy for the community to contribute and extend functionality

### 🔧 Technology Choices

| Technology | Why We Chose It |
|------------|----------------|
| **Electron 33** | Mature cross-platform desktop framework with rich native API support |
| **React 18** | Component-based development with a rich ecosystem and excellent performance |
| **TypeScript** | Type safety for better code quality and developer experience |
| **Vite** | Blazing-fast hot module replacement and build speeds |
| **Tailwind CSS** | Utility-first CSS for rapidly building consistent, beautiful UIs |
| **FFmpeg** | Industry-standard audio/video processing with comprehensive format support |

### 🗺️ Roadmap

#### v1.1 — Auto Subtitles 📝
- Automatic subtitle generation via speech recognition
- Manual subtitle editing and timeline adjustment
- Multi-language subtitle support

#### v1.2 — Multi-Language Voiceover 🌍
- AI-powered voice synthesis for narration
- Multiple languages and voice styles
- Voiceover mixing with original audio

#### v1.3 — Cloud Sync ☁️
- Cloud backup for project files
- Multi-device synchronization
- Shareable link generation

#### v2.0 — Plugin System 🧩
- Open plugin API
- Plugin marketplace
- Community ecosystem development

### 🤝 Ways to Contribute

We welcome contributions in the following areas:

- 🎨 **UI/UX Design** — Interface improvements, interaction animations, new themes
- 📖 **Documentation** — Tutorials, API docs, translations
- 🐛 **Bug Fixes** — Issue investigation and resolution
- ✨ **New Features** — Feature proposals and implementations
- 🧪 **Testing** — Unit tests, integration tests, E2E tests

---

## 📦 Build & Deployment

### 🏗️ Build Commands

```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

### 🎬 FFmpeg Installation

FFmpeg is required for the export feature. Install it based on your operating system:

#### Windows

```bash
# Option 1: Using winget (Windows 10+)
winget install FFmpeg

# Option 2: Using Chocolatey
choco install ffmpeg

# Option 3: Using Scoop
scoop install ffmpeg
```

Make sure FFmpeg is added to your system PATH after installation.

#### macOS

```bash
# Using Homebrew
brew install ffmpeg
```

#### Linux

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

### ⚠️ Notes

- macOS builds require an **Apple Developer account** and the corresponding certificates
- Windows builds are recommended to be run on **Windows 10/11**
- Linux builds require packaging tools such as `rpm` or `dpkg`
- The first build may need to download Electron binaries — ensure a stable internet connection
- For production builds, use `npm run build` for optimized output

---

## 🤝 Contributing

We warmly welcome contributions of all kinds! Whether it's filing a bug report, suggesting a feature, or submitting a pull request, every contribution matters.

### 📝 Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Commit Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation update |
| `style` | Code formatting (no functional changes) |
| `refactor` | Code refactoring |
| `perf` | Performance optimization |
| `test` | Test-related changes |
| `chore` | Build/tooling changes |
| `ci` | CI/CD configuration |

**Examples:**

```
feat(recorder): add AI auto-zoom feature
fix(export): resolve GIF export crash on macOS
docs(readme): add multi-language support
```

### 🐛 Filing Issues

When submitting an issue, please include as much of the following information as possible:

1. **Environment** — OS version, Node.js version, ScreenForge version
2. **Description** — A detailed description of the problem
3. **Steps to Reproduce** — Clear, step-by-step reproduction instructions
4. **Expected Behavior** — What you expected to happen
5. **Screenshots/Logs** — Attach relevant screenshots or log output if possible

### 🛠️ Setting Up the Dev Environment

```bash
# 1. Fork this repository
# 2. Clone your fork
git clone https://github.com/<your-username>/ScreenForge.git

# 3. Install dependencies
cd ScreenForge
npm install

# 4. Start in development mode
npm run dev

# 5. Run tests
npm run test

# 6. Lint code
npm run lint
```

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2025 ScreenForge Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/ScreenForge">ScreenForge Team</a>
</p>
