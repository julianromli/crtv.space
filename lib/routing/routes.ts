export const ROUTES = {
  HOME: "/",
  CANVAS: "/canvas",
  ANALYTICS: "/analytics",
  EXPLORE: "/explore",
  FOLLOWING: "/following",
  SEARCH: "/search",
  BILLING: "/billing",
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export const LEGACY_ROUTE_ALIASES = {
  "/workspace": ROUTES.CANVAS,
  "/dashboard": ROUTES.ANALYTICS,
} as const satisfies Readonly<Record<string, AppRoute>>

export const AUTH_ONLY_PATHS = [
  ROUTES.CANVAS,
  ROUTES.ANALYTICS,
  ROUTES.EXPLORE,
  ROUTES.FOLLOWING,
  ROUTES.SEARCH,
  ROUTES.BILLING,
] as const satisfies readonly AppRoute[]
