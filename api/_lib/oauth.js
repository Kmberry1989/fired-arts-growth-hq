import crypto from "node:crypto";

const secret = () => process.env.OAUTH_STATE_SECRET || "";
export function createState(payload) {
  if (!secret()) throw new Error("OAUTH_STATE_SECRET is not configured.");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 10 * 60_000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}
export function verifyState(state) {
  const [body, signature] = String(state || "").split(".");
  const expected = crypto.createHmac("sha256", secret()).update(body || "").digest("base64url");
  if (!body || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("Invalid OAuth state.");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp < Date.now()) throw new Error("OAuth state expired.");
  return payload;
}

