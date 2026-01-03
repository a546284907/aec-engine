```markdown
<div align="center">
  <h1>🚀 AEC Engine</h1>
  <p>
    <strong>AI Agent 时代的“编译器”工具链</strong><br>
    别再手写提示词了，像写代码一样“编译”它们。
  </p>

  <p>
    <a href="./README.md">🇺🇸 English Docs</a> | 
    <a href="#快速开始">⚡ 快速开始</a> | 
    <a href="#核心特性">✨ 核心特性</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Language-TypeScript-blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/Status-Developer%20Preview-orange.svg" alt="Status">
  </p>
</div>

> **注意:** 本项目目前处于 **开发预览 (Developer Preview)** 阶段。请克隆仓库并在本地运行。

---

## 🤔 为什么需要 AEC?

与 LLM（如 ChatGPT）对话很简单，但要让它持续输出 **可靠的、工程级的、可用于生产环境** 的代码却很难。

*   ❌ **格式崩溃**: AI 经常胡乱缩进，或者把多行代码压缩成一行，导致 Python 无法运行。
*   ❌ **遗忘上下文**: 多轮对话后，AI 忘记了你要求的依赖库或编码规范。
*   ❌ **Token 浪费**: 每次都要重复发送几千字的“Prompt 咒语”。

**AEC (AI Execute Code)** 不是一个聊天机器人，它是一个 **编译器工具链**。
它将你简短的伪代码指令 (`RUN GEN_PY`) 编译成 **高强度、无歧义的 System Prompt**。

## ⚡ 快速开始

### 1. 克隆与安装
直接下载源码到本地：

```bash
git clone https://github.com/your-username/aec-engine.git
cd aec-engine

# 安装 TypeScript 运行环境依赖
npm install
2. 配置引擎 (aec.config.js)
在项目根目录创建配置文件，引用本地的插件。
code
JavaScript
// aec.config.js
// 引用 plugins 目录下的本地插件
const { PythonExpertKit } = require('./plugins/aec-kit-python-expert');

module.exports = {
  lang: 'zh', // 设置生成中文提示词
  plugins: [
    PythonExpertKit 
  ]
};
3. 编写指令 (main.aec)
创建一个 main.aec 文件。像指挥官一样下达指令，而不是像保姆一样解释细节。
code
Text
VAR task = "编写一个基于 asyncio 的高并发爬虫，需要处理反爬机制"

// 调用 Python 专家插件
RUN GEN_PY(task)

// 强制生成单元测试
RUN GEN_TEST("针对核心爬取逻辑的测试")
4. 编译生成 Prompt
运行 CLI 工具：
code
Bash
npx ts-node src/cli.ts compile main.aec
运行结果: 控制台将输出一段包含 物理排版约束、思维链要求 和 Few-Shot 示例 的完美 Prompt。将它发给 AI，你将得到架构师级别的代码。
📦 内置插件 (本地)
你可以在 plugins/ 目录下找到以下核心插件：
aec-kit-python-expert:
生成 Python 3.10+ 代码。
强制物理格式: 强制 4 空格缩进，禁止代码压缩，修复 AI 常见的格式错误。
架构师模式: 强制 AI 先输出 <THOUGHT> 设计思路，再写 <CODE>。
aec-kit-plugin-dev:
元工具: 通过简单的描述，让 AI 帮你生成一个新的 AEC 插件文件。
✨ 核心特性
🛡️ 强壮性优先:
词法分析器 (Lexer): 精准识别指令，跳过注释，不再被正则误导。
拼写纠错: 指令输错 (RUN GNE_PY) 会自动提示纠正。
🏗️ 物理级约束: 专门针对 LLM 偷懒（压缩代码）的行为，植入了物理排版规则。
🧠 思维链集成: 插件内置 Architecture Mode，强迫 AI 思考。
🔌 插件化架构: 未来支持 NPM 生态，目前支持本地插件扩展。
🤝 参与贡献
这是一个致力于规范化 AI 交互的开源标准。欢迎提交 PR！
📄 开源协议
MIT © AEC Team
code
Code
---

### 修改要点总结

1.  **Installation**: 把 `npm install aec-core` 改成了 `git clone` + `npm install`。
2.  **Usage**: 明确指出插件位置在 `./plugins/` 目录，通过相对路径引用。
3.  **Command**: 将 `npx aec` 替换为更原始的 `npx ts-node src/cli.ts`，符合开发阶段的现状。
4.  **Tone**: 强调了“预览版”状态，邀请开发者以此作为 Playground 进行实验。

你可以直接把这两段内容复制进去，覆盖原有的 README。这样别人下载后就能照着跑通了！