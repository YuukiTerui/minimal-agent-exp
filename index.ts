import { runAgent } from "./src/agent";
import { createInitialAgentState } from "./src/state";

runAgent({
    id: "summarize-article",
    tool: "summarize",
    description: "記事を要約する",
    constraints: []
}, createInitialAgentState("記事を要約する"));