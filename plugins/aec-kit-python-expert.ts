/**
 * plugins/aec-kit-python-expert.ts
 * v2.0 - 架构师模式 (Architect Mode)
 * 集成思维链 (CoT) 与最佳实践强制约束
 */
import { AECPlugin } from '../src/types';

export const PythonExpertKit: AECPlugin = {
  meta: {
    name: "aec-kit-python-expert",
    version: "2.0.0",
    category: "KIT",
    description: "Generates Architect-level Python code with design reasoning."
  },

  globalConstraints: {
    zh: [
      // --- 1. 物理排版铁律 (保留以防万一) ---
      "【排版】严格换行，严禁代码压缩，缩进必须为 4 空格。",
      "【排版】Import 必须分行书写，类与函数间保留空行。",
      
      // --- 2. 架构师思维 (v2.0 新增) ---
      "【思维】在生成 `<CODE>` 之前，必须先在 `<THOUGHT>` 标签中进行架构设计。",
      "【选型】总是选择现代、标准、维护性最好的库（如 `pathlib`, `secrets`, `dataclasses`）。",
      "【性能】对于复杂逻辑，必须考虑时间复杂度，并在注释中说明。",
      "【安全】代码必须具备防御性（输入校验、错误处理、资源自动关闭）。",
      
      // --- 3. 语法规范 ---
      "使用 Python 3.10+ 特性（Type Hints, match-case）。",
      "严禁使用 `print`，必须使用 `logging`。",
      "入口必须是 `if __name__ == '__main__':`。"
    ],
    en: [
      "CRITICAL: Physical line breaks and 4-space indent.",
      "MANDATORY: Analyze architecture in <THOUGHT> before <CODE>.",
      "Best Practice: Use modern StdLib (`pathlib`, `dataclasses`).",
      "Security & Performance awareness required."
    ]
  },

  commands: [
    {
      name: "GEN_PY",
      params: ["requirement"],
      description: {
        zh: "生成带有设计思路的生产级 Python 代码。",
        en: "Generate production code with design rationale."
      },
      rules: {
        zh: [
          // 强制思维链结构
          "输出结构必须是：先 `<THOUGHT>` 分析思路，后 `<CODE>` 输出代码。",
          "在 `<THOUGHT>` 中，必须包含：1. 核心逻辑分析 2. 库选型理由 3. 异常处理策略。",
          "代码注释必须解释'Why'（为什么这么写），而不仅仅是'What'。",
          "优先使用 Python 标准库实现，确保脚本的可移植性（零依赖）。"
        ],
        en: [
          "Structure: <THOUGHT> first, then <CODE>.",
          "Thought content: Logic, Lib Choice, Error Strategy.",
          "Comments must explain the 'Why'."
        ]
      },
      // 这里的 Example 是教 AI 如何“思考”的关键
      examples: [
        {
          input: "RUN GEN_PY('多线程下载器')",
          output: `<THOUGHT>
[需求分析]
用户需要一个多线程下载器。关键点在于并发控制、错误重试和进度反馈。

[库选型]
1. concurrent.futures: Python 标准库，比 threading 模块更高级，易于管理线程池。
2. requests: 虽然流行但需要安装。为了"零依赖"最佳实践，这里选择标准库 \`urllib.request\`，或者如果用户允许第三方库则用 requests。假设为了脚本独立性，使用标准库。
3. logging: 必须用于记录下载状态。

[设计模式]
使用"生产者-消费者"模型或简单的线程池映射。考虑到任务简单，ThreadPoolExecutor 是最佳选择。

[安全与健壮性]
1. 网络请求必须设置 timeout，防止挂起。
2. 文件写入操作应具有原子性（先写临时文件，下载完再重命名），防止中断导致文件损坏。
</THOUGHT>

<CODE lang="python">
import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib import request, error
from typing import List, Tuple

# 配置日志：包含时间戳和线程名，方便调试并发问题
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(threadName)s] - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def download_file(url: str, dest_dir: Path, timeout: int = 10) -> str:
    """
    下载单个文件。
    
    Rationale:
    使用 urllib 而非 requests 以保持零依赖。
    实现原子写入：先下载到 .tmp，成功后重命名，避免残留损坏文件。
    """
    filename = url.split('/')[-1]
    temp_path = dest_dir / f"{filename}.tmp"
    final_path = dest_dir / filename
    
    if final_path.exists():
        logger.info(f"跳过已存在文件: {filename}")
        return str(final_path)

    try:
        logger.info(f"开始下载: {url}")
        # 安全性: 设置超时防止无限等待
        with request.urlopen(url, timeout=timeout) as response, open(temp_path, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
            
        # 原子操作: 重命名
        temp_path.rename(final_path)
        logger.info(f"下载完成: {filename}")
        return str(final_path)
        
    except (error.URLError, OSError) as e:
        logger.error(f"下载失败 {url}: {e}")
        if temp_path.exists():
            os.remove(temp_path) # 清理垃圾
        raise # 抛出异常让调用者感知

def main_downloader(urls: List[str], max_workers: int = 4) -> None:
    """
    主控制函数，管理线程池。
    """
    dest = Path("./downloads")
    dest.mkdir(exist_ok=True)
    
    # 性能优化: 使用 Context Manager 自动管理线程池生命周期
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(download_file, url, dest): url for url in urls}
        
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                future.result()
            except Exception:
                logger.error(f"任务最终失败: {url}")

if __name__ == "__main__":
    targets = [
        "https://example.com/file1.zip",
        "https://example.com/image.png"
    ]
    main_downloader(targets)
</CODE>`
        }
      ]
    },
    // GEN_TEST 保持不变...
    {
      name: "GEN_TEST",
      params: ["desc"],
      description: { zh: "生成测试", en: "Gen test" },
      rules: { zh: [], en: [] },
      examples: [] 
    }
  ]
};