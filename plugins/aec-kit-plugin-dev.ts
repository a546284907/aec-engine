/**
 * plugins/aec-kit-plugin-dev.ts
 * 元插件：用于生成其他 AEC 插件的工具
 */
import { AECPlugin } from '../src/types';

export const PluginDevKit: AECPlugin = {
  meta: {
    name: "aec-kit-plugin-dev",
    version: "1.0.0",
    category: "KIT",
    description: "Meta-tool: Generates high-quality AEC Plugins from simple descriptions."
  },

  globalConstraints: {
    zh: [
      "生成的 TypeScript 代码必须严格符合 `src/types.ts` 中的 `AECPlugin` 接口定义。",
      "自动注入通用的'物理排版约束'（如缩进4空格、禁止压缩代码）到新插件的 globalConstraints 中。",
      "生成的插件必须包含 'Architect Mode' (架构师模式) 的要求，即强制 `<THOUGHT>`。",
      "必须为新插件编写至少一个复杂的 Few-Shot 示例 (Example)，展示其核心能力。"
    ],
    en: [
      "Generated code must match `AECPlugin` interface.",
      "Inject physical formatting constraints automatically.",
      "Inject 'Architect Mode' constraints (<THOUGHT> required).",
      "Create complex few-shot examples."
    ]
  },

  commands: [
    {
      name: "GEN_PLUGIN",
      params: ["plugin_name", "capability_description"],
      description: {
        zh: "根据描述生成一个完整的 AEC 插件代码文件 (.ts)。",
        en: "Generate a full AEC Plugin typescript file from description."
      },
      rules: {
        zh: [
          "输出格式：必须包裹在 `<CODE lang='typescript'>` 中。",
          "引用路径：假设 `types` 在 `../src/types`。",
          "示例编写：在生成的插件代码中，`examples` 字段里的 `output` 必须包含 `<THOUGHT>` 和 `<CODE>` 的完整演示。",
          "智能扩展：根据用户的简单描述（如'SQL优化'），自动补全相关的'Best Practices'（如'禁止 SELECT *'）到约束中。"
        ],
        en: [
          "Output in <CODE lang='typescript'>.",
          "Import from '../src/types'.",
          "Generated examples must include <THOUGHT> and <CODE>."
        ]
      },
      examples: [
        {
          input: "RUN GEN_PLUGIN('aec-kit-sql', 'SQL专家，擅长性能优化和反注入')",
          output: `<THOUGHT>
[任务分析]
用户需要一个 SQL 专家插件。
核心能力：SQL 生成、查询优化、安全性（防止注入）。
通用约束：需要注入物理排版约束。
特定约束：禁止 SELECT *，强制使用参数化查询，强制 EXPLAIN 分析。

[示例设计]
需要编写一个示例，展示用户输入“查询用户订单”，AI 输出带有索引建议和安全查询的代码。
</THOUGHT>

<CODE lang="typescript">
import { AECPlugin } from '../src/types';

export const SqlExpertKit: AECPlugin = {
  meta: {
    name: "aec-kit-sql",
    version: "1.0.0",
    category: "KIT",
    description: "SQL Expert focused on performance and security."
  },
  globalConstraints: {
    zh: [
      "【排版】SQL 关键字必须大写 (SELECT, FROM)，每行一个子句。",
      "【安全】严禁拼接字符串，必须使用参数化查询 (?) 或 ORM 绑定。",
      "【性能】严禁使用 SELECT *，必须明确字段名。",
      "【思维】在写 SQL 前，必须分析索引命中情况。"
    ],
    en: ["Keywords UPPERCASE.", "No SELECT *.", "Use parameterized queries."]
  },
  commands: [
    {
      name: "GEN_SQL",
      params: ["requirement"],
      description: { zh: "生成高性能 SQL", en: "Gen SQL" },
      rules: { zh: ["先分析索引，再写 SQL"], en: ["Analyze index first"] },
      examples: [
        {
          input: "RUN GEN_SQL('查询大额订单')",
          output: \`<THOUGHT>
[索引分析]
查询涉及 amount 字段，建议在 orders(amount) 上建立索引。
为了防止全表扫描，添加 LIMIT。
</THOUGHT>
<CODE lang="sql">
SELECT id, user_id, amount, created_at
FROM orders
WHERE amount > 1000
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 100;
</CODE>\`
        }
      ]
    }
  ]
};
</CODE>`
        }
      ]
    }
  ]
};