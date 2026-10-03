import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { connection, providerJson, refreshGoogleIfNeeded } from "../../api/_lib/provider.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return; const owner = await requireOwner(req, res); if (!owner) return;
  try { const input = await readJson(req); if (!input.confirmed) return fail(res, 409, "confirmation_required", "Confirm the calendar event before creating it."); if (!input.summary || !input.start || !input.end) return fail(res, 400, "validation_error", "Summary, start, and end are required."); const auth = await refreshGoogleIfNeeded(await connection("google")); const data = await providerJson(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(input.calendarId || "primary")}/events`, { method: "POST", headers: { Authorization: `Bearer ${auth.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ summary: input.summary, description: input.description || "", start: { dateTime: input.start }, end: { dateTime: input.end } }) }); return ok(res, { providerEventId: data.id, providerEventUrl: data.htmlLink, status: data.status }, { confirmedAt: new Date().toISOString() }); } catch (error) { return fail(res, 502, "calendar_create_failed", error.message, true); }
}

