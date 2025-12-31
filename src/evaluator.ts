import type { AgentState } from "./state";
import type { Evaluation } from "./types";

export const evaluator = async (state: AgentState): Promise<Evaluation> => {
    const summary = state.artifacts.summary;
    const score = Math.random() * 100;
    const problems: string[] = [];
    const retry = score < 80;

    if (!summary) {
        problems.push("Summary is not generated");
    }
    return {
        score,
        problems,
        retry,
    }
}