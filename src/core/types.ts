/**
 * src/core/types.ts
 */
export type SupportedLang = 'en' | 'zh';
// 定义一个 AEC 指令模块的标准结构
export interface AECModule {
  // 命名空间，用于区分模块 (e.g., "SYS_IO", "SYS_NET")
  namespace: string;
  
  // 模块简介，用于人类阅读或自动索引
  description: string;
  
  // 触发该模块的关键词列表
  // Linker 会扫描用户代码，如果发现这些词，就加载这个模块
  keywords: string[];
  
  // 发送给 AI 的具体指令说明书 (System Prompt 片段)
  prompts: {
    en: string;
    zh: string;
  };
}

// Linker 编译后的结果对象
export interface CompiledContext {
  // 最终组装好的 System Prompt
  systemPrompt: string;
  
  // 本次编译激活了哪些模块 (用于调试日志)
  activeModules: string[];
}