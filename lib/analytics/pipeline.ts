import { type AnalyticsEvent, validateAnalyticsEvent } from "@/lib/analytics/events"

type IngestResult =
  | {
      ok: true
      event: AnalyticsEvent
    }
  | {
      ok: false
      error: string
    }

export function ingestAnalyticsEvent(input: unknown): IngestResult {
  const validationResult = validateAnalyticsEvent(input)

  if (!validationResult.ok) {
    return validationResult
  }

  console.info("[analytics_event]", JSON.stringify(validationResult.event))
  return validationResult
}
