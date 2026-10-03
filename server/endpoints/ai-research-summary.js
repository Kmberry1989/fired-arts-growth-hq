import { aiHandler } from "../../api/_lib/ai-handler.js";

export default aiHandler({
  operation: "research-summary",
  required: ["sources"],
  schema: { type: "object", properties: { summary: { type: "string" }, findings: { type: "array", items: { type: "object", properties: { claim: { type: "string" }, sourceIds: { type: "array", items: { type: "string" } }, confidence: { type: "string", enum: ["low", "medium", "high"] } }, required: ["claim", "sourceIds", "confidence"] } }, cautions: { type: "array", items: { type: "string" } } }, required: ["summary", "findings", "cautions"] },
  buildPrompt: (input) => `Summarize the supplied source excerpts without treating hypotheses or AI transcripts as verified facts. Cite source IDs for every finding and state confidence. Sources: ${JSON.stringify(input.sources)}`,
});

