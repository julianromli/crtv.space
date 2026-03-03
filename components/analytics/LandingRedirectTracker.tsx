"use client"

import { useEffect } from "react"
import { trackAnalyticsEvent } from "@/lib/analytics/client"

const LANDING_REDIRECT_COOKIE = "crtv_landing_redirected_to_explore"

function hasLandingRedirectCookie() {
  return document.cookie.split("; ").some((entry) => entry.startsWith(`${LANDING_REDIRECT_COOKIE}=`))
}

function clearLandingRedirectCookie() {
  document.cookie = `${LANDING_REDIRECT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export default function LandingRedirectTracker() {
  useEffect(() => {
    if (!hasLandingRedirectCookie()) {
      return
    }

    clearLandingRedirectCookie()
    void trackAnalyticsEvent("landing_authed_redirect_to_explore", {
      destination: "/explore",
    })
  }, [])

  return null
}
