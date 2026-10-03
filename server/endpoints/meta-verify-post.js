import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok, readJson } from "../../api/_lib/http.js";
import { connection, providerJson } from "../../api/_lib/provider.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return; const owner = await requireOwner(req, res); if (!owner) return;
  try { const input = await readJson(req); if (!input.postId) return fail(res, 400, "post_id_required", "A provider post ID is required."); const auth = await connection("meta"); const data = await providerJson(`https://graph.facebook.com/v23.0/${encodeURIComponent(input.postId)}?fields=id,permalink_url,created_time&access_token=${encodeURIComponent(auth.access_token)}`); return ok(res, { providerPostId: data.id, providerPostUrl: data.permalink_url || "", publishedAt: data.created_time || "", verified: true }, { confirmedAt: new Date().toISOString() }); } catch (error) { return fail(res, 404, "post_not_verified", error.message); }
}

