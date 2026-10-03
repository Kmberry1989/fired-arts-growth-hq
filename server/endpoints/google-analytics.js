import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { connection, providerJson, refreshGoogleIfNeeded } from "../../api/_lib/provider.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return; const owner = await requireOwner(req, res); if (!owner) return;
  try { const input = await readJson(req); const auth = await refreshGoogleIfNeeded(await connection("google")); const property = input.propertyId || process.env.GOOGLE_ANALYTICS_PROPERTY_ID; if (!property) return fail(res, 400, "property_required", "Configure a Google Analytics property ID."); const data = await providerJson(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, { method: "POST", headers: { Authorization: `Bearer ${auth.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ dateRanges: [{ startDate: input.startDate || "30daysAgo", endDate: input.endDate || "today" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "conversions" }], dimensions: [{ name: "date" }] }) }); return ok(res, data, { provider: "google-analytics", confirmedAt: new Date().toISOString() }); } catch (error) { return fail(res, 502, "analytics_failed", error.message, true); }
}

