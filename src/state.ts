import type { Task } from "./types";


export type AgentState = {
    goal: string;
    tasks: Task[];
    currentTaskIndex: number;
    artifacts: Record<string, unknown>;
    issues: string[];
    done: boolean;
}

export const createInitialAgentState = (goal: string, targetArticleUrl: string): AgentState => ({
    goal,
    tasks: [],
    currentTaskIndex: 0,
    artifacts: { targetArticleUrl },
    issues: [],
    done: false,
})
