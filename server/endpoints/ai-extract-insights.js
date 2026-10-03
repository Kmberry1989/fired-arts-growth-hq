import { aiHandler } from "../../api/_lib/ai-handler.js";

export default aiHandler({
  operation: "extract-insights",
  required: ["sourceText"],
  schema: { type: "object", properties: { themes: { type: "array", items: { type: "string" } }, evidence: { type: "array", items: { type: "object", properties: { quote: { type: "string" }, interpretation: { type: "string" } }, required: ["quote", "interpretation"] } }, actions: { type: "array", items: { type: "string" } }, uncertainty: { type: "array", items: { type: "string" } } }, required: ["themes", "evidence", "actions", "uncertainty"] },
  buildPrompt: (input) => `Analyze only the supplied comments or notes. Every theme must be supported by a short exact quote. Separate observations from interpretations and state uncertainty when the sample is too small. Source text:\n${input.sourceText}`,
});

