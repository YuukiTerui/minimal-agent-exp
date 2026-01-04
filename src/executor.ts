import { getLLMClient } from "./llm";
import type { AgentState } from "./state";
import type { Task } from "./types";

export const executor = async (task: Task, state: AgentState): Promise<AgentState> => {
  if (task.tool === "generate") {
    const prompt = `
あなたは有能なアシスタントです。以下のタスクを実行してください。
目標: ${state.goal}
タスク内容: ${task.description}
現在の成果物: ${JSON.stringify(state.artifacts)}
過去の課題: ${state.issues.join(", ")}
`;
const executorSchema = {
  name: "executor",
  schema: {
    type: "object",
    properties: {
      text: { type: "string" }
    },
    required: ["text"]
  }
};

    const response = await getLLMClient("openai").generate(prompt, executorSchema);
    state.artifacts.lastResponse = response.text;
    console.log(`[Executor] Generated: ${response.text}`);
  }
  
  return state;
}