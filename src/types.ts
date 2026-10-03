export type LifecycleStatus = "draft" | "review" | "approved" | "scheduled" | "handoff" | "published" | "failed";

export interface WorkspaceSettings { schemaVersion: 2; workspaceId: string; businessName: string; location: string; websiteUrl: string; bookingUrl: string; contactUrl: string; brandVoice: string; onboardingComplete: boolean; }
export interface ContentVariant { id: string; platform: string; hook: string; caption: string; cta: string; hashtags: string; destinationUrl: string; assetIds: string[]; status: LifecycleStatus; scheduledAt?: string; providerPostId?: string; providerPostUrl?: string; }
export interface Campaign { id: string; schemaVersion: 2; title: string; objective: string; audience: string; status: LifecycleStatus; variants: Record<string, ContentVariant>; createdAt: string; updatedAt: string; }
export interface Contact { id: string; schemaVersion: 2; name: string; email?: string; phone?: string; verificationStatus: "unverified" | "verified"; notes?: string; }
export interface Activity { id: string; actorId: string; type: string; occurredAt: string; providerId?: string; detail?: string; }
export interface Conversation { id: string; schemaVersion: 2; contactId: string; campaignId?: string; status: "draft" | "handoff" | "sent" | "replied" | "won" | "paused"; messageDraft: string; activities: Activity[]; }
export interface Asset { id: string; schemaVersion: 2; name: string; storagePath: string; downloadUrl: string; contentType: string; size: number; tags: string[]; createdAt: string; }
export interface Approval { id: string; campaignId: string; status: "requested" | "approved" | "rejected"; actorId: string; createdAt: string; }
export interface Metric { id: string; source: "google-analytics" | "meta" | "manual"; name: string; value: number; periodStart: string; periodEnd: string; syncedAt: string; providerId?: string; }
export interface ArchiveRecord { id: string; schemaVersion: 2; recordType: string; sourceId: string; observedAt?: string; evidenceStatus: string; payload: unknown; readOnly: true; }
export interface IntegrationConnection { id: "google" | "meta"; status: "disconnected" | "connected" | "error"; accountLabel?: string; scopes: string[]; lastSyncedAt?: string; error?: string; }
export interface AiRun { id: string; operation: string; model: string; status: "running" | "complete" | "failed"; inputReferences: string[]; output?: unknown; error?: string; createdAt: string; completedAt?: string; }

