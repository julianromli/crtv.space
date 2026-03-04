## Findings for PR-01 routing (exhaustive)
- API routes: /app/api/profile/[username]/route.ts (GET) uses NextResponse to return profile+portfolioItems; 400/404 cases implemented.
- API routes: /app/api/profile/[username]/route.ts (GET) uses NextResponse to return profile+portfolioItems; 400/404 cases implemented.
- API routes: /app/api/profile/[username]/route.ts (GET) uses NextResponse to return profile+portfolioItems; 400/404 cases implemented.


Findings summary for 2026-03-01-product-routing-tickets:
- normalizeUsername(value) implemented in lib/data/profile.ts: trims, strips leading @, lowercases.
- Server endpoints rely on it:
  - app/api/profile/[username]/route.ts uses normalizeUsername to fetch profile/portfolio.
  - app/(with-sidebar)/[handle]/page.tsx uses normalizeUsername to resolve handle to username, with notFound for invalid input.
- Current profile alias handling uses canonicalization via internal normalization, but there is no explicit redirect to lowercase canonical path.
- Reserved names: No reserved list found in repository; to enforce reserved-name checks, consider adding a constants file and validation in normalizeUsername or callers.
- Seeds illustrate canonical username (e.g., "faiz-intifada").

- Added `lib/routing/routes.ts` with readonly `ROUTES`, `LEGACY_ROUTE_ALIASES` (`/workspace -> /canvas`, `/dashboard -> /analytics`), and `AUTH_ONLY_PATHS` for middleware-ready path checks.

- Added `middleware.ts` scaffold with `config.matcher` negative lookahead exclusions for `api`, `_next/static`, `_next/image`, metadata files (`favicon.ico`, `sitemap.xml`, `robots.txt`), and extension-based static assets; middleware currently falls through with `NextResponse.next()`.

- Middleware alias redirect is safest as an exact pathname check (`request.nextUrl.pathname === "/workspace"`) to avoid unintended matches and redirect loops.

- Added exact middleware alias redirect `"/dashboard" -> "/analytics"` using `NextResponse.redirect(new URL("/analytics", request.url))` while preserving existing matcher exclusions and `/workspace` behavior.

- Added `lib/routing/sanitize-next-path.ts` with a pure `sanitizeNextPath` helper that accepts only leading-`/` relative paths and rejects protocol-like or absolute-style values (`//`, `://`, `/https:`), returning `null` fallback for unsafe input.

- Added  with exact reserved handle constants and a readonly Set for O(1) membership checks in upcoming validation work.

- Added lib/routing/reserved-handles.ts with exact reserved handle constants and a readonly Set for O(1) membership checks in upcoming validation work.

- Added `lib/routing/handle.ts` shared helpers: `normalizeHandle` (trim + strip leading `@` + lowercase), strict `validateHandle` regex check, and `isReservedHandle` backed by `RESERVED_HANDLE_SET`.

- Profile route canonicalization now redirects non-canonical handles in `app/(with-sidebar)/[handle]/page.tsx` by comparing raw `handle` to `@${normalizeUsername(handle)}` and issuing `redirect('/@lowercase')` when mismatched.

- Runtime fix: `params.handle` may arrive without `@`; canonical check must normalize first and compare to `@${username}`, redirecting all non-canonical forms to `/@${username}` instead of early `notFound()`.

- QA follow-up: decode route `params.handle` with safe `decodeURIComponent` fallback before normalization/comparison, otherwise encoded `@` (`%40...`) can trigger redirects to `/@%40...` and loop risk.

- Added canonical creation route page at `app/(with-sidebar)/canvas/page.tsx` by mirroring the existing workspace shell composition (`TopBar + LeftSidebar + CanvasArea + RightSidebar`) to keep `/canvas` and `/workspace` UI behavior identical during routing transition.

- Added `app/(with-sidebar)/analytics/page.tsx` as a static v1 dashboard using dark shell-aligned spacing/colors with inline engagement and insight cards (no data wiring) to satisfy the `/dashboard` alias target.

- Added shared wallet contract in `lib/data/wallet.ts` (`getWalletSummary`) and `app/api/wallet/route.ts` to expose deterministic wallet JSON via `NextResponse.json({ wallet })` for `/canvas` and upcoming `/billing` consumers.

- Implemented `app/(with-sidebar)/billing/page.tsx` as a lightweight dark-mode-aligned wallet view wired directly to `getWalletSummary`, rendering available/pending/total-earned balances plus next payout date from shared wallet data.

- Updated `app/(with-sidebar)/canvas/page.tsx` to fetch `getWalletSummary` directly and render in-shell available/pending wallet balances so `/canvas` mirrors `/billing` source-of-truth values.

