"use client"

import { useEffect, useRef } from "react"
import { trackAnalyticsEvent } from "@/lib/analytics/client"
import type { AnalyticsEventName, AnalyticsEventPayloadMap } from "@/lib/analytics/events"

type TrackEventOnMountProps<N extends AnalyticsEventName> = {
  eventName: N
  payload: AnalyticsEventPayloadMap[N]
  source?: string
}

export default function TrackEventOnMount<N extends AnalyticsEventName>({
  eventName,
  payload,
  source,
}: TrackEventOnMountProps<N>) {
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (hasTrackedRef.current) {
      return
    }

    hasTrackedRef.current = true
    void trackAnalyticsEvent(eventName, payload, { source })
  }, [eventName, payload, source])

  return null
}
