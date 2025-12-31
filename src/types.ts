export type Task = {
    id: string;
    description: string;
    tool: "generate" | "evaluate" | null;
}

export type Plan = {
  tasks: Task[];
}

export type Evaluate = {
  score: number;
  problems: string[];
  retry: boolean;
}
