/**
 * src/utils.ts
 */

/**
 * 计算两个字符串的 Levenshtein 编辑距离
 * 用于拼写检查
 */
export function levenshtein(a: string, b: string): number {
  const matrix = [];

  // 初始化矩阵
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  // 动态规划计算
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替换
          Math.min(
            matrix[i][j - 1] + 1,   // 插入
            matrix[i - 1][j] + 1    // 删除
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * 在列表中寻找最接近的单词
 */
export function findClosestMatch(target: string, candidates: string[]): string | null {
  let minDistance = Infinity;
  let closest = null;

  for (const candidate of candidates) {
    const distance = levenshtein(target, candidate);
    // 只有当相似度足够高（距离小于3且小于单词长度的一半）时才建议
    if (distance < 3 && distance < target.length / 2) {
      if (distance < minDistance) {
        minDistance = distance;
        closest = candidate;
      }
    }
  }

  return closest;
}