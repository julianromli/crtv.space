import assert from "node:assert/strict"
import test from "node:test"

import { PATCH } from "@/app/api/profile/username/route"
import { normalizeHandle, validateHandle } from "@/lib/routing/handle"

test("normalizeHandle trims, strips leading @, and lowercases", () => {
  assert.equal(normalizeHandle("  @Faiz-Intifada  "), "faiz-intifada")
})

test("normalizeHandle strips one or more leading @ symbols", () => {
  assert.equal(normalizeHandle("@@@creator"), "creator")
})

test("validateHandle accepts valid lowercase handles allowed by pattern", () => {
  assert.equal(validateHandle("a"), true)
  assert.equal(validateHandle("faiz-intifada"), true)
  assert.equal(validateHandle("a1-b2-c3"), true)
  assert.equal(validateHandle("9"), true)
})

test("validateHandle rejects uppercase handles", () => {
  assert.equal(validateHandle("Faiz"), false)
})

test("validateHandle rejects illegal characters", () => {
  assert.equal(validateHandle("faiz_intifada"), false)
  assert.equal(validateHandle("faiz.intifada"), false)
  assert.equal(validateHandle("faiz intifada"), false)
})

test("validateHandle rejects out-of-range lengths", () => {
  assert.equal(validateHandle(""), false)
  assert.equal(validateHandle("a".repeat(31)), false)
})

test("PATCH /api/profile/username rejects reserved usernames", async () => {
  const request = new Request("http://localhost/api/profile/username", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "profile" }),
  })

  const response = await PATCH(request)
  const body = (await response.json()) as { error?: string }

  assert.equal(response.status, 409)
  assert.equal(body.error, "Username is reserved")
})

test("PATCH /api/profile/username normalizes and accepts valid usernames", async () => {
  const request = new Request("http://localhost/api/profile/username", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "  @Creator-01  " }),
  })

  const response = await PATCH(request)
  const body = (await response.json()) as { username?: string }

  assert.equal(response.status, 200)
  assert.equal(body.username, "creator-01")
})
