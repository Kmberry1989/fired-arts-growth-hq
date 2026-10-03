import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { setPrivateDocument } from "../../api/_lib/firebase-admin-rest.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;
  const owner = await requireOwner(req, res); if (!owner) return;
  try {
    const input = await readJson(req);
    if (!input.prompt?.trim()) return fail(res, 400, "validation_error", "A visual prompt is required.");
    const runId = `ai-${crypto.randomUUID()}`;
    const prompt = `Create an original promotional image concept for Fired Arts Studio in Kokomo, Indiana. ${input.prompt}. Avoid text, logos, fabricated people, prices, dates, or claims. Warm paper, cobalt, terracotta, tactile ceramic studio atmosphere.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: input.aspectRatio || "4:5" } }) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || `Image generation failed (${response.status}).`);
    const prediction = payload.predictions?.[0];
    const bytes = prediction?.bytesBase64Encoded;
    if (!bytes) throw new Error("The image provider returned no image.");
    const data = { runId, model: "imagen-4.0-generate-001", reviewRequired: true, imageDataUrl: `data:${prediction.mimeType || "image/png"};base64,${bytes}` };
    await setPrivateDocument(`workspaces/primary/aiRuns/${runId}`, { id: runId, operation: "generate-image", model: data.model, status: "complete", inputReferences: input.inputReferences || [], createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), actorId: owner.uid });
    return ok(res, data);
  } catch (error) { return fail(res, 502, "image_generation_failed", error.message, true); }
}

