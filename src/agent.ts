// runAgent.ts
import { evaluator } from "./evaluator";
import { executor } from "./executor";
import { planner } from "./planner";
import type { AgentState } from "./state";
import type { Task } from "./types";

export async function runAgent(
  initialTask: Task,
  initialState: AgentState,
  maxIterations = 3
): Promise<AgentState> {
  let task: Task | null = initialTask;
  let state = initialState;

  console.log("[Agent] Starting agent");

  while (task && state.iteration < maxIterations) {
    console.log("[Agent] Current task", task);
    console.log("[Agent] Current state", state);
    state = await executor(task, state);

    const evaluation = await evaluator(state);
    state.evaluation = evaluation;

    task = planner(task, state, evaluation);
    state.iteration += 1;
  }

  return state;
}
