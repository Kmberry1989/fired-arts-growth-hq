import { seedCampaigns, seedConversations, outreachTargets } from "./data.js";
import { researchContent, researchMetrics, researchOpportunities, researchSources } from "./researchData.js";

export const ARCHIVE_VERSION = 2;

export function buildResearchArchive() {
  const wrap = (recordType, items, sourceId, evidenceStatus) => items.map((payload) => ({
    id: `archive-${recordType}-${payload.id}`,
    schemaVersion: ARCHIVE_VERSION,
    recordType,
    sourceId: payload.sourceId || sourceId,
    observedAt: payload.date || payload.period || "2026-08",
    evidenceStatus: payload.evidenceStatus || evidenceStatus,
    payload,
    readOnly: true,
  }));
  return [
    ...wrap("campaign", seedCampaigns, "supplied-growth-plan", "Draft only"),
    ...wrap("conversation", seedConversations, "supplied-growth-plan", "Draft only"),
    ...wrap("contact", outreachTargets, "regional-outreach-research", "Needs verification"),
    ...wrap("content", researchContent, "supplied-content-pack", "Draft only"),
    ...wrap("metric", researchMetrics, "supplied-benchmark", "Baseline"),
    ...wrap("opportunity", researchOpportunities, "research-pack", "Hypothesis"),
    ...wrap("source", researchSources, "source-register", "Source only"),
  ];
}
