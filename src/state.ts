import type { Task } from "./types";


export type AgentState = {
    goal: string;
    tasks: Task[];
    currentTaskIndex: number;
    artifacts: Record<string, unknown>;
    issues: string[];
    done: boolean;
}

export const createInitialAgentState = (goal: string, targetArticle: string): AgentState => ({
    goal,
    tasks: [],
    currentTaskIndex: 0,
    artifacts: { targetArticle },
    issues: [],
    done: false,
})
