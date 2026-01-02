# aec-engine
# AEC Engine (AI Execute Code Engine)

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0--alpha-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Powered%20by-Node.js%20%26%20TypeScript-orange" alt="Powered by Node.js & TypeScript">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status">
</p>

**AEC Engine is a specification and an interpreter for a low-entropy, high-efficiency "language" designed to interact with Large Language Models (LLMs) in a standardized, predictable, and token-efficient way.**

_中文 | [English](./README_en.md) (Soon)_

## 🤔 解决什么问题？(The Problem)

与 LLMs 的传统自然语言交互存在几个核心痛点：
1.  **高熵与歧义**：自然语言充满歧义（"帮我看看这个"），导致 AI 的行为不可预测。
2.  **Token 浪费**：每次对话都充满了冗余的礼貌用语和上下文，成本高昂且效率低下。
3.  **上下文丢失**：AI 容易“忘记”之前的步骤，导致任务链断裂。
4.  **模型差异性**：不同厂商的 AI（GPT-4, Claude, Llama）行为模式各异，难以构建统一的自动化流程。

AEC Engine 将 AI 交互从“聊天”转变为“编程”，通过定义一种**简洁的中间语言 (AEC)**，让开发者能像调用函数一样精准地控制 AI。

## ✨ 核心特性 (Features)

*   **⚡️ Token 高效 (Token-Efficient)**：通过“动态链接”机制，只加载当前任务所需指令的说明，极大节省 System Prompt 的 Token 消耗。
*   **🎯 行为精准 (Predictable)**：使用类似编程语言的指令 (`RUN`, `VAR`) 替代自然语言，消除歧义，让 AI 的输出严格可控。
*   **🧩 模块化标准库 (Modular StdLib)**：内置文件操作、网络请求、代码生成等标准模块，可按需加载，也易于扩展自定义模块。
*   **🤖 跨模型兼容 (Cross-Model Compatibility)**：AEC 规范旨在屏蔽底层 LLM 的差异，理论上任何遵循指令的 LLM 都可以作为 AEC 的执行后端。
*   **🛠️ 易于调试 (Debug-Friendly)**：当自动化流程失败时，开发者面对的是清晰的指令日志和状态快照，而不是混乱的对话历史。

## 🚀 快速开始 (Getting Started)

### 1. 安装

```bash
# Clone the repository
git clone https://github.com/your-username/aec-engine.git
cd aec-engine

# Install dependencies
npm install

2. 核心概念：AEC 语言
AEC 语言是一种伪代码，用于描述你希望 AI 执行的任务。
code
TypeScript
// 你的任务脚本 (e.g., my_task.aec)
VAR goal = "Generate a Python script to fetch a URL."
RUN THINK(goal)
RUN GEN_CODE("python", goal)
3. 使用 AECLinker 编译
AECLinker 是 AEC Engine 的核心“编译器”。它会读取你的 AEC 脚本，并动态生成一个最优化的 Prompt，只包含任务所需的最少上下文。
code
TypeScript
// example.ts
import { AECLinker } from './src/core/linker';

const userScript = `
  RUN GEN_CODE("python", "Create a 'Hello World' function.")
`;

// 编译！
const compiledContext = AECLinker.compile(userScript);

console.log("✅ Activated Modules:", compiledContext.activeModules);
console.log("\n🚀 Generated System Prompt:\n", compiledContext.systemPrompt);
console.log("\n👨‍💻 User Instruction:\n", userScript);

// 接下来，将这两部分发送给你选择的 LLM API...
输出：
code
Text
✅ Activated Modules: [ 'KERNEL', 'STD_BASE', 'SYS_DEV' ]

🚀 Generated System Prompt:
[ROLE]
You are the AEC (AI Execute Code) Interpreter...

[CMD: STD_BASE]
- RUN THINK(goal): Output your reasoning in <THOUGHT> tags...

[CMD: SYS_DEV]
- RUN GEN_CODE(lang, requirements): Output code in <CODE lang="..."> tags...

[OUTPUT_FORMAT]
Wrap results in <RESULT>...</RESULT>

👨‍💻 User Instruction:
RUN GEN_CODE("python", "Create a 'Hello World' function.")
注意：如果你的脚本中没有 GEN_CODE，那么 [CMD: SYS_DEV] 这部分就不会被加载，从而节省了 Token！
🗺️ 路线图 (Roadmap)

v0.1: 完成核心 Linker 和 Parser，实现基础的 Prompt 编译与结果解析。

v0.2: 完善标准库（文件、网络、代码），并提供完整的 LLM API (OpenAI) 对接示例。

v0.3: 引入状态管理机制，解决上下文记忆问题。

v0.4: 支持自定义模块的动态加载。

v1.0: 发布稳定版，提供 npm 包。
🤝 贡献 (Contributing)
我们欢迎任何形式的贡献！无论是提交 Issue、发起 Pull Request，还是改进文档，都是对项目的巨大帮助。
Fork aec-engine
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 许可证 (License)
本项目采用 MIT License 授权。
code
Code
---

### 如何使用这份 README：

1.  **替换链接**：将 `https://github.com/your-username/aec-engine.git` 替换成你的实际仓库地址。
2.  **创建 LICENSE 文件**：在仓库根目录创建一个 `LICENSE` 或 `LICENSE.txt` 文件，并将 MIT 许可证的文本粘贴进去（你可以在 [choosealicense.com](https://choosealicense.com/licenses/mit/) 上找到模板）。
3.  **可选：添加 Logo**：如果你有 Logo，可以在顶部添加 `<p align="center"><img src="your-logo-url" width="200"></p>` 来让项目更引人注目。
4.  **英文版**：`README_en.md` 可以先创建一个空文件占位，后续再翻译。

这份 README 应该足以让任何访问你仓库的人在 30 秒内理解项目的价值和用法。接下来，我们就可以专注于代码实现了！