// [任务分析]
// 用户需要创建一个名为 `aec-kit-node-expert` 的 AEC 插件。
// 该插件定位为 Node.js 顶级专家，核心要求是：结构严谨（架构化）、运行效率高（非阻塞、高性能）、健壮性强。

// [逻辑补全与最佳实践]
// 1. **异步控制**：强制使用 `async/await` 并配合完善的 `try-catch` 块；严禁阻塞事件循环的操作。
// 2. **内存管理**：对于文件或网络操作，强制使用 `Stream` 接口以应对高并发和大数据量，并强调背压（Backpressure）处理。
// 3. **性能优化**：推荐使用 `Worker Threads` 处理 CPU 密集型任务，使用 `Fastify` 等高性能框架思路。
// 4. **代码规范**：注入物理排版约束（4空格、严禁压缩），强制执行 `Architect Mode`。

// [示例设计]
// 设计一个“高性能文件流处理”的示例，展示如何利用 Node.js 的异步迭代器（Async Iterators）和管道（Pipeline）来实现高效的文件内容过滤。


import { AECPlugin } from '../src/types';

export const NodeExpertPlugin: AECPlugin = {
    meta: {
        name: "aec-kit-node-expert",
        version: "1.0.0",
        category: "KIT",
        description: "Node.js 顶级专家插件。专注于高并发、流式处理及企业级架构。"
    },
    globalConstraints: {
        zh: [
            "【物理排版】必须使用 4 个空格缩进，严禁代码压缩，每行仅限一条语句。",
            "【异步架构】严禁使用同步阻塞方法（如 fs.readFileSync），必须使用 Promise/async-await。",
            "【内存管理】处理大数据或文件时，必须优先使用 Stream 或 Buffer 池，防止内存溢出。",
            "【思维强制】在输出代码前，必须通过 <THOUGHT> 标签进行架构方案、性能损耗及边界条件的分析。",
            "【模块规范】优先使用 ESM (import/export)，代码必须模块化且职责单一。"
        ],
        en: [
            "Indent with 4 spaces. No code compression.",
            "Always use async/await over synchronous calls or callbacks.",
            "Use Streams for file/network I/O to ensure performance.",
            "Mandatory <THOUGHT> block for architectural analysis before coding.",
            "Prefer ESM and ensure Single Responsibility Principle."
        ]
    },
    commands: [
        {
            name: "GEN_NODE",
            params: ["requirement"],
            description: { 
                zh: "生成高性能、工业级的 Node.js 后端代码", 
                en: "Generate high-performance, industrial-grade Node.js code." 
            },
            rules: { 
                zh: [
                    "必须包含完善的错误处理（Error Boundary）。",
                    "复杂的业务逻辑必须封装在类（Class）或独立的服务层中。",
                    "代码注释需说明异步操作的并发策略。"
                ], 
                en: [
                    "Implement comprehensive error handling.",
                    "Encapsulate business logic in Service layers.",
                    "Comment on concurrency strategies."
                ]
            },
            examples: [
                {
                    input: "RUN GEN_NODE('编写一个高效的文件转换工具，将大 JSONL 文件逐行转换为 CSV 格式')",
                    output: `<THOUGHT>
[架构设计]
1. 输入/输出：由于是“大文件”，直接读取到内存会导致 OOM。必须采用 Stream 模式。
2. 转换逻辑：使用异步迭代器（for await...of）读取源流，逐行解析 JSON。
3. 背压（Backpressure）：使用 stream.pipeline 自动管理流的速度，防止内存积压。
4. 性能：CSV 的写入采用 Buffer 累积或逐行 Flush 策略。

[异常处理]
- 捕获无效的 JSON 格式行，记录错误但不中断整体转换。
- 处理磁盘空间不足或权限导致的写入失败。
</THOUGHT>
<CODE lang="typescript">
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createInterface } from 'node:readline';

/**
 * 文件转换服务：JSONL 转 CSV
 * 采用流式处理确保极低的内存占用
 */
export class FileConverterService {
    async convertJsonlToCsv(inputPath: string, outputPath: string): Promise<void> {
        const source = createReadStream(inputPath);
        const destination = createWriteStream(outputPath);
        
        // 使用 readline 接口配合异步迭代器处理大文件行
        const rl = createInterface({
            input: source,
            crlfDelay: Infinity
        });

        async function* transform() {
            let isHeaderWritten = false;
            
            for await (const line of rl) {
                if (!line.trim()) continue;
                
                try {
                    const obj = JSON.parse(line);
                    
                    // 动态生成标题行
                    if (!isHeaderWritten) {
                        yield Object.keys(obj).join(',') + '\\n';
                        isHeaderWritten = true;
                    }
                    
                    yield Object.values(obj).join(',') + '\\n';
                } catch (err) {
                    process.stderr.write(\`跳过无效行: \${err.message}\\n\`);
                }
            }
        }

        try {
            // 使用 pipeline 自动处理背压和错误关闭
            await pipeline(transform, destination);
            console.log('转换任务圆满完成');
        } catch (error) {
            console.error('转换过程中发生致命错误:', error);
            throw error;
        }
    }
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
    const service = new FileConverterService();
    service.convertJsonlToCsv('./data.jsonl', './output.csv');
}
</CODE>`
                }
            ]
        }
    ]
};
