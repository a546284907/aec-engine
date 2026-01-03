/**
 * src/types.ts
 * AEC 生态系统的核心协议定义
 */

export type Lang = 'en' | 'zh';

// 1. 指令定义 (Command Definition)
export interface AECCommand {
  name: string;           // 指令关键词，如 "GEN_CODE"
  params: string[];       // 参数列表，如 ["lang", "desc"]
  
  // 核心说明：支持双语
  description: { en: string; zh: string };
  
  // 【强壮性核心】执行规则：行级约束，AI 必须遵守的细节
  rules: { en: string[]; zh: string[] };
  
  // 【强壮性核心】Few-Shot 示例：编译器会自动将其组装成 Prompt
  examples: {
    input: string;  // 用户写的: RUN GEN_CODE(...)
    output: string; // 期望 AI 回的: <CODE>...</CODE>
  }[];
}

// 2. 插件定义 (Plugin Definition)
export interface AECPlugin {
  meta: {
    name: string;         // 包名 (e.g., "aec-kit-python")
    version: string;
    category: 'ROLE' | 'KIT' | 'KERNEL';
    author?: string;
    description?: string; 
  };

  // 全局约束：只要加载包，就生效的规则 (如 PEP8, Google Style)
  globalConstraints?: { en: string[]; zh: string[] };

  // 指令集
  commands: AECCommand[];
}

// 3. 编译器配置 (Config)
export interface AECConfig {
  lang: Lang;
  plugins: AECPlugin[]; // 用户在 config.js 中 require 进来的包
}