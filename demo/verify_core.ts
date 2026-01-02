/**
 * test/verify_core.ts
 */
import { AECLinker } from '../src/core/linker';

function runTest(testName: string, inputCode: string, expectedModules: string[]) {
  console.log(`\n🧪 测试: ${testName}`);
  console.log(`📝 输入: "${inputCode.replace(/\n/g, ' ')}"`);
  
  const result = AECLinker.compile(inputCode);
  
  // 检查激活的模块是否符合预期
  const isSuccess = expectedModules.every(m => result.activeModules.includes(m)) 
                    && result.activeModules.length === expectedModules.length;

  if (isSuccess) {
    console.log(`✅ 通过! 激活模块: [${result.activeModules.join(', ')}]`);
       // 【新增】打印生成的 Prompt 供调试
    console.log(`\n📄 生成的 System Prompt 预览:`);
    console.log(`---------------------------------------------`);
    console.log(result.systemPrompt); // 直接打印完整 Prompt
    console.log(`---------------------------------------------`);
  } else {
    console.error(`❌ 失败!`);
    console.error(`   预期: [${expectedModules.join(', ')}]`);
    console.error(`   实际: [${result.activeModules.join(', ')}]`);
  }
  
  // 可选：打印 Prompt 预览，看看长什么样
  // console.log("📄 Prompt Preview:", result.systemPrompt.substring(0, 100) + "...");
}

// === 开始测试用例 ===

// 1. 测试纯内核（没有任何指令）
runTest(
  "纯内核测试", 
  "VAR a = 1", 
  ["__KERNEL__"]
);

// 2. 测试基础交互（使用 THINK）
runTest(
  "基础交互测试", 
  "RUN THINK('Plan strategy')", 
  ["__KERNEL__", "STD_BASE"]
);

// 3. 测试编程模块（使用 GEN_CODE）
runTest(
  "编程模块测试", 
  "RUN GEN_CODE('python', 'hello world')", 
  ["__KERNEL__", "SYS_CODE"] // 注意：这里没有 STD_BASE，因为没用到 THINK/REPORT
);

// 4. 测试混合使用（使用 REPORT 和 CODE_REVIEW）
runTest(
  "混合模块测试", 
  `
    RUN CODE_REVIEW(my_code)
    RUN REPORT("Done")
  `, 
  ["__KERNEL__", "STD_BASE", "SYS_CODE"]
);