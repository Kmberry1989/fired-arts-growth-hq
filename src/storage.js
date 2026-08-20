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

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function writeUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

function zipDate(date = new Date()) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function makeZip(files) {
  const encoder = new TextEncoder();
  const entries = files.map(({ name, content }) => ({ name: encoder.encode(name), data: encoder.encode(content) }));
  const stamp = zipDate();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  entries.forEach(({ name, data }) => {
    const header = new ArrayBuffer(30 + name.length);
    const view = new DataView(header);
    writeUint32(view, 0, 0x04034b50);
    writeUint16(view, 4, 20);
    writeUint16(view, 6, 0);
    writeUint16(view, 8, 0);
    writeUint16(view, 10, stamp.time);
    writeUint16(view, 12, stamp.date);
    writeUint32(view, 14, crc32(data));
    writeUint32(view, 18, data.length);
    writeUint32(view, 22, data.length);
    writeUint16(view, 26, name.length);
    writeUint16(view, 28, 0);
    new Uint8Array(header, 30).set(name);
    localParts.push(new Uint8Array(header), data);

    const central = new ArrayBuffer(46 + name.length);
    const centralView = new DataView(central);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, stamp.time);
    writeUint16(centralView, 14, stamp.date);
    writeUint32(centralView, 16, crc32(data));
    writeUint32(centralView, 20, data.length);
    writeUint32(centralView, 24, data.length);
    writeUint16(centralView, 28, name.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);
    new Uint8Array(central, 46).set(name);
    centralParts.push(new Uint8Array(central));
    offset += 30 + name.length + data.length;
  });

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new ArrayBuffer(22);
  const endView = new DataView(end);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralSize);
  writeUint32(endView, 16, offset);
  writeUint16(endView, 20, 0);
  return new Blob([...localParts, ...centralParts, new Uint8Array(end)], { type: "application/zip" });
}

export function createWorkspaceZip(files) {
  return makeZip(files);
}

export function exportWorkspaceZip(filename, files) {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(createWorkspaceZip(files));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

export async function copyToClipboard(value) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
}
