import { getLLMClient } from "./llm";
import type { AgentState } from "./state";
import type { Evaluation } from "./types";

export const evaluator = async (state: AgentState): Promise<Evaluation> => {
  const prompt = `
あなたは厳しい品質評価者です。
エージェントの最終目標に対して、現在の成果物が十分に達成されているか評価してください。

## 最終目標
${state.goal}

## 現在の成果物
${JSON.stringify(state.artifacts)}

## 評価基準
- 目標を完全に達成しているか
- 精度、質に問題はないか
- 不足している要素はないか

`;

const evaluationSchema = {
  name: "evaluation_schema",
  schema: {
    type: "object",
    properties: {
      score: { type: "number" },
      problems: { type: "array", items: { type: "string" } },
      retry: { type: "boolean" }
    },
    required: ["score", "problems", "retry"]
  }
};

console.log(prompt);

  const response = await getLLMClient("openai").generate(prompt, evaluationSchema);
  const text = response.text;

  console.log(`[Evaluator] Evaluated: ${text}`);

  try {
    return JSON.parse(text) as Evaluation;
  } catch (e) {
    console.error("Failed to parse evaluator response:", text);
    return {
      score: 0,
      problems: ["Failed to parse evaluation output"],
      retry: true
    };
  }
}