import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { connection, providerJson, refreshGoogleIfNeeded } from "../../api/_lib/provider.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return; const owner = await requireOwner(req, res); if (!owner) return;
  try { const input = await readJson(req); if (!input.to || !input.subject || !input.body) return fail(res, 400, "validation_error", "Recipient, subject, and body are required."); const auth = await refreshGoogleIfNeeded(await connection("google")); const raw = Buffer.from(`To: ${input.to}\r\nSubject: ${input.subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${input.body}`).toString("base64url"); const data = await providerJson("https://gmail.googleapis.com/gmail/v1/users/me/drafts", { method: "POST", headers: { Authorization: `Bearer ${auth.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ message: { raw } }) }); return ok(res, { providerDraftId: data.id, messageId: data.message?.id, status: "draft-created" }, { confirmedAt: new Date().toISOString() }); } catch (error) { return fail(res, 502, "gmail_draft_failed", error.message, true); }
}

