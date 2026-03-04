import assert from "node:assert/strict"
import test from "node:test"
import { createAnalyticsEvent, validateAnalyticsEvent } from "@/lib/analytics/events"

test("validateAnalyticsEvent accepts landing redirect event shape", () => {
  const event = createAnalyticsEvent({
    event: "landing_authed_redirect_to_explore",
    context: {
      path: "/explore",
      source: "test",
      userId: "user_1",
    },
    payload: {
      destination: "/explore",
    },
  })

  const result = validateAnalyticsEvent(event)

  if (result.ok) {
    assert.equal(result.event.event, "landing_authed_redirect_to_explore")
    assert.equal(result.event.context.path, "/explore")
    return
  }

  assert.fail(`Expected valid analytics event, got error: ${result.error}`)
})

test("validateAnalyticsEvent rejects unknown event names", () => {
  const result = validateAnalyticsEvent({
    event: "unknown_event",
    timestamp: new Date().toISOString(),
    context: { path: "/" },
    payload: {},
  })

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.error, "Unknown analytics event name")
  }
})

test("validateAnalyticsEvent rejects invalid payload for following unlock", () => {
  const result = validateAnalyticsEvent({
    event: "following_follow5_completed",
    timestamp: new Date().toISOString(),
    context: { path: "/following" },
    payload: {
      followCount: 3,
      threshold: 5,
    },
  })

  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.error, "Invalid payload for following_follow5_completed")
  }
})

test("validateAnalyticsEvent accepts canvas generation success payload", () => {
  const result = validateAnalyticsEvent({
    event: "canvas_generation_succeeded",
    timestamp: new Date().toISOString(),
    context: { path: "/canvas", source: "canvas_generation_button" },
    payload: {
      promptLength: 14,
      outputCount: 1,
    },
  })

  assert.equal(result.ok, true)
})
