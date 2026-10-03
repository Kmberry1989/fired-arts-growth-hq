import { verifyState } from "../../api/_lib/oauth.js";
import { saveConnection } from "../../api/_lib/firebase-admin-rest.js";

export default async function handler(req, res) {
  const finish = (result) => { res.statusCode = 302; res.setHeader("Location", `${process.env.APP_ORIGIN}/?connection=${result}`); res.end(); };
  try {
    if (req.query?.error) return finish("google-error");
    verifyState(req.query?.state);
    const redirectUri = `${process.env.APP_ORIGIN}/api/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code: req.query.code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokens.error_description || "Google token exchange failed.");
    const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const profile = await userResponse.json();
    const scopes = String(tokens.scope || "").split(" ").filter(Boolean);
    await saveConnection("google", { ...tokens, provider: "google", accountEmail: profile.email || "", connectedAt: new Date().toISOString() }, { status: "connected", accountLabel: profile.email || "Google account", scopes, lastSyncedAt: new Date().toISOString(), error: "" });
    return finish("google-connected");
  } catch { return finish("google-error"); }
}

