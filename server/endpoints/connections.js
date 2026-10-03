import { requireOwner } from "../../api/_lib/auth.js";
import { allowMethods, fail, ok } from "../../api/_lib/http.js";
import { listPublicConnections } from "../../api/_lib/firebase-admin-rest.js";

export default async function handler(req, res) {
  if (!allowMethods(req, res, ["GET"])) return;
  const owner = await requireOwner(req, res); if (!owner) return;
  try { return ok(res, await listPublicConnections()); } catch (error) { return fail(res, 502, "connections_unavailable", error.message, true); }
}

