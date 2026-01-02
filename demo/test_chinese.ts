import { AECLinker } from '../src/core/linker';

const userCode = `
RUN THINK("如何用Node.js读取文件")
RUN GEN_CODE("typescript", "读取 data.txt")
`;

// Explicitly requesting Chinese ('zh')
console.log("正在编译中文 Prompt...");
const result = AECLinker.compile(userCode, 'zh');

console.log("------------------------------------------------");
console.log(result.systemPrompt);
console.log("------------------------------------------------");