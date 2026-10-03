import { verifyState } from "../../api/_lib/oauth.js";
import { saveConnection } from "../../api/_lib/firebase-admin-rest.js";

export default async function handler(req, res) {
  const finish = (result) => { res.statusCode = 302; res.setHeader("Location", `${process.env.APP_ORIGIN}/?connection=${result}`); res.end(); };
  try {
    if (req.query?.error) return finish("meta-error");
    verifyState(req.query?.state);
    const redirectUri = `${process.env.APP_ORIGIN}/api/meta/callback`;
    const tokenUrl = new URL("https://graph.facebook.com/v23.0/oauth/access_token");
    tokenUrl.search = new URLSearchParams({ client_id: process.env.META_APP_ID, client_secret: process.env.META_APP_SECRET, redirect_uri: redirectUri, code: req.query.code }).toString();
    const tokenResponse = await fetch(tokenUrl); const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokens?.error?.message || "Meta token exchange failed.");
    const profileResponse = await fetch(`https://graph.facebook.com/v23.0/me?fields=id,name&access_token=${encodeURIComponent(tokens.access_token)}`);
    const profile = await profileResponse.json();
    await saveConnection("meta", { ...tokens, provider: "meta", accountId: profile.id || "", connectedAt: new Date().toISOString() }, { status: "connected", accountLabel: profile.name || "Meta account", scopes: ["pages_show_list", "pages_read_engagement", "read_insights", "instagram_basic"], lastSyncedAt: new Date().toISOString(), error: "" });
    return finish("meta-connected");
  } catch { return finish("meta-error"); }
}

