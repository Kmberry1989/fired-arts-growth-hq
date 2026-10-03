export const LIFECYCLE = Object.freeze(["draft", "review", "approved", "scheduled", "handoff", "published", "failed"]);

const transitions = Object.freeze({
  draft: new Set(["review"]),
  review: new Set(["draft", "approved"]),
  approved: new Set(["scheduled", "handoff"]),
  scheduled: new Set(["handoff", "failed"]),
  handoff: new Set(["published", "failed"]),
  published: new Set([]),
  failed: new Set(["draft", "handoff"]),
});

export function canTransition(from, to) {
  return Boolean(transitions[String(from || "").toLowerCase()]?.has(String(to || "").toLowerCase()));
}

export function transitionRecord(record, nextStatus, actorId, detail = "") {
  const current = String(record.status || "draft").toLowerCase();
  const next = String(nextStatus || "").toLowerCase();
  if (!canTransition(current, next)) throw new Error(`Cannot move from ${current} to ${next}.`);
  const occurredAt = new Date().toISOString();
  const activity = { id: `activity-${crypto.randomUUID()}`, actorId, type: `status:${current}->${next}`, occurredAt, detail };
  return { ...record, status: next, updatedAt: occurredAt, history: [...(record.history || []), activity] };
}

