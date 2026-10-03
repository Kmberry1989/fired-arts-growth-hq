import { requireOwner } from "./auth.js";
import { allowMethods, fail, ok, readJson } from "./http.js";
import { generateStructured } from "./gemini.js";
import { setPrivateDocument } from "./firebase-admin-rest.js";

export function aiHandler({ operation, required = [], schema, buildPrompt }) {
  return async function handler(req, res) {
    if (!allowMethods(req, res, ["POST"])) return;
    const owner = await requireOwner(req, res); if (!owner) return;
    try {
      const input = await readJson(req);
      const missing = required.filter((field) => !input[field] || (typeof input[field] === "string" && !input[field].trim()));
      if (missing.length) return fail(res, 400, "validation_error", `Missing required fields: ${missing.join(", ")}.`);
      const runId = `ai-${crypto.randomUUID()}`;
      const createdAt = new Date().toISOString();
      await setPrivateDocument(`workspaces/primary/aiRuns/${runId}`, { id: runId, operation, model: "gemini-2.5-flash", status: "running", inputReferences: input.inputReferences || [], createdAt, actorId: owner.uid }, owner.token);
      try {
        const result = await generateStructured(buildPrompt(input), schema);
        await setPrivateDocument(`workspaces/primary/aiRuns/${runId}`, { id: runId, operation, model: result.model, status: "complete", inputReferences: input.inputReferences || [], output: result.output, createdAt, completedAt: new Date().toISOString(), actorId: owner.uid }, owner.token);
        return ok(res, { runId, model: result.model, reviewRequired: true, output: result.output });
      } catch (error) {
        await setPrivateDocument(`workspaces/primary/aiRuns/${runId}`, { id: runId, operation, model: "gemini-2.5-flash", status: "failed", inputReferences: input.inputReferences || [], error: error.message, createdAt, completedAt: new Date().toISOString(), actorId: owner.uid }, owner.token);
        throw error;
      }
    } catch (error) { return fail(res, 502, "ai_request_failed", error.message, true); }
  };
}
