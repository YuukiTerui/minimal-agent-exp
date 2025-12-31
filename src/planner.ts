import type { AgentState } from "./state";
import type { Plan } from "./types";


export const planner = async (state: AgentState): Promise<Plan> => {
  // TODO: call LLM API
    return {
        tasks: [
          {
            id: "summarize-article",
            description: "Summarize the article",
            tool: "generate",
          },
          {
            id: "evaluate-article-summary",
            description: "Evaluate the article summary",
            tool: "evaluate",
          },
      ],
    }
}
