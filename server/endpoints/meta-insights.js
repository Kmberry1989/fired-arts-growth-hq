import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { connection, providerJson } from "../../api/_lib/provider.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return; const owner = await requireOwner(req, res); if (!owner) return;
  try { const input = await readJson(req); if (!input.objectId) return fail(res, 400, "object_required", "Choose a connected Facebook Page or Instagram account."); const auth = await connection("meta"); const params = new URLSearchParams({ metric: input.metrics?.join(",") || "page_impressions,page_engaged_users", period: input.period || "day", access_token: auth.access_token }); const data = await providerJson(`https://graph.facebook.com/v23.0/${encodeURIComponent(input.objectId)}/insights?${params}`); return ok(res, data, { provider: "meta", confirmedAt: new Date().toISOString() }); } catch (error) { return fail(res, 502, "meta_insights_failed", error.message, true); }
}

