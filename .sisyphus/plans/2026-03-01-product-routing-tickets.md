# CRTV Routing Execution Tickets

Date: 2026-03-01
Source Plan: `.sisyphus/plans/2026-03-01-product-routing-plan.md`
Status: Ready for execution

## PR-01 — Canonical Routing + Middleware Skeleton

Goal: establish canonical aliases and base guard flow without product behavior regressions.

### Tickets

- [ ] Create route constants module for canonical paths and auth-only paths.
- [ ] Add middleware matcher exclusions for static assets, `_next`, and API routes.
- [ ] Implement canonical redirects:
  - [ ] `/workspace` -> `/canvas`
  - [ ] `/dashboard` -> `/analytics`
- [ ] Implement authenticated landing redirect `/` -> `/explore`.
- [ ] Add `next` param sanitizer utility (relative paths only).

### Acceptance

- [ ] No redirect loop on `/`, `/workspace`, `/dashboard`.
- [ ] Logged-out users can still access `/`, `/pricing`, `/about`, `/@username`.

### Verification

- [ ] Unit tests for redirect helper order.
- [ ] Smoke tests for canonical redirects.

---

## PR-02 — Handle Validation + Reserved Names

Goal: enforce safe canonical profile handles and prevent route collisions.

### Tickets

- [ ] Add shared handle utility module:
  - [ ] `normalizeHandle(input)`
  - [ ] `validateHandle(normalized)`
  - [ ] `isReservedHandle(normalized)`
- [ ] Add reserved list:
  - [ ] `api, _next, explore, following, notifications, search, sign-in, sign-up, onboarding, settings, analytics, billing, pricing, about, canvas, workspace, profile`
- [ ] Enforce validation in username mutation endpoints.
- [ ] Enforce canonical lowercase route redirect for profile handles.
- [ ] Keep `/profile` alias redirect to `/@currentUser`.

### Acceptance

- [ ] Reserved/invalid handles are rejected server-side.
- [ ] `@Faiz-Intifada` resolves to canonical lowercase `/@faiz-intifada`.

### Verification

- [ ] Unit tests for normalization and regex checks.
- [ ] Integration tests for reserved-handle rejection.

---

## PR-03 — Onboarding Gate (Username Required, Others Skippable)

Goal: enforce mandatory username while keeping onboarding lightweight.

### Tickets

- [ ] Add onboarding state model/API.
- [ ] Require valid username before onboarding completion.
- [ ] Add optional steps with explicit `skip` action.
- [ ] Add middleware check: onboarding-incomplete users redirected to `/onboarding?next=<path>` for protected routes.
- [ ] Exempt `/onboarding` itself from onboarding redirect.

### Acceptance

- [ ] Users without valid username cannot access protected app routes.
- [ ] Optional steps can be skipped without blocking completion.

### Verification

- [ ] Integration tests for onboarding redirect matrix.
- [ ] E2E flow: sign-up -> onboarding -> complete -> `/explore`.

---

## PR-04 — Explore / Following / Search + Follow-5 Interstitial

Goal: ship core feed navigation with minimum-follow gate in `/following`.

### Tickets

- [ ] Create `/explore` page (auth-only scaffold).
- [ ] Create `/following` page with blocking interstitial.
- [ ] Create `/search` page (auth-only scaffold).
- [ ] Add follow graph endpoints:
  - [ ] `GET /api/following/count`
  - [ ] `GET /api/following/recommendations?limit=n` (random v1)
  - [ ] `POST /api/follows`
  - [ ] `DELETE /api/follows/:targetId`
- [ ] Build interstitial UX:
  - [ ] Progress counter `x/5`
  - [ ] Follow action list
  - [ ] Unlock state when count >= 5

### Acceptance

- [ ] `/following` feed blocked when follow count < 5.
- [ ] `/following` feed unlocks immediately at count >= 5.

### Verification

- [ ] E2E test for follow-5 completion gate.
- [ ] API contract tests for count/recommendations/follow actions.

---

## PR-05 — Public Profile Partial Lock + Hybrid Auth CTA

Goal: allow public profile discovery while gating selected content for logged-out viewers.

### Tickets

- [ ] Add viewer-mode computation in profile data path (logged-in vs logged-out).
- [ ] Add lock metadata in profile payload.
- [ ] Implement partial-lock sections in `/@username` page.
- [ ] Add hybrid CTA strategy:
  - [ ] Navbar auth CTA
  - [ ] Contextual lock CTA near protected content
  - [ ] Auth modal launcher

### Acceptance

- [ ] Logged-out users see public portion + lock overlay + CTA.
- [ ] Logged-in users see full unlocked profile content.

### Verification

- [ ] Visual regression snapshots for locked/unlocked states.
- [ ] E2E for CTA -> auth modal trigger.

---

## PR-06 — Canvas + Analytics + Billing (Canonical Product Routes)

Goal: finalize creator core routes and unified credits surface.

### Tickets

- [ ] Implement `/canvas` as canonical creation page.
- [ ] Redirect legacy `/workspace` traffic to `/canvas`.
- [ ] Implement `/analytics` page (engagement/insights v1 cards).
- [ ] Implement `/billing` page with unified credits wallet.
- [ ] Add wallet endpoint and shared data model used by `/canvas` and `/billing`.

### Acceptance

- [ ] `/canvas` and `/billing` show consistent wallet values.
- [ ] `/analytics` reachable only for authenticated users.

### Verification

- [ ] Integration tests for wallet consistency across routes.
- [ ] E2E for `/workspace` -> `/canvas` canonical redirect.

---

## PR-07 — QA Hardening + Instrumentation

Goal: production confidence across routing, onboarding, and conversion funnel.

### Tickets

- [ ] Add route-access matrix E2E tests (logged-out, logged-in, onboarding-incomplete).
- [ ] Add canonical URL assertions for `/@username`.
- [ ] Add event tracking:
  - [ ] `landing_authed_redirect_to_explore`
  - [ ] `following_follow5_completed`
  - [ ] `onboarding_step_skipped`
  - [ ] `canvas_opened`
  - [ ] `canvas_generation_started`
  - [ ] `canvas_generation_succeeded`
- [ ] Add event payload schema validation in analytics pipeline.

### Acceptance

- [ ] All matrix tests pass in CI.
- [ ] Funnel events visible in staging analytics.

### Verification

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] E2E suite green

---

## Global Definition of Done

- [ ] Route taxonomy matches final IA decisions.
- [ ] Middleware guard order is deterministic and loop-free.
- [ ] Handle normalization and reserved list enforced server-side.
- [ ] Onboarding behavior matches "username required, soft steps skippable".
- [ ] `/` public landing + auth redirect behavior implemented.
- [ ] `/profile` and `/workspace` aliases safely redirect to canonical routes.
- [ ] CI is green on lint, typecheck, build, and E2E.
