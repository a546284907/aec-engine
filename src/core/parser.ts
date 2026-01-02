/**
 * src/core/parser.ts
 * 负责解析 AI 返回的混合 XML 内容
 */

export interface ParsedResult {
  thoughts: string[];
  artifacts: Record<string, any>; // 存放提取出的 code, json 等
  raw: string;
}

export class AECParser {
  /**
   * 解析 AI 的输出
   */
  static parse(aiOutput: string): ParsedResult {
    const result: ParsedResult = {
      thoughts: [],
      artifacts: {},
      raw: aiOutput
    };

    let remainingText = aiOutput;

    // 1. 优先提取并移除 <THOUGHT> 标签
    // 避免思考过程中的“假标签”干扰后续解析
    const thoughtRegex = /<THOUGHT>([\s\S]*?)<\/THOUGHT>/g;
    let match;
    while ((match = thoughtRegex.exec(aiOutput)) !== null) {
      result.thoughts.push(match[1].trim());
      // 从剩余文本中剔除这段思考内容（替换为空格以保持位置索引，或者直接删除）
      // 这里简单替换为空字符串，防止重复匹配
      remainingText = remainingText.replace(match[0], '');
    }

    // 2. 解析 <CODE> 标签
    const codeRegex = /<CODE\s+lang=["']([^"']+)["']>([\s\S]*?)<\/CODE>/g;
    while ((match = codeRegex.exec(remainingText)) !== null) {
      // 这里的 match[1] 是 lang, match[2] 是代码内容
      // 我们将其存入 artifacts，支持多个代码块
      if (!result.artifacts.code) result.artifacts.code = [];
      result.artifacts.code.push({
        lang: match[1],
        content: match[2].trim()
      });
    }

    // 3. 解析 <REVIEW_RESULT> (JSON)
    const reviewRegex = /<REVIEW_RESULT>([\s\S]*?)<\/REVIEW_RESULT>/g;
    while ((match = reviewRegex.exec(remainingText)) !== null) {
      try {
        const jsonContent = JSON.parse(match[1].trim());
        result.artifacts.review = jsonContent;
      } catch (e) {
        console.error("解析 REVIEW_RESULT JSON 失败", e);
        result.artifacts.review_error = match[1].trim();
      }
    }

    // 4. 解析 <MSG> (Report)
    const msgRegex = /<MSG>([\s\S]*?)<\/MSG>/g;
    while ((match = msgRegex.exec(remainingText)) !== null) {
      result.artifacts.message = match[1].trim();
    }

    return result;
  }
}