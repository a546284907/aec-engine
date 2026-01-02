/**
 * src/stdlib/index.ts
 */
import { KernelModule } from './kernel';
import { BaseModule } from './base';
import { CodeModule } from './code';
// 未来可以在这里导入 FileModule, WebModule 等

// 导出单独的模块，方便按需引用
export { KernelModule, BaseModule, CodeModule };

// 导出整个标准库列表，供 Linker 遍历
export const StdLibrary = [
  KernelModule, // Kernel 通常单独处理，但放在列表里也没问题，Linker 逻辑中要注意
  BaseModule,
  CodeModule
];