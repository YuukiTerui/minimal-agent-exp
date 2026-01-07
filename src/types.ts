export type Task = {
    id: string;
    description: string;
    tool: "summarize" | "evaluate" | null;
}

export type Plan = {
  tasks: Task[];
}

export type Evaluation = {
  score: number;
  problems: string[];
  retry: boolean;
}

export type ArticleSummary = {
  meta: {
    title: string;
    source?: string;
    author?: string;
    publishedAt?: string;
    url?: string;
  }
  gist: {
    oneSentence: string;
    abstract: string;
    keywords: string[];
  }
  points: {
    claims: string[]
    evidences: string[]
    conclusions: string[]
  }
  structure: {
    sections: {
      heading: string
      summary: string
    }[]
  }
  tags: string[]
  qualityHints?: {
    unclearPoints: string[]
    missingInfo: string[]
  }
}
