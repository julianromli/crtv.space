# CRTV Routing Execution Tickets

Date: 2026-03-01
Source Plan: `.sisyphus/plans/2026-03-01-product-routing-plan.md`
Status: Ready for execution

## PR-01 — Canonical Routing + Middleware Skeleton

Goal: establish canonical aliases and base guard flow without product behavior regressions.

### Tickets

- [x] Create route constants module for canonical paths and auth-only paths.
- [x] Add middleware matcher exclusions for static assets, `_next`, and API routes.
- [x] Implement canonical redirects:
  - [x] `/workspace` -> `/canvas`
  - [x] `/dashboard` -> `/analytics`
- [x] Implement authenticated landing redirect `/` -> `/explore`.
- [x] Add `next` param sanitizer utility (relative paths only).

### Acceptance

- [x] No redirect loop on `/`, `/workspace`, `/dashboard`.
- [x] Logged-out users can still access `/`, `/pricing`, `/about`, `/@username`.

### Verification

- [x] Unit tests for redirect helper order.
- [x] Smoke tests for canonical redirects.

---

## PR-02 — Handle Validation + Reserved Names

Goal: enforce safe canonical profile handles and prevent route collisions.

### Tickets

- [x] Add shared handle utility module:
  - [x] `normalizeHandle(input)`
  - [x] `validateHandle(normalized)`
  - [x] `isReservedHandle(normalized)`
- [x] Add reserved list:
  - [x] `api, _next, explore, following, notifications, search, sign-in, sign-up, onboarding, settings, analytics, billing, pricing, about, canvas, workspace, profile`
- [x] Enforce validation in username mutation endpoints.
- [x] Enforce canonical lowercase route redirect for profile handles.
- [x] Keep `/profile` alias redirect to `/@currentUser`.

### Acceptance

- [x] Reserved/invalid handles are rejected server-side.
- [x] `@Faiz-Intifada` resolves to canonical lowercase `/@faiz-intifada`.

### Verification

- [x] Unit tests for normalization and regex checks.
- [x] Integration tests for reserved-handle rejection.

---

## PR-03 — Onboarding Gate (Username Required, Others Skippable)

Goal: enforce mandatory username while keeping onboarding lightweight.

### Tickets

- [x] Add onboarding state model/API.
- [x] Require valid username before onboarding completion.
- [x] Add optional steps with explicit `skip` action.
- [x] Add middleware check: onboarding-incomplete users redirected to `/onboarding?next=<path>` for protected routes.
- [x] Exempt `/onboarding` itself from onboarding redirect.

### Acceptance

- [x] Users without valid username cannot access protected app routes.
- [x] Optional steps can be skipped without blocking completion.

### Verification

- [x] Integration tests for onboarding redirect matrix.
- [x] E2E flow: sign-up -> onboarding -> complete -> `/explore`.

---

## PR-04 — Explore / Following / Search + Follow-5 Interstitial

Goal: ship core feed navigation with minimum-follow gate in `/following`.

### Tickets

- [x] Create `/explore` page (auth-only scaffold).
- [x] Create `/following` page with blocking interstitial.
- [x] Create `/search` page (auth-only scaffold).
- [x] Add follow graph endpoints:
  - [x] `GET /api/following/count`
  - [x] `GET /api/following/recommendations?limit=n` (random v1)
  - [x] `POST /api/follows`
  - [x] `DELETE /api/follows/:targetId`
- [x] Build interstitial UX:
  - [x] Progress counter `x/5`
  - [x] Follow action list
  - [x] Unlock state when count >= 5

### Acceptance

- [x] `/following` feed blocked when follow count < 5.
- [x] `/following` feed unlocks immediately at count >= 5.

### Verification

- [x] E2E test for follow-5 completion gate.
- [x] API contract tests for count/recommendations/follow actions.

---

## PR-05 — Public Profile Partial Lock + Hybrid Auth CTA

Goal: allow public profile discovery while gating selected content for logged-out viewers.

### Tickets

- [x] Add viewer-mode computation in profile data path (logged-in vs logged-out).
- [x] Add lock metadata in profile payload.
- [x] Implement partial-lock sections in `/@username` page.
- [x] Add hybrid CTA strategy:
  - [x] Navbar auth CTA
  - [x] Contextual lock CTA near protected content
  - [x] Auth modal launcher

### Acceptance

- [x] Logged-out users see public portion + lock overlay + CTA.
- [x] Logged-in users see full unlocked profile content.

### Verification

- [x] Visual regression snapshots for locked/unlocked states.
- [x] E2E for CTA -> auth modal trigger.

---

## PR-06 — Canvas + Analytics + Billing (Canonical Product Routes)

Goal: finalize creator core routes and unified credits surface.

### Tickets

- [x] Implement `/canvas` as canonical creation page.
- [x] Redirect legacy `/workspace` traffic to `/canvas`.
- [x] Implement `/analytics` page (engagement/insights v1 cards).
- [x] Implement `/billing` page with unified credits wallet.
- [x] Add wallet endpoint and shared data model used by `/canvas` and `/billing`.

### Acceptance

- [x] `/canvas` and `/billing` show consistent wallet values.
- [x] `/analytics` reachable only for authenticated users.

### Verification

- [x] Integration tests for wallet consistency across routes.
- [x] E2E for `/workspace` -> `/canvas` canonical redirect.

---

## PR-07 — QA Hardening + Instrumentation

Goal: production confidence across routing, onboarding, and conversion funnel.

### Tickets

- [x] Add route-access matrix E2E tests (logged-out, logged-in, onboarding-incomplete).
- [x] Add canonical URL assertions for `/@username`.
- [x] Add event tracking:
  - [x] `landing_authed_redirect_to_explore`
  - [x] `following_follow5_completed`
  - [x] `onboarding_step_skipped`
  - [x] `canvas_opened`
  - [x] `canvas_generation_started`
  - [x] `canvas_generation_succeeded`
- [x] Add event payload schema validation in analytics pipeline.

### Acceptance

- [x] All matrix tests pass in CI.
- [x] Funnel events visible in staging analytics.

### Verification

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] E2E suite green

---

## Global Definition of Done

- [x] Route taxonomy matches final IA decisions.
- [x] Middleware guard order is deterministic and loop-free.
- [x] Handle normalization and reserved list enforced server-side.
- [x] Onboarding behavior matches "username required, soft steps skippable".
- [x] `/` public landing + auth redirect behavior implemented.
- [x] `/profile` and `/workspace` aliases safely redirect to canonical routes.
- [x] CI is green on lint, typecheck, build, and E2E.
