/**
 * src/stdlib/base.ts
 */
import { AECModule } from '../core/types';

export const BaseModule: AECModule = {
  namespace: "STD_BASE",
  description: "Standard interaction tools (Thinking, Reporting, Asking)",
  keywords: ["THINK", "REPORT", "ASK"],
  prompt: `
[MODULE: STD_BASE]
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
`
};