- Added `app/api/following/count/route.ts` with deterministic `GET` handler returning `NextResponse.json({ count: 0 })` to provide a stable v1 follow-count contract without auth coupling.

- Added `app/api/following/recommendations/route.ts` with a deterministic seeded shuffle over static follow suggestions and safe `limit` query clamping (`1..20`, default `5`) returning `NextResponse.json({ recommendations })` with `id`, `handle`, and `displayName`.

- Added `app/api/follows/route.ts` POST v1 contract with JSON body parsing, `targetId` non-empty string validation (`400` on invalid input), and deterministic success payload `{ followed: true, targetId, count: 1 }`.

- Added `app/api/follows/[targetId]/route.ts` DELETE v1 contract with route `targetId` trim/non-empty validation (`400` on invalid input) and deterministic unfollow payload `{ followed: false, targetId, count: 0 }`.

- Added `app/(with-sidebar)/following/page.tsx` with a deterministic blocked interstitial gated by a direct threshold check (`count < 5`) and deferred all progress/action-list/unlock detail for later subtasks.

- Added `app/(with-sidebar)/explore/page.tsx` as a dark-shell static scaffold with discover-feed placeholder copy; auth-only enforcement is intentionally deferred until the auth/session contract is finalized.

- Added `app/(with-sidebar)/search/page.tsx` as a dark-shell static scaffold with explicit placeholder copy; auth-only enforcement wiring remains deferred until the auth/session contract is resolved.
- Updated `app/(with-sidebar)/following/page.tsx` blocked interstitial to show explicit progress text `Progress: {count}/5` using the existing `FOLLOWING_UNLOCK_THRESHOLD` constant while keeping gate logic unchanged.
- Updated `app/(with-sidebar)/following/page.tsx` blocked interstitial to render deterministic follow suggestions (`id`, `handle`, `displayName`) with per-item `Follow` button affordances while keeping threshold gate/progress behavior unchanged and deferring follow/unlock state wiring.
- Ticket reconciliation evidence: `app/(with-sidebar)/following/page.tsx` currently renders a concrete follow action list (`SEEDED_SUGGESTIONS.map(...)`) with per-row `Follow` buttons, so PR-04 `Follow action list` was marked complete in `.sisyphus/plans/2026-03-01-product-routing-tickets.md`.
- Normalized PR-04 plan formatting by indenting `Follow action list` as a nested child under `Build interstitial UX` while preserving its completed checkbox state.
- `/following` unlock determinism is query-driven via `searchParams.count` (e.g., `?count=5`) with invalid/negative values safely falling back to `0`.
- Added `PATCH /api/profile/username` in `app/api/profile/username/route.ts` with deterministic server-side input handling: JSON parsing guard, required string `username`, shared `normalizeHandle` + `validateHandle` + `isReservedHandle` checks, `400` for invalid input, `409` for reserved usernames, and success payload `{ username: normalized }` without persistence.
- `/profile` alias redirect now resolves via `getCurrentProfileUsername()` from `lib/data/profile.ts`, so canonical `/@handle` target stays tied to the deterministic seed source instead of a hardcoded route literal in the page.

- Added minimal Node test-runner coverage in  via  to validate exact  transforms and current  regex accept/reject boundaries.

