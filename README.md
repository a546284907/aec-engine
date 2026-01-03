<div align="center">
  <h1>🚀 AEC Engine</h1>
  <p>
    <strong>The "Compiler" for the Age of AI Agents.</strong><br>
    Stop guessing Prompts. Start compiling them.
  </p>

  <p>
    <a href="./README_zh-CN.md">🇨🇳 中文文档</a> | 
    <a href="#quick-start">⚡ Quick Start</a> | 
    <a href="#architecture">🛠️ Architecture</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Language-TypeScript-blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/Status-Developer%20Preview-orange.svg" alt="Status">
  </p>
</div>

> **Note:** This project is currently in **Developer Preview**. It is designed to be cloned and run locally.

---

## 🤔 Why AEC?

Talking to LLMs (ChatGPT, Claude) is easy. Getting **reliable, engineering-grade, production-ready** code from them is hard.

**AEC (AI Execute Code)** is a **Compiler Toolchain**. It validates your intent locally and compiles it into robust, highly-constrained System Prompts.

| The Old Way (Chat) | The AEC Way (Compile) |
| :--- | :--- |
| Natural Language | Domain Specific Language (`RUN GEN_PY(...)`) |
| Unpredictable Output | **Standardized Output** (Strict Indentation/XML) |
| Garbage Code | **Engineering Grade** (PEP8, Logging, TDD) |

## ⚡ Quick Start

### 1. Clone & Install
Since we are in preview, clone the repository directly:

```bash
git clone https://github.com/your-username/aec-engine.git
cd aec-engine

# Install dependencies (TypeScript, ts-node, etc.)
npm install
2. Configure (aec.config.js)
Create a config file in the root directory. We use local plugins from the plugins/ folder.
code
JavaScript
// aec.config.js
// Import local plugins directly
const { PythonExpertKit } = require('./plugins/aec-kit-python-expert');

module.exports = {
  lang: 'en', // Target language for the prompt (en/zh)
  plugins: [
    PythonExpertKit 
  ]
};
3. Write Your Instruction (main.aec)
Create a file named main.aec. Describe what you want, not how to do it.
code
Text
VAR task = "A multi-threaded downloader with retry logic"

// Use the command provided by PythonExpertKit
RUN GEN_PY(task)

// Enforce Test-Driven Development
RUN GEN_TEST("Unit test for the downloader")
4. Compile!
Use ts-node to run the compiler CLI.
code
Bash
npx ts-node src/cli.ts compile main.aec
Result: Check your console. You will see a compiled, high-density System Prompt. Copy and paste it to GPT-4/Claude to get architect-level results.
📦 Included Plugins (Local)
You can find these in the plugins/ directory:
aec-kit-python-expert: Generates Python 3.10+, Type-safe, SOLID code. Enforces physical formatting (4-space indent).
aec-kit-plugin-dev: A meta-tool that helps you generate new AEC plugins using AI.
🛠️ Architecture
AEC separates the "User Intent" from the "Prompt Engineering".
code
Mermaid
graph LR
    User[main.aec] -->|Source Code| Compiler[AEC Core]
    Plugin[Local Plugins] -->|Load Rules| Compiler
    Compiler -->|Lexer & Validator| Validated[AST]
    Validated -->|Generate| Prompt[System Prompt]
    Prompt -->|Copy/Paste| LLM[AI Model]
🤝 Contributing
We are building a standard library for AI interaction.
Pull Requests are welcome!
📄 License
MIT © AEC Team