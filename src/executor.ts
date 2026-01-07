import { getLLMClient } from "./llm";
import type { AgentState } from "./state";
import type { ArticleSummary, Task } from "./types";

export const executor = async (
  task: Task,
  state: AgentState
): Promise<AgentState> => {
  if (task.tool !== "summarize") return state;

  if (!state.input?.articleUrl) {
    state.issues.push("記事URLが存在しない");
    return state;
  }

  const prompt = `
あなたは記事要約エンジンです。
以下の記事を読み、指定された JSON Schema に厳密に従って要約してください。

# 記事URL
${state.input.articleUrl}

# 既存の問題点（あれば考慮）
${state.issues.join("\n") || "なし"}

# 注意事項
- 自然文での説明は禁止
- 出力は JSON のみ
- 情報が不足している場合は qualityHints に記載
`;

  const summarySchema = {
    name: "article_summary",
    schema: {
      type: "object",
      properties: {
        meta: {
          type: "object",
          properties: {
            title: { type: "string" },
            source: { type: "string", nullable: true },
            author: { type: "string", nullable: true },
            publishedAt: { type: "string", nullable: true }
          },
          required: ["title"]
        },
        gist: {
          type: "object",
          properties: {
            oneSentence: { type: "string" },
            abstract: { type: "string" }
          },
          required: ["oneSentence", "abstract"]
        },
        points: {
          type: "object",
          properties: {
            claims: { type: "array", items: { type: "string" } },
            evidences: { type: "array", items: { type: "string" } },
            conclusions: { type: "array", items: { type: "string" } }
          },
          required: ["claims", "evidences", "conclusions"]
        },
        structure: {
          type: "object",
          properties: {
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  summary: { type: "string" }
                },
                required: ["heading", "summary"]
              }
            }
          },
          required: ["sections"]
        },
        tags: {
          type: "array",
          items: { type: "string" }
        },
        qualityHints: {
          type: "object",
          nullable: true,
          properties: {
            unclearPoints: {
              type: "array",
              items: { type: "string" }
            },
            missingInfo: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      required: ["meta", "gist", "points", "structure", "tags"]
    }
  };

  const response = await getLLMClient("openai").generate<ArticleSummary>(
    prompt,
    summarySchema
  );

  state.artifacts.summary = response;
  console.log("[Executor] ArticleSummary generated");

  return state;
};
