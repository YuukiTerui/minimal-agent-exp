import type { AgentState } from "./state";
import type { EvaluationResult, Task } from "./types";

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

export const planner = (prevTask: Task, state: AgentState, evaluation: EvaluationResult): Task | null => {
const needsRevision =
    evaluation.score < 80 || evaluation.problems.length > 0;

  if (!needsRevision) {
    return null; // 終了
  }

  const constraints = buildRevisionConstraints(evaluation.problems);

  return {
    id: "summarize-article",
    tool: "summarize",
    description: "評価結果を反映した再要約",
    constraints
  };
}

function buildRevisionConstraints(
  problems: EvaluationResult["problems"]
): string[] {
  return problems.map((p: EvaluationResult["problems"][number]) => {
    switch (p.type) {
      case "missing":
        return `「${p.field}」が欠落しています。必ず補完してください。`;
      case "unclear":
        return `「${p.field}」が曖昧です。より具体的に記述してください。`;
      case "hallucination":
        return `「${p.field}」に事実でない内容があります。記事本文に基づいて修正してください。`;
      case "structure":
        return `「${p.field}」の構造が不正です。Schemaに厳密に従って再生成してください。`;
    }
  });
}