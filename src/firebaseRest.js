import { useCallback, useEffect, useRef, useState } from "react";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "";
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "";
const ownerEmail = String(import.meta.env.VITE_OWNER_EMAIL || "").toLowerCase();
const SESSION_KEY = "fired-arts-growth-hq:auth:v2";
export const firebaseConfigured = Boolean(apiKey && projectId && storageBucket && ownerEmail);
export const WORKSPACE_ID = "primary";

function authUrl(action) { return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${apiKey}`; }
function firestoreUrl(path = "") { return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`; }

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || body?.error || `Request failed (${response.status})`);
  return body;
}

function readSession() {
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

function saveSession(session) {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

export async function signInOwner(email, password) {
  const result = await jsonRequest(authUrl("signInWithPassword"), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (String(result.email).toLowerCase() !== ownerEmail) throw new Error("This account is not authorized for this workspace.");
  const session = { idToken: result.idToken, refreshToken: result.refreshToken, uid: result.localId, email: result.email, expiresAt: Date.now() + Number(result.expiresIn || 3600) * 1000 };
  saveSession(session);
  return session;
}

async function refreshSession(session) {
  const result = await jsonRequest(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: session.refreshToken }),
  });
  const next = { ...session, idToken: result.id_token, refreshToken: result.refresh_token, expiresAt: Date.now() + Number(result.expires_in || 3600) * 1000 };
  saveSession(next);
  return next;
}

export async function getValidSession() {
  const session = readSession();
  if (!session) return null;
  if (String(session.email).toLowerCase() !== ownerEmail) { saveSession(null); return null; }
  if (session.expiresAt > Date.now() + 60_000) return session;
  try { return await refreshSession(session); } catch { saveSession(null); return null; }
}

export function signOutOwner() { saveSession(null); window.location.reload(); }

function toValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, toValue(item)])) } };
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

function fromDocument(document) {
  const data = Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, fromValue(value)]));
  return { id: data.id || decodeURIComponent(document.name.split("/").pop()), ...data };
}

async function authorizedFetch(url, options = {}) {
  const session = await getValidSession();
  if (!session) throw new Error("Your session expired. Sign in again.");
  return jsonRequest(url, { ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers, Authorization: `Bearer ${session.idToken}` } });
}

export async function listRecords(collectionName) {
  const body = await authorizedFetch(firestoreUrl(`workspaces/${WORKSPACE_ID}/${collectionName}?pageSize=300`));
  return (body.documents || []).map(fromDocument);
}

export async function writeRecord(collectionName, record) {
  if (!record?.id) throw new Error("A record id is required.");
  const path = `workspaces/${WORKSPACE_ID}/${collectionName}/${encodeURIComponent(record.id)}`;
  return authorizedFetch(firestoreUrl(path), { method: "PATCH", body: JSON.stringify({ fields: Object.fromEntries(Object.entries(record).map(([key, value]) => [key, toValue(value)])) }) });
}

export async function deleteRecord(collectionName, id) {
  const session = await getValidSession();
  if (!session) throw new Error("Your session expired. Sign in again.");
  const response = await fetch(firestoreUrl(`workspaces/${WORKSPACE_ID}/${collectionName}/${encodeURIComponent(id)}`), { method: "DELETE", headers: { Authorization: `Bearer ${session.idToken}` } });
  if (!response.ok && response.status !== 404) throw new Error(`Delete failed (${response.status})`);
}

export async function replaceCollection(collectionName, previous, next) {
  const previousIds = new Set(previous.map((item) => item.id));
  const nextIds = new Set(next.map((item) => item.id));
  const removed = [...previousIds].filter((id) => !nextIds.has(id));
  await Promise.all([...next.map((record) => writeRecord(collectionName, record)), ...removed.map((id) => deleteRecord(collectionName, id))]);
}

export function useCloudCollection(collectionName, initial = []) {
  const [value, setValue] = useState(initial);
  const [sync, setSync] = useState({ status: "loading", error: "", lastSyncedAt: "" });
  const valueRef = useRef(initial);
  const load = useCallback(async () => {
    try {
      const records = await listRecords(collectionName);
      valueRef.current = records;
      setValue(records);
      setSync({ status: "synced", error: "", lastSyncedAt: new Date().toISOString() });
    } catch (error) { setSync((current) => ({ ...current, status: "error", error: error.message })); }
  }, [collectionName]);
  useEffect(() => { load(); const onFocus = () => load(); window.addEventListener("focus", onFocus); return () => window.removeEventListener("focus", onFocus); }, [load]);
  const update = useCallback((nextValue) => {
    const previous = valueRef.current;
    const next = typeof nextValue === "function" ? nextValue(previous) : nextValue;
    valueRef.current = next;
    setValue(next);
    setSync((current) => ({ ...current, status: "saving", error: "" }));
    replaceCollection(collectionName, previous, next).then(() => setSync({ status: "synced", error: "", lastSyncedAt: new Date().toISOString() })).catch((error) => {
      window.localStorage.setItem(`fired-arts-recovery:${collectionName}`, JSON.stringify(next));
      setSync((current) => ({ ...current, status: "offline", error: error.message }));
    });
  }, [collectionName]);
  return [value, update, sync, load];
}

export async function uploadAssetFile(file) {
  const session = await getValidSession();
  if (!session) throw new Error("Your session expired. Sign in again.");
  const id = `asset-${crypto.randomUUID()}`;
  const storagePath = `workspaces/${WORKSPACE_ID}/assets/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const response = await fetch(`https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?uploadType=media&name=${encodeURIComponent(storagePath)}`, {
    method: "POST", headers: { Authorization: `Firebase ${session.idToken}`, "Content-Type": file.type || "application/octet-stream" }, body: file,
  });
  const metadata = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(metadata?.error?.message || `Upload failed (${response.status})`);
  const token = metadata.downloadTokens?.split(",")[0];
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(storagePath)}?alt=media${token ? `&token=${token}` : ""}`;
  return { id, schemaVersion: 2, name: file.name, type: "Uploaded image", size: file.size, contentType: file.type, storagePath, downloadUrl, src: downloadUrl, tags: ["uploaded"], createdAt: new Date().toISOString() };
}

export async function callAuthenticatedApi(path, payload = {}, method = "POST") {
  const session = await getValidSession();
  if (!session) throw new Error("Your session expired. Sign in again.");
  return jsonRequest(path, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.idToken}` }, body: method === "GET" ? undefined : JSON.stringify(payload) });
}

