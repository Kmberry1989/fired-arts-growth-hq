import connections from "../server/endpoints/connections.js";
import critique from "../server/endpoints/ai-critique.js";
import draftOutreach from "../server/endpoints/ai-draft-outreach.js";
import extractInsights from "../server/endpoints/ai-extract-insights.js";
import generateContent from "../server/endpoints/ai-generate-content.js";
import generateImage from "../server/endpoints/ai-generate-image.js";
import researchSummary from "../server/endpoints/ai-research-summary.js";
import googleAnalytics from "../server/endpoints/google-analytics.js";
import googleCalendarEvents from "../server/endpoints/google-calendar-events.js";
import googleCallback from "../server/endpoints/google-callback.js";
import googleConnect from "../server/endpoints/google-connect.js";
import googleGmailDrafts from "../server/endpoints/google-gmail-drafts.js";
import metaCallback from "../server/endpoints/meta-callback.js";
import metaConnect from "../server/endpoints/meta-connect.js";
import metaInsights from "../server/endpoints/meta-insights.js";
import metaVerifyPost from "../server/endpoints/meta-verify-post.js";
import { fail } from "./_lib/http.js";

const routes = {
  "connections": connections,
  "ai/critique": critique,
  "ai/draft-outreach": draftOutreach,
  "ai/extract-insights": extractInsights,
  "ai/generate-content": generateContent,
  "ai/generate-image": generateImage,
  "ai/research-summary": researchSummary,
  "google/analytics": googleAnalytics,
  "google/calendar-events": googleCalendarEvents,
  "google/callback": googleCallback,
  "google/connect": googleConnect,
  "google/gmail-drafts": googleGmailDrafts,
  "meta/callback": metaCallback,
  "meta/connect": metaConnect,
  "meta/insights": metaInsights,
  "meta/verify-post": metaVerifyPost,
};

export default async function handler(req, res) {
  const capturedPath = req.query.path || req.query["...path"] || req.query["[...path]"] || "";
  const queryPath = Array.isArray(capturedPath) ? capturedPath.join("/") : String(capturedPath);
  const originalUrl = req.headers["x-vercel-original-url"] || req.headers["x-vercel-original-path"] || req.url;
  const requestPath = new URL(originalUrl, "https://growth-hq.invalid").pathname.replace(/^\/api\//, "").replace(/\/$/, "");
  const rawPath = queryPath || requestPath;
  const route = routes[rawPath];
  if (!route) return fail(res, 404, "not_found", "This API endpoint does not exist.");
  return route(req, res);
}
