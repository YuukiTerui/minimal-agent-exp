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
  return {
    tasks: [
      {
        id: "summarize-article",
        description: "対象記事を構造化して要約する。",
        tool: "summarize",
      },
      {
        id: "evaluate-summary",
        description: "要約の品質を評価する。",
        tool: "evaluate",
      }
    ],
  }
}
