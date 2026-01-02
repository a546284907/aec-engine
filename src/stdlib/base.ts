/**
 * src/stdlib/base.ts
 */
import { AECModule } from '../core/types';

export const BaseModule: AECModule = {
  namespace: "STD_BASE",
  description: "Standard interaction tools (Thinking, Reporting, Asking)",
  keywords: ["THINK", "REPORT", "ASK"],
  prompts:{ 
en:`[MODULE: STD_BASE]
This module provides basic cognitive and communication tools.

COMMANDS:
- RUN THINK(goal): 
  Use this to plan before acting. Output reasoning in <THOUGHT> tags.
  
- RUN REPORT(message): 
  Use this to return the FINAL result to the user. Output in <MSG> tags.
  
- RUN ASK(question, options?): 
  Use this when you need user clarification. Output in <ASK> tags.

XML OUTPUT FORMAT:
<THOUGHT>... reasoning steps ...</THOUGHT>
<MSG>... final response to user ...</MSG>
<ASK>... question ...</ASK>
`, zh: `
[模块: STD_BASE]
本模块提供基础的认知与沟通工具。

指令集:
- RUN THINK(goal): 
  在行动前进行规划。将思考过程输出在 <THOUGHT> 标签中。
  
- RUN REPORT(message): 
  向用户汇报最终结果。输出在 <MSG> 标签中。
  
- RUN ASK(question, options?): 
  当需要用户澄清时使用。输出在 <ASK> 标签中。

XML 输出格式:
<THOUGHT>... 思考推理过程 ...</THOUGHT>
<MSG>... 给用户的最终回复 ...</MSG>
<ASK>... 提问内容 ...</ASK>
`}
};