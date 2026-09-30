import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage, useAuth } from "./auth.jsx";
import { clearStoredWorkspace, readStoredValue, writeStoredValue } from "./storage.js";

// Shared workspace lives under hq/state/{key} in Firestore.
// Only the two owner accounts can read/write (see firestore.rules).
const STATE_DOC = (key) => doc(db, "hq", "state", key);
const WRITE_DEBOUNCE_MS = 800;

function stableStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * useSyncedState — drop-in replacement for the old localStorage-only hook.
 * - Boots instantly from the localStorage cache.
 * - Subscribes to the shared Firestore doc for live updates from the other owner.
 * - Debounces cloud writes; last write wins per key.
 * - First run migrates: existing local data is uploaded, otherwise the seed fallback is.
 * - `toCloud` optionally strips values that must not go to Firestore (e.g. data-URL images).
 */
export function useSyncedState(key, fallback, normalize = (value) => value, toCloud = (value) => value) {
  const { user } = useAuth();
  const normalizeRef = useRef(normalize);
  normalizeRef.current = normalize;
  const toCloudRef = useRef(toCloud);
  toCloudRef.current = toCloud;

  const [value, setValueState] = useState(() => normalizeRef.current(readStoredValue(key, fallback)));
  const valueRef = useRef(value);
  const lastCloudJsonRef = useRef(null);
  const seededRef = useRef(false);
  const writeTimerRef = useRef(null);
  const email = user?.email || null;

  const persistNow = useCallback(
    async (next) => {
      if (!db || !email) return;
      try {
        const cloudValue = toCloudRef.current(next);
        lastCloudJsonRef.current = stableStringify(cloudValue);
        await setDoc(
          STATE_DOC(key),
          { value: cloudValue, updatedAt: serverTimestamp(), updatedBy: email },
          { merge: true }
        );
      } catch (err) {
        console.warn(`[sync] write failed for "${key}":`, err);
      }
    },
    [key, email]
  );

  const scheduleWrite = useCallback(
    (next) => {
      if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
      writeTimerRef.current = setTimeout(() => persistNow(next), WRITE_DEBOUNCE_MS);
    },
    [persistNow]
  );

  const setValue = useCallback(
    (updater) => {
      const next = normalizeRef.current(
        typeof updater === "function" ? updater(valueRef.current) : updater
      );
      valueRef.current = next;
      setValueState(next);
      writeStoredValue(key, next);
      scheduleWrite(next);
    },
    [key, scheduleWrite]
  );

  useEffect(() => {
    if (!db || !email) return;
    const ref = STATE_DOC(key);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          if (!seededRef.current) {
            seededRef.current = true;
            // First run: migrate existing local data if present, otherwise seed.
            const local = readStoredValue(key, undefined);
            const initial = normalizeRef.current(local !== undefined ? local : fallback);
            valueRef.current = initial;
            setValueState(initial);
            writeStoredValue(key, initial);
            persistNow(initial);
          }
          return;
        }
        const remoteJson = stableStringify(snap.data()?.value);
        if (remoteJson === lastCloudJsonRef.current) return; // our own echo
        const remote = normalizeRef.current(snap.data()?.value);
        if (stableStringify(remote) !== stableStringify(valueRef.current)) {
          valueRef.current = remote;
          setValueState(remote);
          writeStoredValue(key, remote);
        }
      },
      (err) => console.warn(`[sync] read failed for "${key}":`, err)
    );
    return () => {
      unsubscribe();
      if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, email]);

  return [value, setValue];
}

/** Per-device UI preferences that should NOT sync between owners. */
export function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => readStoredValue(key, fallback));
  useEffect(() => writeStoredValue(key, value), [key, value]);
  return [value, setValue];
}

// ---------- Asset binaries (Firebase Storage) ----------

function sanitizeFileName(name) {
  return String(name || "image").replace(/[^a-z0-9.\-_]+/gi, "-").slice(0, 80) || "image";
}

export async function uploadAssetFile(file, assetId) {
  if (!storage || !auth?.currentUser) throw new Error("Storage is not available.");
  const path = `hq-assets/${assetId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file, { contentType: file.type || "image/jpeg" });
  return { url: await getDownloadURL(ref), path };
}

export async function uploadDataUrlAsset(dataUrl, assetId, name = "image.jpg") {
  if (!storage || !auth?.currentUser) throw new Error("Storage is not available.");
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const path = `hq-assets/${assetId}/${Date.now()}-${sanitizeFileName(name)}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, blob, { contentType: blob.type || "image/jpeg" });
  return { url: await getDownloadURL(ref), path };
}

export async function deleteAssetFile(path) {
  if (!storage || !path) return;
  try {
    await deleteObject(storageRef(storage, path));
  } catch (err) {
    console.warn("[sync] could not delete asset file:", path, err);
  }
}

/** Strip inline data-URL images before writing to Firestore (1 MiB doc limit). */
export function stripInlineImages(assets) {
  if (!Array.isArray(assets)) return assets;
  return assets.map((asset) =>
    asset && typeof asset.src === "string" && asset.src.startsWith("data:")
      ? { ...asset, src: "" }
      : asset
  );
}

/** Full workspace reset: clears cloud docs, cloud assets, and the local cache. */
export async function resetCloudWorkspace() {
  if (db && auth?.currentUser) {
    try {
      const snap = await getDocs(collection(db, "hq", "state"));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    } catch (err) {
      console.warn("[sync] cloud doc reset failed:", err);
    }
  }
  if (storage && auth?.currentUser) {
    try {
      const root = storageRef(storage, "hq-assets");
      const listed = await listAll(root);
      await Promise.all([
        ...listed.items.map((item) => deleteObject(item).catch(() => {})),
        ...listed.prefixes.map(async (prefix) => {
          const sub = await listAll(prefix).catch(() => null);
          if (sub) await Promise.all(sub.items.map((item) => deleteObject(item).catch(() => {})));
        }),
      ]);
    } catch (err) {
      console.warn("[sync] cloud asset reset failed:", err);
    }
  }
  clearStoredWorkspace();
}
