import { aiHandler } from "../../api/_lib/ai-handler.js";

export default aiHandler({
  operation: "generate-content",
  required: ["title", "description", "audience", "platform", "brandVoice"],
  schema: { type: "object", properties: { hook: { type: "string" }, caption: { type: "string" }, cta: { type: "string" }, hashtags: { type: "array", items: { type: "string" } }, factualCautions: { type: "array", items: { type: "string" } } }, required: ["hook", "caption", "cta", "hashtags", "factualCautions"] },
  buildPrompt: (input) => `You create accurate marketing drafts for Fired Arts Studio in Kokomo, Indiana. Brand voice: ${input.brandVoice}. Platform: ${input.platform}. Audience: ${input.audience}. Title: ${input.title}. User-provided description: ${input.description}. Use only these facts. Never invent prices, dates, availability, URLs, testimonials, or outcomes. Return a useful draft and list any factual cautions.`,
});

