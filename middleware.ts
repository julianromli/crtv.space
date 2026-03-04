import { clerkMiddleware } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { AUTH_ONLY_PATHS, ROUTES } from "@/lib/routing/routes"
import { sanitizeNextPath } from "@/lib/routing/sanitize-next-path"

function isOnboardingCompleteForRequest(request: NextRequest): boolean {
  return request.cookies.get("crtv_onboarding_completed")?.value === "1"
}

function hasLegacyAuthCookie(request: NextRequest): boolean {
  const legacyAuthCookie = request.cookies.get("crtv_auth")?.value
  return Boolean(legacyAuthCookie && legacyAuthCookie.trim() !== "")
}

function isClerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)
}

const clerkReady = isClerkConfigured()
const middlewareOptions = clerkReady
  ? undefined
  : {
      publishableKey: "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k",
      secretKey: "sk_test_dummy_secret_key",
      encryptionKey: "12345678901234567890123456789012",
    }

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const userId = clerkReady ? (await auth()).userId : null
  const isAuthenticated = clerkReady ? Boolean(userId) : hasLegacyAuthCookie(request)

  if (request.nextUrl.pathname === "/workspace") {
    return NextResponse.redirect(new URL("/canvas", request.url))
  }

  if (request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/analytics", request.url))
  }

  if (request.nextUrl.pathname === ROUTES.HOME) {
    if (isAuthenticated) {
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
    if (!isAuthenticated) {
      const nextCandidate = `${request.nextUrl.pathname}${request.nextUrl.search}`
      const safeNextPath = sanitizeNextPath(nextCandidate)
      const redirectUrl = new URL("/sign-in", request.url)

      if (safeNextPath) {
        redirectUrl.searchParams.set("redirect_url", safeNextPath)
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
}, middlewareOptions)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
}
