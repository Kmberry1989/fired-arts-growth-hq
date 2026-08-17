const STORAGE_PREFIX = "fired-arts-growth-hq:v1:";

export function readStoredValue(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // The UI remains usable if storage is unavailable or quota is exceeded.
  }
}

export function exportWorkspaceFile(filename, payload, type = "application/json") {
  if (typeof window === "undefined") return;
  const blob = new Blob([payload], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function copyToClipboard(value) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
}
