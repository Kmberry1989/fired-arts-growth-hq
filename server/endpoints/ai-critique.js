import { aiHandler } from "../../api/_lib/ai-handler.js";

export default aiHandler({
  operation: "critique",
  required: ["postText", "brandVoice"],
  schema: { type: "object", properties: { score: { type: "integer", minimum: 1, maximum: 10 }, critique: { type: "string" }, reconstructedPost: { type: "string" }, unsupportedClaims: { type: "array", items: { type: "string" } } }, required: ["score", "critique", "reconstructedPost", "unsupportedClaims"] },
  buildPrompt: (input) => `Critique this Fired Arts draft for clarity, specificity, accessibility, a truthful call to action, and the brand voice (${input.brandVoice}). Do not add facts that are not in the draft or media description. Draft: ${input.postText}. Media description: ${input.mediaDescription || "None provided"}. Identify unsupported claims separately.`,
});

