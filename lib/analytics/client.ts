"use client"

import { createAnalyticsEvent, type AnalyticsEventInput, type AnalyticsEventName } from "@/lib/analytics/events"

type TrackContextOverrides = {
  path?: string
  source?: string
  userId?: string
}

function resolvePath(explicitPath?: string): string {
  if (explicitPath) {
    return explicitPath
  }

  if (typeof window === "undefined") {
    return "/"
  }

  return `${window.location.pathname}${window.location.search}`
}

export async function trackAnalyticsEvent<N extends AnalyticsEventName>(
  eventName: N,
  payload: AnalyticsEventInput<N>["payload"],
  contextOverrides: TrackContextOverrides = {}
) {
  const event = createAnalyticsEvent({
    event: eventName,
    context: {
      path: resolvePath(contextOverrides.path),
      source: contextOverrides.source,
      userId: contextOverrides.userId,
    },
    payload,
  })

  try {
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    })
  } catch {
    // Intentionally swallow analytics delivery errors.
  }
}
