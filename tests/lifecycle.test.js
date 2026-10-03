import test from "node:test";
import assert from "node:assert/strict";
import { canTransition, transitionRecord } from "../src/lifecycle.js";

test("lifecycle allows only guarded forward transitions", () => {
  assert.equal(canTransition("draft", "review"), true);
  assert.equal(canTransition("draft", "published"), false);
  assert.equal(canTransition("review", "approved"), true);
  assert.equal(canTransition("approved", "published"), false);
  assert.equal(canTransition("handoff", "published"), true);
});

test("transitionRecord records an auditable actor and timestamp", () => {
  const result = transitionRecord({ id: "campaign-1", status: "draft", history: [] }, "review", "owner-1", "Ready for review");
  assert.equal(result.status, "review");
  assert.equal(result.history.length, 1);
  assert.equal(result.history[0].actorId, "owner-1");
  assert.match(result.history[0].type, /draft->review/);
});

test("transitionRecord rejects unconfirmed publishing", () => {
  assert.throws(() => transitionRecord({ status: "approved" }, "published", "owner-1"), /Cannot move/);
});

