import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok } from "../../api/_lib/http.js";
import { createState } from "../../api/_lib/oauth.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;
  const owner = await requireOwner(req, res); if (!owner) return;
  try {
    const redirectUri = `${process.env.APP_ORIGIN}/api/meta/callback`;
    const params = new URLSearchParams({ client_id: process.env.META_APP_ID, redirect_uri: redirectUri, response_type: "code", scope: "pages_show_list,pages_read_engagement,read_insights,instagram_basic", state: createState({ provider: "meta", uid: owner.uid }) });
    return ok(res, { authorizationUrl: `https://www.facebook.com/v23.0/dialog/oauth?${params}` });
  } catch (error) { return fail(res, 503, "meta_not_configured", error.message); }
}

