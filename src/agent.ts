import { evaluator } from "./evaluator";
import { executor } from "./executor";
import { planner } from "./planner";
import { createInitialAgentState } from "./state";

const runAgent = async () => {
  let state = createInitialAgentState("summarize the article");

  while (!state.done) {
    if (state.tasks.length === 0) {
      const plan = await planner(state);
      state.tasks = plan.tasks;
    }

    const task = state.tasks[state.currentTaskIndex++];
    if (!task) {
      state.done = true;
    } else {
      state = await executor(task, state)
    }

    if (state.currentTaskIndex >= state.tasks.length) {
      const evaluation = await evaluator(state)
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

runAgent();
