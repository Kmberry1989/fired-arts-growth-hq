import crypto from "node:crypto";

let cachedToken = null;
const base64url = (value) => Buffer.from(value).toString("base64url");

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
  return JSON.parse(raw);
}

export async function getGoogleAccessToken() {
  if (cachedToken?.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const account = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(JSON.stringify({ iss: account.client_email, scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/devstorage.full_control", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }))}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), crypto.createPrivateKey(account.private_key)).toString("base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error_description || "Could not authorize the Firebase service account.");
  cachedToken = { value: payload.access_token, expiresAt: Date.now() + Number(payload.expires_in || 3600) * 1000 };
  return cachedToken.value;
}

function toValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toValue(item)])) } };
}

function fromValue(value = {}) {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromValue);
  if ("mapValue" in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, item]) => [key, fromValue(item)]));
  return null;
}

function url(path) { return `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`; }

async function request(path, options = {}, authToken = "") {
  const token = authToken || await getGoogleAccessToken();
  const response = await fetch(url(path), { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `Firestore request failed (${response.status}).`);
  return payload;
}

export async function setPrivateDocument(path, data, authToken = "") {
  return request(path, { method: "PATCH", body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, toValue(value)])) }) }, authToken);
}

export async function getPrivateDocument(path) {
  try { const document = await request(path); return Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, fromValue(value)])); } catch (error) { if (error.message.includes("NOT_FOUND")) return null; throw error; }
}

export async function listPublicConnections() {
  try {
    const payload = await request("workspaces/primary/integrationConnections?pageSize=20");
    return (payload.documents || []).map((document) => ({ id: document.name.split("/").pop(), ...Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, fromValue(value)])) }));
  } catch (error) { if (error.message.includes("NOT_FOUND")) return []; throw error; }
}

export async function saveConnection(provider, privateData, publicData) {
  await Promise.all([
    setPrivateDocument(`privateWorkspaces/primary/connections/${provider}`, privateData),
    setPrivateDocument(`workspaces/primary/integrationConnections/${provider}`, { id: provider, ...publicData }),
  ]);
}
