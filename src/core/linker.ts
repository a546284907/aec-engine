/**
 * src/core/linker.ts
 */
import { StdLibrary, KernelModule } from '../stdlib';
import { CompiledContext, SupportedLang } from './types';

export class AECLinker {
  /**
   * 编译 AEC 源代码
   */
  static compile(userCode: string, lang: SupportedLang = 'en'): CompiledContext {
    // 1. 准备一个数组来存放各个部分的 Prompt，而不是直接字符串相加
    // 这样方便后续统一处理连接符
    const promptParts: string[] = [];
    
    // 获取内核 Prompt
    const kernelPrompt = KernelModule.prompts[lang] || KernelModule.prompts['en'];
    promptParts.push(kernelPrompt);
    
    const activeModules: string[] = [KernelModule.namespace];
    // 修正：显式声明 tokens 类型为 string[]
    const tokens: string[] = userCode.match(/\b[A-Z_]+\b/g) || [];

    // 2. 遍历加载模块
    StdLibrary.forEach(mod => {
      if (mod.namespace === KernelModule.namespace) return;

      const shouldLoad = mod.keywords.some(keyword => tokens.includes(keyword));

      if (shouldLoad) {
        const modulePrompt = mod.prompts[lang] || mod.prompts['en'];
        promptParts.push(modulePrompt);
        activeModules.push(mod.namespace);
      }
    });

    // 3. 准备结尾
    const footer = lang === 'zh' 
      ? `[用户输入开始]\n${userCode}\n[用户输入结束]`
      : `[USER_INPUT_START]\n${userCode}\n[USER_INPUT_END]`;
    
    promptParts.push(footer);

    // =========================================================
    // 【核心优化】：Prompt 清洗与组装
    // =========================================================
    
    // 1. 对每个部分进行 trim()，去除头部和尾部的多余换行
    // 2. 使用 join('\n\n') 确保模块之间只有一个空行分隔
    let rawPrompt = promptParts.map(part => part.trim()).join('\n\n');

    // 3. (可选) 如果有些模板字符串内部写了太多换行，可以用正则把 3个以上换行压缩成 2个
    // 这样既保留了段落感，又不会出现大片空白
    rawPrompt = rawPrompt.replace(/\n{3,}/g, '\n\n');

    return {
      systemPrompt: rawPrompt,
      activeModules
    };
  }
}