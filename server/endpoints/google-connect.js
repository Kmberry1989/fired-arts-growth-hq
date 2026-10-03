import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok } from "../../api/_lib/http.js";
import { createState } from "../../api/_lib/oauth.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["POST"])) return;
  const owner = await requireOwner(req, res); if (!owner) return;
  try {
    const redirectUri = `${process.env.APP_ORIGIN}/api/google/callback`;
    const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri, response_type: "code", access_type: "offline", prompt: "consent", include_granted_scopes: "true", scope: "openid email https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.compose", state: createState({ provider: "google", uid: owner.uid }) });
    return ok(res, { authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  } catch (error) { return fail(res, 503, "google_not_configured", error.message); }
}

