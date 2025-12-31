import type { AgentState } from "./state";
import type { Task } from "./types";

export const executor = async (task: Task, state: AgentState): Promise<AgentState> => {
  if (task.tool === "generate") {
    state.artifacts.title = "";
    state.artifacts.summary = "";
  }
  
  if (task.tool === "evaluate") {
    if (state.artifacts.summary) {
      const score = 0;
      const problems: string[] = [];
      const retry = false;
      state.artifacts.score = score;
      state.artifacts.problems = problems;
      state.artifacts.retry = retry;
    } else {
      state.issues.push("Summary is not generated");
    }
  } 
    return state;
}