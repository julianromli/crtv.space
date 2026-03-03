export const RESERVED_HANDLES = [
  "api",
  "_next",
  "explore",
  "following",
  "notifications",
  "search",
  "sign-in",
  "sign-up",
  "onboarding",
  "settings",
  "analytics",
  "billing",
  "pricing",
  "about",
  "canvas",
  "workspace",
  "profile",
] as const satisfies readonly string[]

export const RESERVED_HANDLE_SET: ReadonlySet<string> = new Set(RESERVED_HANDLES)
