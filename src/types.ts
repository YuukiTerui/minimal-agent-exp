export type Task = {
    id: string;
    description: string;
    tool: "summarize" | "evaluate" | null;
    constraints?: string[];
}


export type EvaluationProblem = {
  type: "missing" | "unclear" | "hallucination" | "structure";
  field: string; // e.g. "points.evidences"
  description: string;
}

export type EvaluationResult = {
  score: number;
  problems: EvaluationProblem[];
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