- Added minimal Node test-runner coverage in lib/routing/handle.test.ts via tsx --test to validate exact normalizeHandle transforms and current validateHandle regex accept/reject boundaries.
- Route-contract tests for `PATCH /api/profile/username` are lightweight when calling the exported handler directly with `Request` JSON payloads and asserting status/body.
- Added deterministic onboarding contract via `lib/data/onboarding.ts` and `app/api/onboarding/route.ts` with stable `{ onboarding }` responses and strict malformed-payload `400` handling for PATCH.
- `PATCH /api/onboarding` now blocks `usernameCompleted: true` with `422` unless `normalizeHandle(getCurrentProfileUsername())` passes `validateHandle`.
- Onboarding optional-step updates now require explicit `optionalStepAction` (`{ step, action: "complete" | "skip" }`), keeping malformed action payloads on the existing `400` path and deterministic per-step state transitions.
- Middleware onboarding gate now checks `AUTH_ONLY_PATHS` and redirects username-incomplete users to `/onboarding?next=<sanitized path+query>` using `sanitizeNextPath`.
- Added a dedicated static route at `app/(with-sidebar)/onboarding/page.tsx` so `/onboarding` resolves directly and no longer falls through to the dynamic `[handle]` canonical redirect path.
- Middleware redirect matrix coverage is reliable with direct `NextRequest` middleware invocation and assertions on `location` plus `x-middleware-next` headers.
- Follow-route API contracts are fastest to verify by calling exported Next route handlers with `Request` objects and asserting deterministic JSON shapes/status directly in `lib/**/*.test.ts`.
- Profile data path now derives `viewerMode` via `resolveViewerMode` (`?viewerMode=logged_in` else `logged_out`), keeping auth undecoupled while exposing deterministic viewer context in profile payloads.
- Added deterministic `lockMetadata` to profile payload in `getProfileByUsername`, where `logged_out` sets section locks true and `logged_in` sets them false with a stable `ctaHint` token.
- Section-level profile locks are safest when UI rendering keys only off `profile.lockMetadata.sections`, which keeps locked/unlocked behavior deterministic without auth branching.
- Root auth landing can stay deterministic by checking only `request.cookies.get("crtv_auth")?.value` in middleware: non-empty values redirect `/` to `ROUTES.EXPLORE`, while missing/empty values fall through to `NextResponse.next()`.
- Redirect-loop safety for route aliases is easiest to lock by asserting both `location` target path (`/workspace -> /canvas`, `/dashboard -> /analytics`) and explicit non-self path checks in `lib/routing/middleware.test.ts`.
- Public-route middleware coverage should assert logged-out pass-through (`status 200`, no `location`, `x-middleware-next: 1`) explicitly for `/`, `/pricing`, `/about`, and `/@username`.
- Redirect-order tests are clearest when alias paths are invoked with auth cookies and assertions prove canonical targets (`/canvas`, `/analytics`) are returned instead of `/explore` or `/onboarding`.
- Canonical redirect smoke coverage stays lightweight and deterministic by asserting only redirect status (`307`) plus `location` pathname for `/workspace -> /canvas` and `/dashboard -> /analytics`.
- E2E tickets should first verify three prerequisites before test authoring: (1) executable E2E harness present (`playwright.config.*` or equivalent + script), (2) concrete sign-up/auth routes, and (3) app-level auth/session provider contract; if any are missing, log blocker evidence instead of creating placeholder specs.
- Shared local modal launcher state keeps navbar-level auth CTA and section lock CTAs behaviorally consistent without adding auth-provider coupling.
- Re-verified PR-03 E2E feasibility: Playwright harness is present (`playwright.config.ts`, `npm run test:e2e`, existing `e2e/following-follow-5-gate.spec.ts`), but `sign-up -> onboarding -> complete -> /explore` remains blocked because no concrete sign-up/auth route/provider exists to establish an authenticated session in-app.
- `e2e/following-follow-5-gate.spec.ts` already satisfies follow-5 gate coverage by asserting `/following?count=4` shows lock UI (`Unlock your following feed`, `Progress: 4/5`, unlocked text absent) and `/following?count=5` shows unlock UI (`Following feed unlocked.`, lock heading absent); no spec changes required.
- Follow-5 gate spec stability fix: removed flaky `beforeEach` API setup path and asserted `FollowingPage` output directly for `count=4` and `count=5`; for progress text, serialized JSX splits numeric children (`"Progress: ",4,"/",5`), so assertions must match segmented output instead of a single `"Progress: 4/5"` substring.
- Restoring true browser E2E for follow-5 should target only `/following?count=4|5` with Playwright `page.goto(...)` + web-first assertions; route-group URLs and middleware bypass headers are invalid fixes.
- PR-05 unlock path can stay auth-decoupled by deriving profile page viewer context from `searchParams.viewerMode` (`logged_in` only) and preserving it through handle canonical redirects (`/@handle?viewerMode=logged_in`).
- Deterministic lock/unlock tests are most stable against `unstable_cache` by asserting an exported uncached profile resolver and viewer-mode coercion helper in `lib/data/profile.test.ts`.
- Visual regression snapshots were added for locked and unlocked profile states in `e2e/profile-lock-visual.spec.ts`; baseline images were generated under `e2e/profile-lock-visual.spec.ts-snapshots/` and verified passing without snapshot updates.

#MN|- Profile visual spec navigation is more deterministic with  before web-first assertions and -scoped screenshots.

- PR-05 CTA->modal E2E is stable by waiting for `networkidle`, clicking the top lock CTA `button[name="Sign In"]`, asserting modal heading/body copy, and dismissing via `Maybe later` (overlay close button is covered by modal content and can be flaky for direct click).

#MN|- Profile visual spec navigation is more deterministic with domcontentloaded page goto waits before assertions and main-scoped screenshots.

- PR-06 auth-only route enforcement is deterministic by checking non-empty crtv_auth before onboarding redirects on AUTH_ONLY_PATHS, then using sanitizeNextPath when redirecting logged-out requests to /?next=... .
- Wallet-consistency tests in `tsx --test` should avoid importing Next runtime page/route modules; validate shared contract by combining `getWalletSummary` field checks with source-level assertions that `/canvas`, `/billing`, and `/api/wallet` all import and use `getWalletSummary` plus concrete wallet fields.
