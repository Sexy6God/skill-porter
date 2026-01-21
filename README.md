# SkillPorter

SkillPorter 是一个轻量级的命令行工具，用于将 Claude Code 中的技能（Skills）分发到其他 AI 编程工具（如 Antigravity, OpenCode, Cursor 等）。

## 核心功能

- **智能发现**：自动扫描 Claude 的个人技能目录及市场插件目录。
- **全平台支持**：支持 Antigravity, OpenCode, GitHub Copilot, Cursor, Windsurf。
- **物理备份**：采用文件夹物理复制，确保各平台独立稳定。
- **交互式操作**：通过 TUI 界面勾选技能和目标平台，简单直观。

### 全局安装

#### 方式一：独立二进制安装 (无需 Bun 环境)

如果你想直接使用而不保留源码，可以编译为独立可执行文件：

1. 克隆仓库并进入目录。
2. 运行编译命令：
   ```bash
   bun build ./index.ts --compile --outfile skillporter
   ```
3. 将生成的 `skillporter` 移动到你的系统 PATH 中：
   ```bash
   sudo mv skillporter /usr/local/bin/
   ```
之后你可以安全地删除源码文件夹。

#### 方式二：通过 npm 全局安装

这是最简单的方式（待发布）：

```bash
npm install -g skillporter
```

#### 方式三：克隆仓库开发安装

如果你想参与开发，请使用此方式：

1. `bun install`
2. `npm link` (这会在开发模式下创建全局链接)

### 开发与运行

本项目使用 [Bun](https://bun.sh) 开发。

1. 安装依赖：`bun install`
2. 运行示例：`bun index.ts`

### 目录结构
- `src/config`: 平台路径定义
- `src/core`: 扫描与搬运核心逻辑
- `src/utils`: 路径处理工具
- `index.ts`: CLI 入口
