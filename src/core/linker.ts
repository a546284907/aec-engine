import { StdLibrary, KernelModule } from '../stdlib';
import { CompiledContext, SupportedLang } from './types';

export class AECLinker {
  /**
   * 编译 AEC 源代码
   * @param userCode 用户输入的 AEC 伪代码
   * @param lang 目标语言 'en' | 'zh' (默认 'en')
   */
  static compile(userCode: string, lang: SupportedLang = 'en'): CompiledContext {
    // 1. 获取对应语言的内核 Prompt
    // 如果没有对应的语言，回退到英文（防止报错）
    let systemPrompt = KernelModule.prompts[lang] || KernelModule.prompts['en'];
    
    const activeModules: string[] = [KernelModule.namespace];
    const tokens: string[] = userCode.match(/\b[A-Z_]+\b/g) || [];

    // 2. 遍历加载
    StdLibrary.forEach(mod => {
      if (mod.namespace === KernelModule.namespace) return;

      const shouldLoad = mod.keywords.some(keyword => tokens.includes(keyword));

      if (shouldLoad) {
        // 获取对应语言的说明
        const modulePrompt = mod.prompts[lang] || mod.prompts['en'];
        systemPrompt += `\n\n${modulePrompt}`;
        activeModules.push(mod.namespace);
      }
    });

    // 3. 结尾提示也应该根据语言变化（这里简单处理，或者放到 Kernel 里）
    const footer = lang === 'zh' 
      ? `\n\n[用户输入开始]\n${userCode}\n[用户输入结束]`
      : `\n\n[USER_INPUT_START]\n${userCode}\n[USER_INPUT_END]`;

    systemPrompt += footer;

    return {
      systemPrompt,
      activeModules
    };
  }
}