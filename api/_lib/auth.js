import { fail } from "./http.js";

export async function requireOwner(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) { fail(res, 401, "missing_token", "Sign in to continue."); return null; }
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const expectedEmail = String(process.env.OWNER_EMAIL || "").toLowerCase();
  if (!apiKey || !expectedEmail) { fail(res, 503, "server_not_configured", "Owner authentication is not configured."); return null; }
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) });
    const payload = await response.json();
    const user = payload.users?.[0];
    if (!response.ok || !user) throw new Error("Invalid or expired session.");
    if (String(user.email).toLowerCase() !== expectedEmail) { fail(res, 403, "owner_required", "This account is not authorized for the workspace."); return null; }
    return { uid: user.localId, email: user.email, token };
  } catch (error) { fail(res, 401, "invalid_token", error.message || "Invalid or expired session."); return null; }
}

