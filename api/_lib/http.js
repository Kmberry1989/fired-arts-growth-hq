export function send(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function ok(res, data, meta = {}) { return send(res, 200, { ok: true, data, meta }); }
export function fail(res, status, code, message, retryable = false) { return send(res, status, { ok: false, error: { code, message, retryable } }); }

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new Error("Request body must be valid JSON."); }
}

export function allowMethods(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  fail(res, 405, "method_not_allowed", `Use ${methods.join(" or ")}.`);
  return false;
}

