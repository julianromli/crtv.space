import assert from "node:assert/strict"
import test from "node:test"

import { POST as postAnalyticsEvent } from "@/app/api/analytics/events/route"

type AnalyticsAcceptedResponse = {
  accepted: boolean
}

type AnalyticsErrorResponse = {
  error: string
}

test("POST /api/analytics/events accepts valid event payload", async () => {
  const request = new Request("http://localhost/api/analytics/events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      event: "canvas_opened",
      timestamp: new Date().toISOString(),
      context: {
        path: "/canvas",
        source: "canvas_page",
        userId: "user_1",
      },
      payload: {
        surface: "canvas_page",
      },
    }),
  })

  const response = await postAnalyticsEvent(request)
  const body = (await response.json()) as AnalyticsAcceptedResponse

  assert.equal(response.status, 202)
  assert.equal(body.accepted, true)
})

test("POST /api/analytics/events rejects invalid payload shape", async () => {
  const request = new Request("http://localhost/api/analytics/events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      event: "canvas_generation_succeeded",
      timestamp: new Date().toISOString(),
      context: {
        path: "/canvas",
      },
      payload: {
        promptLength: 12,
      },
    }),
  })

  const response = await postAnalyticsEvent(request)
  const body = (await response.json()) as AnalyticsErrorResponse

  assert.equal(response.status, 400)
  assert.equal(body.error, "Invalid payload for canvas_generation_succeeded")
})
