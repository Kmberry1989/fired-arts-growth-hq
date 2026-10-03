import { aiHandler } from "../../api/_lib/ai-handler.js";

export default aiHandler({
  operation: "draft-outreach",
  required: ["contact", "campaign", "brandVoice"],
  schema: { type: "object", properties: { subject: { type: "string" }, body: { type: "string" }, verificationChecklist: { type: "array", items: { type: "string" } } }, required: ["subject", "body", "verificationChecklist"] },
  buildPrompt: (input) => `Write a concise outreach draft using only this verified contact record and campaign. Contact: ${JSON.stringify(input.contact)}. Campaign: ${JSON.stringify(input.campaign)}. Brand voice: ${input.brandVoice}. Do not infer a person's name, relationship, permission, price, or availability. Put missing facts in verificationChecklist.`,
});

