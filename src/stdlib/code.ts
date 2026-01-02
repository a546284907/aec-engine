/**
 * src/stdlib/code.ts
 */
import { AECModule } from '../core/types';

export const CodeModule: AECModule = {
  namespace: "SYS_CODE",
  description: "Software engineering and code generation tools",
  keywords: ["GEN_CODE", "CODE_REVIEW", "FIX_CODE"],
  prompts: {
    en: `
[MODULE: SYS_CODE]
Expert coding capabilities. Follow Google Style Guides for the target language.

COMMANDS:
- RUN GEN_CODE(lang, requirements): 
  Generate production-ready code. 
  MUST wrap content in <CODE lang="..."> tags.
  DO NOT use Markdown code blocks (\`\`\`) inside the tag.

- RUN CODE_REVIEW(code_snippet): 
  Analyze code for bugs, security risks, and performance.
  Output JSON format in <REVIEW_RESULT> tags.

- RUN FIX_CODE(code, error_log):
  Rewrite the code based on the error.

XML OUTPUT FORMAT:
<CODE lang="python|js|go...">
... raw code content ...
</CODE>

<REVIEW_RESULT>
{ "score": 80, "issues": ["Syntax error line 5", "Unused variable"] }
</REVIEW_RESULT>
`, zh: `
[模块: SYS_CODE]
专业的编程能力模块。针对目标语言遵循 Google 代码风格指南。

指令集:
- RUN GEN_CODE(lang, requirements): 
  生成可用于生产环境的代码。
  必须将内容包裹在 <CODE lang="..."> 标签中。
  **禁止**在标签内部再使用 Markdown 代码块 (\`\`\`)。

- RUN CODE_REVIEW(code_snippet): 
  分析代码的 Bug、安全风险和性能问题。
  在 <REVIEW_RESULT> 标签中输出 JSON 格式的结果。

XML 输出格式:
<CODE lang="python|js|go...">
... 纯代码内容 ...
</CODE>

<REVIEW_RESULT>
{ "score": 80, "issues": ["第5行语法错误", "未使用的变量"] }
</REVIEW_RESULT>
`
  }
};