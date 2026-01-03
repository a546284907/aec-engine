/**
 * src/lexer.ts
 * 简单的词法分析器，用于安全地提取指令
 */

export class Lexer {
  /**
   * 扫描代码，返回所有有效的全大写标识符 (Potential Commands)
   * 自动跳过注释 //... 和字符串 "..."
   */
  static scan(code: string): Set<string> {
    const identifiers = new Set<string>();
    let i = 0;
    const length = code.length;

    while (i < length) {
      const char = code[i];

      // 1. 处理注释 (//)
      if (char === '/' && code[i + 1] === '/') {
        i += 2;
        // 跳过直到行尾
        while (i < length && code[i] !== '\n') i++;
        continue;
      }

      // 2. 处理字符串 ("..." or '...')
      if (char === '"' || char === "'") {
        const quote = char;
        i++; // 跳过起始引号
        while (i < length) {
          if (code[i] === '\\') {
            i += 2; // 跳过转义字符 (e.g., \")
          } else if (code[i] === quote) {
            i++; // 闭合引号，结束字符串
            break;
          } else {
            i++;
          }
        }
        continue;
      }

      // 3. 处理大写标识符 (A-Z_)
      // 只有不在注释和字符串里的才会被捕获
      if (/[A-Z_]/.test(char)) {
        let start = i;
        while (i < length && /[A-Z_0-9]/.test(code[i])) {
          i++;
        }
        const word = code.substring(start, i);
        // 过滤掉单个字母或数字开头的
        if (word.length > 1 && isNaN(Number(word[0]))) {
          identifiers.add(word);
        }
        continue;
      }

      i++;
    }

    return identifiers;
  }
}