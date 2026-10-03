import { getPrivateDocument, saveConnection } from "./firebase-admin-rest.js";

export async function connection(provider) {
  const record = await getPrivateDocument(`privateWorkspaces/primary/connections/${provider}`);
  if (!record?.access_token) throw new Error(`${provider} is not connected.`);
  return record;
}

export async function refreshGoogleIfNeeded(record) {
  if (!record.refresh_token) return record;
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, refresh_token: record.refresh_token, grant_type: "refresh_token" }) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error_description || "Google authorization expired. Reconnect Google.");
  return { ...record, ...payload, refresh_token: record.refresh_token };
}

export async function providerJson(url, options = {}) {
  const response = await fetch(url, options); const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || payload?.error_description || `Provider request failed (${response.status}).`);
  return payload;
}

