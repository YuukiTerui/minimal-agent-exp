import type { ArticleSummary, Task } from "./types";


export type AgentState = {
    goal: string;
    tasks: Task[];
    currentTaskIndex: number;
    input?: {
        articleText: string;
        meta?: {
            title?: string;
            source?: string;
        }
    }
    artifacts: {
        articleSummary?: ArticleSummary;
    }
    issues: string[];
    done: boolean;
}

export const createInitialAgentState = (goal: string): AgentState => ({
    goal,
    tasks: [],
    currentTaskIndex: 0,
    artifacts: {},
    issues: [],
    done: false,
})
