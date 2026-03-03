import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getOnboardingState } from "@/lib/data/onboarding"
import { AUTH_ONLY_PATHS, ROUTES } from "@/lib/routing/routes"
import { sanitizeNextPath } from "@/lib/routing/sanitize-next-path"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/workspace") {
    return NextResponse.redirect(new URL("/canvas", request.url))
  }

  if (request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/analytics", request.url))
  }

  if (request.nextUrl.pathname === ROUTES.HOME) {
    const authCookie = request.cookies.get("crtv_auth")?.value

    if (authCookie && authCookie.trim() !== "") {
      return NextResponse.redirect(new URL(ROUTES.EXPLORE, request.url))
    }
  }

  if (AUTH_ONLY_PATHS.includes(request.nextUrl.pathname as (typeof AUTH_ONLY_PATHS)[number])) {
    const authCookie = request.cookies.get("crtv_auth")?.value

    if (!authCookie || authCookie.trim() === "") {
      const nextCandidate = `${request.nextUrl.pathname}${request.nextUrl.search}`
      const safeNextPath = sanitizeNextPath(nextCandidate)
      const redirectUrl = new URL(ROUTES.HOME, request.url)

      if (safeNextPath) {
        redirectUrl.searchParams.set("next", safeNextPath)
      }

      return NextResponse.redirect(redirectUrl)
    }

    const onboardingState = getOnboardingState()

    if (!onboardingState.usernameCompleted) {
      const nextCandidate = `${request.nextUrl.pathname}${request.nextUrl.search}`
      const safeNextPath = sanitizeNextPath(nextCandidate)
      const redirectUrl = new URL(ROUTES.HOME, request.url)

      redirectUrl.pathname = "/onboarding"

      if (safeNextPath) {
        redirectUrl.searchParams.set("next", safeNextPath)
      }

      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
