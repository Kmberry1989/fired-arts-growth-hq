# Fired Arts Growth HQ production setup

The application intentionally shows a configuration screen instead of sample operational data when production services are unavailable.

## 1. Firebase

1. Enable Email/Password authentication in the existing Firebase project.
2. Create the single owner user.
3. In Firestore, create `owners/{OWNER_UID}` with `{ "role": "owner" }`. Client rules cannot create this bootstrap record.
4. Deploy `firestore.rules` and `storage.rules` with `firebase deploy --only firestore:rules,storage`.
5. Add the four `VITE_FIREBASE_*`/`VITE_OWNER_EMAIL` values from `.env.example` to Vercel. Firebase web configuration is an identifier, not a server credential; rules provide authorization.

## 2. Server credentials

Add every server-only value in `.env.example` to Vercel. `FIREBASE_SERVICE_ACCOUNT_JSON`, OAuth client secrets, `GEMINI_API_KEY`, and `OAUTH_STATE_SECRET` must never use a `VITE_` prefix.

Generate `OAUTH_STATE_SECRET` as at least 32 random bytes. Configure these exact callback URLs in the provider consoles:

- `https://fired-arts-growth-hq.vercel.app/api/google/callback`
- `https://fired-arts-growth-hq.vercel.app/api/meta/callback`

The Google OAuth client needs Analytics read-only, Calendar events, Gmail compose, OpenID, and email scopes. The Meta app needs `pages_show_list`, `pages_read_engagement`, `read_insights`, and `instagram_basic`; Meta may require app review before non-developer accounts can authorize those scopes.

## 3. First live verification

Sign in as the owner, complete canonical business URLs in Settings, connect Google and Meta, and verify one operation at a time. A provider action is complete only when its API returns an external ID. Research archive records remain source-labeled and are never counted as live campaigns, contacts, or metrics.

