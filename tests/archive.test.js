import test from "node:test";
import assert from "node:assert/strict";
import { buildResearchArchive, ARCHIVE_VERSION } from "../src/archive.js";

test("research archive preserves provenance and is always read only", () => {
  const archive = buildResearchArchive();
  assert.ok(archive.length > 20);
  for (const record of archive) {
    assert.equal(record.schemaVersion, ARCHIVE_VERSION);
    assert.equal(record.readOnly, true);
    assert.ok(record.sourceId);
    assert.ok(record.evidenceStatus);
  }
});

test("archive records do not masquerade as live records", () => {
  const archive = buildResearchArchive();
  assert.ok(archive.every((record) => record.id.startsWith("archive-")));
  assert.ok(archive.some((record) => record.recordType === "campaign"));
  assert.ok(archive.some((record) => record.evidenceStatus === "Needs verification"));
});

