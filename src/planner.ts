import { getLLMClient } from "./llm";
import type { AgentState } from "./state";
import type { Plan } from "./types";

const planSchema = {
  name: "plan_schema",
  schema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            description: { type: "string" },
            tool: { type: "string", enum: ["generate", "evaluate", null] },
          },
          required: ["id", "description", "tool"],
        },
      },
    },
    required: ["tasks"],
  },
};

export const planner = async (state: AgentState): Promise<Plan> => {
  const prompt = `
あなたは優秀なプランナーです。
以下の「最終目標」と「現在の状況（過去の課題を含む）」を確認し、次に行うべきタスクリストを作成してください。

## 最終目標
${state.goal}

## 現在の状況
- 過去の課題: ${state.issues.join(", ") || "なし"}
- 現在の成果物: ${JSON.stringify(state.artifacts)}

## 制約事項
- 出力はJSON形式で行ってください。
- タスクの tool は "generate" または "evaluate" のいずれか、あるいは tool が不要な場合は null にしてください。
- 簡潔で実行可能な最小限のステップを提案してください。

## 出力フォーマット
{
  "tasks": [
    { "id": "task-id", "description": "task description", "tool": "generate" | "evaluate" | null }
  ]
}
`;

  const response = await getLLMClient().generate(prompt, true, planSchema);
  const text = response.text;

  console.log(`[Planner] Generated: ${text}`);
  
  try {
    return JSON.parse(text) as Plan;
  } catch (e) {
    console.error("Failed to parse planner response:", text);
    throw e;
  }
}
