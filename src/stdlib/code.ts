/**
 * src/stdlib/code.ts
 */
import { AECModule } from '../core/types';

export const CodeModule: AECModule = {
  namespace: "SYS_CODE",
  description: "Software engineering and code generation tools",
  keywords: ["GEN_CODE", "CODE_REVIEW", "FIX_CODE"],
  prompt: `
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
`
};