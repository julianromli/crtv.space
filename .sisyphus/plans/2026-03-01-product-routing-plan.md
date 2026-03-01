# CRTV Product Routing Plan

Date: 2026-03-01
Status: Finalized

## Locked Decisions

- `/` is public landing.
- Authenticated users visiting `/` are redirected to `/explore`.
- `/explore`, `/following`, `/search` are auth-only.
- Public profile route is `/<at-handle>` format: `/@username`.
- `/profile` always redirects to `/@currentUser`.
- `/analytics` is canonical insights route (not `/dashboard`).
- `/canvas` is canonical AI creation route.
- `/workspace` redirects to `/canvas` for backward compatibility.
- `/following` requires minimum 5 follows before feed unlock (blocking interstitial).
- Onboarding is soft-required with skip, but valid username is mandatory.
- Billing uses one unified credits wallet (image + video).
- Logged-out profile viewers see partial-locked content with hybrid CTA:
  - navbar auth CTA
  - contextual lock CTA (auth modal)

## Route Taxonomy

Public routes:

- `/`
- `/pricing`
- `/about`
- `/sign-in`
- `/sign-up`
- `/@username`

Auth routes:

- `/explore`
- `/following`
- `/search`
- `/notifications`
- `/onboarding`
- `/settings`
- `/analytics`
- `/canvas`
- `/billing`

Aliases/compat:

- `/workspace` -> `/canvas`
- `/dashboard` -> `/analytics`
- `/profile` -> `/@currentUser`

## Access + Redirect Matrix

- Logged-out on `/` -> stay on landing.
- Logged-in on `/` -> `/explore`.
- Logged-out on auth routes -> `/sign-in?next=<path>`.
- Logged-in + onboarding incomplete on auth routes (except `/onboarding`) -> `/onboarding?next=<path>`.
- `/@username` remains public; render locked sections for logged-out viewers.
- `/following` route loads for eligible users, but feed remains blocked until follow count >= 5.

## Middleware/Guard Order

1. Skip assets, `_next`, and API paths in matcher.
2. Apply canonical redirects (`/workspace`, `/dashboard`, `/profile`).
3. Resolve auth session.
4. Apply landing redirect (`/` -> `/explore` when authenticated).
5. Enforce auth-only routes.
6. Enforce onboarding redirect for incomplete users.
7. Leave content-level gates to page-level logic (`/following`, `/@username`).

## Handle Rules

Normalization:

- trim
- strip leading `@`
- lowercase

Validation:

- length 3-30
- regex: `^[a-z0-9](?:[a-z0-9_]{1,28}[a-z0-9])?$`
- reserved handles (case-insensitive block):
  - `api, _next, explore, following, notifications, search, sign-in, sign-up, onboarding, settings, analytics, billing, pricing, about, canvas, workspace, profile`

## Data/API Contracts (v1)

- `GET /api/onboarding/status`
- `PATCH /api/onboarding`
- `POST /api/handles/validate`
- `GET /api/following/count`
- `GET /api/following/recommendations?limit=n`
- `POST /api/follows`
- `DELETE /api/follows/:targetId`
- `GET /api/credits/wallet`
- `GET /api/analytics/summary`
- `GET /api/profile/[username]` returns profile + lock metadata

## Implementation Phases (PR-sized)

PR-01: Canonical routing and middleware scaffold

- Add redirect map and guard skeleton.
- Acceptance: no redirect loops; aliases resolve correctly.

PR-02: Handle validation + reserved enforcement

- Shared validator and normalization utility.
- Acceptance: invalid/reserved handles blocked at API boundary.

PR-03: Onboarding gating

- Enforce mandatory username, optional skip for other steps.
- Acceptance: incomplete users are routed to `/onboarding` for protected routes.

PR-04: Explore/following/search pages + follow-5 interstitial

- Add `/explore`, `/following`, `/search` auth pages.
- Acceptance: `/following` unlocks only after 5 follows.

PR-05: Public profile partial lock + hybrid auth CTA

- Add content lock UI and auth modal trigger.
- Acceptance: logged-out user sees locked sections and CTA.

PR-06: Canvas/analytics/billing canonical pages

- Add `/canvas`, `/analytics`, `/billing` and move `/workspace` behavior to redirect.
- Acceptance: unified wallet shown on canvas + billing.

PR-07: QA hardening + event instrumentation

- Complete route matrix tests and funnel event checks.
- Acceptance: lint, typecheck, build, and E2E matrix all pass.

## Instrumentation Events

- `landing_authed_redirect_to_explore`
- `following_follow5_completed`
- `onboarding_step_skipped`
- `canvas_opened`
- `canvas_generation_started`
- `canvas_generation_succeeded`

## Risks + Mitigation

- Route collision with handles -> reserved list + normalized uniqueness.
- Redirect loops -> strict guard order + explicit exemptions.
- Onboarding friction -> only username mandatory, others skippable.
- Canonical drift -> enforce canonical redirects + metadata.
