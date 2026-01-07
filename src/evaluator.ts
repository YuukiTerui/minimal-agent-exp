import type { AgentState } from "./state"
import type { Evaluation } from "./types"

export const evaluator = async (
  state: AgentState
): Promise<Evaluation> => {
  const problems: string[] = []
  const summary = state.artifacts.summary

  if (!summary) {
    problems.push("要約が存在しない")
  } else {
    if (summary.points.claims.length === 0) {
      problems.push("主張が抽出されていない")
    }
    if (summary.gist.oneSentence.length > 120) {
      problems.push("一文要約が長すぎる")
    }
  }

  const score = problems.length === 0 ? 0.9 : 0.4

  return {
    score,
    problems,
    retry: score < 0.8,
  }
}
