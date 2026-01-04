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
以下の「最終目標」と「対象記事」を確認し、次に行うべきタスクリストを作成してください。

## 最終目標
${state.goal}

## 現在の状況
- 過去の課題: ${state.issues.join(", ") || "なし"}
- 対象記事: ${state.artifacts.targetArticle}

## 制約事項
- 出力はJSON形式で行ってください。
- タスクの tool は "generate" または "evaluate" のいずれか、あるいは tool が不要な場合は null にしてください。
- 簡潔で実行可能な最小限のステップを提案してください。
`;

  const response = await getLLMClient().generate(prompt, true, planSchema);
  const text = response.text;

  console.log(`[Planner] Generated tasks: ${response.text}`);
  
  try {
    return {tasks: JSON.parse(text)} as Plan;
  } catch (e) {
    console.error("Failed to parse planner response:", text);
    throw e;
  }
}
