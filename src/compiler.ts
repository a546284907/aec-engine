/**
 * src/compiler.ts
 */
import { AECConfig, AECPlugin } from './types';
import { Lexer } from './lexer';
import { findClosestMatch } from './utils';

// 语言保留字 (即使用户没安装插件，这些词也是合法的)
const CORE_KEYWORDS = new Set(['VAR', 'RUN', 'THINK', 'REPORT', 'ASK', 'IF', 'ELSE']);

export class Compiler {
  constructor(private config: AECConfig) {}

  compile(userCode: string): string {
    const { lang, plugins } = this.config;

    // 1. 词法分析 (Lexical Analysis)
    // 获取用户代码中出现的所有大写词汇
    const usedIdentifiers = Lexer.scan(userCode);

    // 2. 建立指令索引 (Build Index)
    // 收集所有已安装插件提供的指令名
    const availableCommands = new Map<string, AECPlugin>(); // CmdName -> Plugin
    const allCommandNames: string[] = [];

    plugins.forEach(p => {
      p.commands.forEach(cmd => {
        availableCommands.set(cmd.name, p);
        allCommandNames.push(cmd.name);
      });
    });

    // 3. 校验与错误发现 (Validation)
    const validUsedCommands = new Set<string>();
    
    usedIdentifiers.forEach(token => {
      // 如果是插件指令
      if (availableCommands.has(token)) {
        validUsedCommands.add(token);
      } 
      // 如果不是插件指令，也不是保留字 -> 报错！
      else if (!CORE_KEYWORDS.has(token)) {
        const suggestion = findClosestMatch(token, allCommandNames);
        let errorMsg = `❌ Compile Error: Unknown command '${token}'.`;
        if (suggestion) {
          errorMsg += ` Did you mean '${suggestion}'?`;
        }
        throw new Error(errorMsg);
      }
    });

    // 4. 构建 Prompt (Optimization Included)
    // 我们在这里做一个简单的 Token 估算策略
    let parts: string[] = [];
    parts.push(this.buildHeader(lang));

    // 处理插件
    plugins.forEach(plugin => {
      // 只有当用户用到了该插件的指令，或者是全局类型的插件(如 Kernel/Role)，才加载
      const shouldLoad = plugin.meta.category !== 'KIT' || 
                         plugin.commands.some(c => validUsedCommands.has(c.name));

      if (shouldLoad) {
        // 传入 validUsedCommands，让 processPlugin 只生成用户用到的指令文档
        const prompt = this.processPlugin(plugin, validUsedCommands, lang);
        if (prompt) parts.push(prompt);
      }
    });

    const footer = lang === 'zh' 
      ? `\n[用户输入指令]\n${userCode}`
      : `\n[USER INPUT]\n${userCode}`;
    parts.push(footer);

    return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  private buildHeader(lang: 'en' | 'zh'): string {
    return lang === 'zh' 
      ? `[角色]\n你是一个AEC(AI执行代码)引擎。严格遵循以下已加载模块的指令规范。`
      : `[ROLE]\nYou are the AEC Engine. Follow the instruction specs strictly.`;
  }

   private processPlugin(plugin: AECPlugin, validCmds: Set<string>, lang: 'en' | 'zh'): string | null {
    let content = `### Module: ${plugin.meta.name}`;
    let hasContent = false;

    // 1. 全局约束
    if (plugin.globalConstraints && plugin.globalConstraints[lang].length > 0) {
      content += `\nConstraints:\n` + plugin.globalConstraints[lang].map(r => `- ${r}`).join('\n');
      hasContent = true;
    }

    // 2. 指令集
    const activeCommands = plugin.commands.filter(cmd => validCmds.has(cmd.name));
    if (activeCommands.length > 0) {
      hasContent = true;
      content += `\nCommands:`;
      activeCommands.forEach(cmd => {
        content += `\n\n- Command: ${cmd.name}(${cmd.params.join(', ')})`;
        content += `\n  Desc: ${cmd.description[lang]}`;
        
        if (cmd.rules[lang].length > 0) {
          content += `\n  Rules:\n    * ${cmd.rules[lang].join('\n    * ')}`;
        }

        if (cmd.examples.length > 0) {
          // 【核心修复】: 
          // 1. 不再压缩换行符
          // 2. 在 AI 输出前强制换行，确保示例代码的缩进在视觉上是正确的
          content += `\n  Example:`;
          cmd.examples.forEach(ex => {
            content += `\n    [User]: ${ex.input}`;
            // 使用缩进块展示代码，让 LLM 学习正确的物理格式
            content += `\n    [AI]:\n${ex.output}`; 
          });
        }
      });
    }

    return hasContent ? content : null;
  }
}