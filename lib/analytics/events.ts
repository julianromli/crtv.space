export const ANALYTICS_EVENT_NAMES = [
  "landing_authed_redirect_to_explore",
  "following_follow5_completed",
  "onboarding_step_skipped",
  "canvas_opened",
  "canvas_generation_started",
  "canvas_generation_succeeded",
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]

export type AnalyticsEventPayloadMap = {
  landing_authed_redirect_to_explore: {
    destination: "/explore"
  }
  following_follow5_completed: {
    followCount: number
    threshold: number
  }
  onboarding_step_skipped: {
    step: string
  }
  canvas_opened: {
    surface: "canvas_page"
  }
  canvas_generation_started: {
    promptLength: number
  }
  canvas_generation_succeeded: {
    promptLength: number
    outputCount: number
  }
}

export type AnalyticsContext = {
  path: string
  source?: string
  userId?: string
}

export type AnalyticsEventEnvelope<N extends AnalyticsEventName = AnalyticsEventName> = {
  event: N
  timestamp: string
  context: AnalyticsContext
  payload: AnalyticsEventPayloadMap[N]
}

export type AnalyticsEventInput<N extends AnalyticsEventName = AnalyticsEventName> = {
  event: N
  timestamp?: string
  context: AnalyticsContext
  payload: AnalyticsEventPayloadMap[N]
}

export type AnalyticsEvent = {
  [K in AnalyticsEventName]: AnalyticsEventEnvelope<K>
}[AnalyticsEventName]

type ValidationResult =
  | {
      ok: true
      event: AnalyticsEvent
    }
  | {
      ok: false
      error: string
    }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0
}

function isEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && ANALYTICS_EVENT_NAMES.includes(value as AnalyticsEventName)
}

function isValidTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed)
}

function validateContext(value: unknown): value is AnalyticsContext {
  if (!isRecord(value)) {
    return false
  }

  if (typeof value.path !== "string" || !value.path.startsWith("/")) {
    return false
  }

  if ("source" in value && value.source !== undefined && typeof value.source !== "string") {
    return false
  }

  if ("userId" in value && value.userId !== undefined && typeof value.userId !== "string") {
    return false
  }

  return true
}

function validatePayload(event: AnalyticsEventName, payload: unknown): boolean {
  if (!isRecord(payload)) {
    return false
  }

  switch (event) {
    case "landing_authed_redirect_to_explore":
      return payload.destination === "/explore"
    case "following_follow5_completed":
      return (
        isNonNegativeSafeInteger(payload.followCount) &&
        isNonNegativeSafeInteger(payload.threshold) &&
        payload.followCount >= payload.threshold
      )
    case "onboarding_step_skipped":
      return typeof payload.step === "string" && payload.step.trim().length > 0
    case "canvas_opened":
      return payload.surface === "canvas_page"
    case "canvas_generation_started":
      return isNonNegativeSafeInteger(payload.promptLength)
    case "canvas_generation_succeeded":
      return (
        isNonNegativeSafeInteger(payload.promptLength) &&
        Number.isSafeInteger(payload.outputCount) &&
        Number(payload.outputCount) > 0
      )
    default:
      return false
  }
}

export function validateAnalyticsEvent(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { ok: false, error: "Event body must be an object" }
  }

  if (!isEventName(input.event)) {
    return { ok: false, error: "Unknown analytics event name" }
  }

  if (!isValidTimestamp(input.timestamp)) {
    return { ok: false, error: "Invalid event timestamp" }
  }

  if (!validateContext(input.context)) {
    return { ok: false, error: "Invalid event context" }
  }

  if (!validatePayload(input.event, input.payload)) {
    return { ok: false, error: `Invalid payload for ${input.event}` }
  }

  return {
    ok: true,
    event: input as AnalyticsEvent,
  }
}

export function createAnalyticsEvent<N extends AnalyticsEventName>(
  input: AnalyticsEventInput<N>
): AnalyticsEventEnvelope<N> {
  return {
    event: input.event,
    timestamp: input.timestamp ?? new Date().toISOString(),
    context: input.context,
    payload: input.payload,
  }
}
