/**
 * src/cli.ts
 */
import fs from 'fs';
import path from 'path';
import { Compiler } from './compiler';
import type { AECConfig } from './types';


// 1. 读取用户配置文件 aec.config.js
function loadConfig(): AECConfig {
  const configPath = path.resolve(process.cwd(), 'aec.config.js');
  if (!fs.existsSync(configPath)) {
    console.error('❌ Error: aec.config.js not found in project root.');
    process.exit(1);
  }
  // 动态 require 用户的配置
  return require(configPath);
}

// 2. 主逻辑
function main() {
  const args = process.argv.slice(2);
  if (args[0] !== 'compile') {
    console.log('Usage: aec compile <file.aec>');
    return;
  }

  const inputFile = args[1];
  if (!inputFile) {
    console.error('❌ Error: Please specify an input file.');
    return;
  }

  // 读取 AEC 源码
  const sourceCode = fs.readFileSync(inputFile, 'utf-8');
  
  // 加载配置
  const config = loadConfig();
  console.log(`🔌 Loaded ${config.plugins.length} plugins. Target Lang: ${config.lang}`);

  // 编译
  const compiler = new Compiler(config);
  const systemPrompt = compiler.compile(sourceCode);

  // 输出结果 (实际场景可以写入文件)
  console.log('\n✅ Compiled System Prompt:\n');
  console.log('---------------------------------------------------');
  console.log(systemPrompt);
  console.log('---------------------------------------------------');
}

main();