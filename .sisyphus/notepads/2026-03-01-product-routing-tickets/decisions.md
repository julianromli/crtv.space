## 2026-03-01 - PR-01 routing research (Next.js proxy/middleware redirects)

### Request classification
- Type D (comprehensive): combined doc discovery + source examples + anti-pattern comparison.

### Curated references (official first)
1) Next.js  (renamed from ) matcher and negative lookahead examples, plus  caveat:
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy

2) Next.js redirect ordering and where each redirect API should be used:
- https://nextjs.org/docs/app/guides/redirecting

3) NextResponse redirect URL construction and query param pattern:
- https://nextjs.org/docs/app/api-reference/functions/next-response

4) Next.js auth guide with optimistic proxy checks and public/protected route split:
- https://nextjs.org/docs/app/guides/authentication

### High-signal GitHub implementation references
1) Next.js repo matcher exclusion pattern (official repo test fixture):
- https://github.com/vercel/next.js/blob/canary/test/e2e/app-dir/rewrite-headers/middleware.js
- Pattern used:


2) Vercel example showing auth redirect ordering + loop prevention behavior:
- https://github.com/vercel/v0-sdk/blob/main/examples/v0-clone/middleware.ts
- Patterns used:


3) Auth.js core default redirect callback (safe callback URL policy; prevents open redirects):
- https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/init.ts
- Pattern used:


### Implementation checklist for PR-01
- Use a constant matcher exclusion baseline in proxy/middleware:

  Source: Next.js proxy docs + Next.js repo fixture.

- Redirect ordering (to reduce loop risk):
  1. Early  for explicit allow-list pages (, , health/ping if any).
  2. Enforce protected-route redirect to login.
  3. Enforce logged-in user redirect away from auth pages.
  4. Fall through to .
  Sources: Next.js auth + redirecting docs, Vercel  example.

- Canonical redirect rule placement:
  - Use   for static known canonical redirects.
  - Use proxy/middleware only for conditional/cookie/session-based canonical redirects.
  - Remember order:  in  run before proxy.
  Source: Next.js redirecting guide.

- Loop prevention guardrails:
  - Never redirect when already at redirect destination ().
  - Separate public/auth routes and protected routes; avoid symmetric redirects without path checks.
  - Keep auth checks cheap in proxy (cookie/session token only), do secure checks near data layer.
  Source: Next.js authentication guide + Vercel middleware example.

- Safe  parameter sanitization policy:
  1. Allow relative paths starting with .
  2. Else allow absolute URLs only if .
  3. Else fallback to safe default ( or app dashboard).
  Reference implementation: Auth.js default redirect callback.

### Anti-patterns to avoid (and safe alternatives)
- Anti-pattern:  without validation.
  - Risk: open redirect.
  - Safe alternative: same-origin/relative-only policy from Auth.js callback.

- Anti-pattern: broad matcher that includes assets/internal routes.
  - Risk: unnecessary proxy execution, unexpected behavior on static/image routes.
  - Safe alternative: negative lookahead matcher excluding , , , metadata files.

- Anti-pattern: redirecting auth pages unconditionally.
  - Risk:  <-> protected route loops.
  - Safe alternative: explicit allow-list checks and destination guards before redirect.

### Confidence
- High confidence for matcher exclusions, ordering, and loop prevention (official Next.js docs + Vercel/Next.js sources).
- High confidence for  sanitization policy when using Auth.js/NextAuth semantics.
- Medium confidence if implementing custom auth callback shape; policy remains valid but exact hook surface may differ by stack.



## 2026-03-01 - CORRECTED APPEND (escaped formatting)

### Key references
- Official Next.js proxy docs (v16.1.6): https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- Official Next.js redirecting guide (v16.1.6): https://nextjs.org/docs/app/guides/redirecting
- Official NextResponse API (v16.1.6): https://nextjs.org/docs/app/api-reference/functions/next-response
- Official Next.js authentication guide (v16.1.6): https://nextjs.org/docs/app/guides/authentication

### High-signal GitHub examples
- Next.js matcher exclusion fixture: https://github.com/vercel/next.js/blob/canary/test/e2e/app-dir/rewrite-headers/middleware.js
  Pattern: matcher negative lookahead excluding api, _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt.

- Vercel middleware auth flow and loop prevention: https://github.com/vercel/v0-sdk/blob/main/examples/v0-clone/middleware.ts
  Patterns: explicit allow-list for /login and /register, protected-route redirect to /login, and authenticated redirect away from auth routes.

- Auth.js safe callback URL policy: https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/lib/init.ts
  Pattern: allow relative path, else allow same-origin absolute URL, else fallback to base URL.

### Implementation guidance for PR-01
- Matcher baseline (required exclusion coverage): exclude api, _next/static, _next/image, metadata files.
- Redirect ordering to avoid loops:
  1) Early pass-through for auth pages and any explicit safe pages.
  2) Redirect unauthenticated users from protected routes to login.
  3) Redirect authenticated users away from login/register to app landing page.
  4) Fall through to normal routing.
- Canonical redirects:
  - Put static known canonical mappings in next.config.js redirects.
  - Use proxy only for conditional logic (auth/session/cookie/AB rules).
  - Next.js docs state redirects in next.config.js run before proxy.
- Safe next parameter sanitization:
  1) Accept only values that start with slash (relative).
  2) Else accept absolute URL only if origin equals application base origin.
  3) Otherwise ignore and fallback to safe default destination.

### Anti-patterns and safer alternatives
- Anti-pattern: redirecting to unvalidated query next parameter.
  Safe alternative: relative-only or same-origin-only validation with fallback.
- Anti-pattern: broad matcher that runs on static assets/internal routes.
  Safe alternative: negative lookahead exclusions listed above.
- Anti-pattern: unconditional login redirects without destination/path guards.
  Safe alternative: explicit allow-list and destination inequality checks.

### Confidence
- High: matcher exclusions, redirect ordering, and loop prevention guidance.
- High: next URL sanitization policy when following Auth.js style callbacks.
- Medium: custom auth stacks may use different callback surfaces, but policy remains valid.
