import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { AUTH_ONLY_PATHS, ROUTES } from "@/lib/routing/routes"
import { sanitizeNextPath } from "@/lib/routing/sanitize-next-path"

function isOnboardingCompleteForRequest(request: NextRequest): boolean {
  return request.cookies.get("crtv_onboarding_completed")?.value === "1"
}

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
      const response = NextResponse.redirect(new URL(ROUTES.EXPLORE, request.url))
      response.cookies.set("crtv_landing_redirected_to_explore", "1", {
        path: "/",
        maxAge: 60,
        sameSite: "lax",
      })
      return response
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

    const isOnboardingComplete = isOnboardingCompleteForRequest(request)

    if (!isOnboardingComplete) {
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
