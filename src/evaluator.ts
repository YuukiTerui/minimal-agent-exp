import type { AgentState } from "./state"
import type { EvaluationProblem, EvaluationResult } from "./types"

export const evaluator = async (
  state: AgentState
): Promise<EvaluationResult> => {
  const problems: EvaluationProblem[] = []
  const summary = state.artifacts.summary

  if (!summary) {
    problems.push({
      type: "missing",
      field: "summary",
      description: "要約が存在しない"
    })
  } else {
    if (summary.points.claims.length === 0) {
      problems.push({
        type: "missing",
        field: "summary.points.claims",
        description: "主張が抽出されていない"
      })
    }
    if (summary.gist.oneSentence.length > 120) {
      problems.push({
        type: "unclear",
        field: "summary.gist.oneSentence",
        description: "一文要約が長すぎる"
      })
    }
  }

  const score = problems.length === 0 ? 0.9 : 0.4

  return {
    score,
    problems,
  }
}
