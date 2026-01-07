import type { ArticleSummary, EvaluationResult, Task } from "./types";


export type AgentState = {
    goal: string;
    tasks: Task[];
    currentTaskIndex: number;
    input?: {
        articleUrl: URL;
        meta?: {
            title?: string;
            source?: string;
        }
    }
    artifacts: {
        summary?: ArticleSummary;
    }
    evaluation?: EvaluationResult;
    issues: string[];
    iteration: number;
    done: boolean;
}

export const createInitialAgentState = (goal: string): AgentState => ({
    goal,
    tasks: [],
    currentTaskIndex: 0,
    input: {
        articleUrl: new URL("https://zenn.dev/fitness_densuke/articles/2026-01-01-react-hooks-fundamental"),
    },
    artifacts: {},
    issues: [],
    iteration: 0,
    done: false,
})
