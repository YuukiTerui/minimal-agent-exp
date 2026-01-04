import { evaluator } from "./evaluator";
import { executor } from "./executor";
import { planner } from "./planner";
import { createInitialAgentState } from "./state";

export const runAgent = async () => {
  const targetArticle = "https://zenn.dev/fitness_densuke/articles/2026-01-01-react-hooks-fundamental";
  let state = createInitialAgentState("summarize the article", targetArticle);

  while (!state.done) {

    if (state.tasks.length === 0) {
      console.log("[Agent] Planning...", state);
      const plan = await planner(state);
      console.log("[Agent] Planned", plan);
      state.tasks = plan.tasks;
    }

    console.log("[Agent] Executing...", state);
    const task = state.tasks[state.currentTaskIndex];
    if (!task) {
      state.done = true;
    } else {
      state = await executor(task, state)
    }
    state.currentTaskIndex++;

    if (state.currentTaskIndex >= state.tasks.length) {
      console.log("[Agent] Evaluating...", state);
      const evaluation = await evaluator(state)
      console.log("[Agent] Evaluated", evaluation);
      if (evaluation.retry) {
        state.issues.push(...evaluation.problems)
        state.tasks = []
        state.currentTaskIndex = 0
      } else {
        state.done = true
      }
    }
  }

  console.log("DONE", state.artifacts);

}
