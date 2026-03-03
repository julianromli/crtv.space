import assert from "node:assert/strict"
import test from "node:test"

import {
  getCurrentProfileUsername,
  getProfileByUsernameUncached,
  resolveViewerModeFromSearchParam,
} from "@/lib/data/profile"

test("getProfileByUsernameUncached defaults to logged-out locked sections", async () => {
  const username = getCurrentProfileUsername()
  const profile = await getProfileByUsernameUncached(username)

  assert.ok(profile)
  assert.equal(profile.viewerMode, "logged_out")
  assert.equal(profile.lockMetadata?.sections.portfolio, true)
  assert.equal(profile.lockMetadata?.sections.contact, true)
})

test("getProfileByUsernameUncached returns unlocked sections for logged-in viewer mode", async () => {
  const username = getCurrentProfileUsername()
  const profile = await getProfileByUsernameUncached(username, "logged_in")

  assert.ok(profile)
  assert.equal(profile.viewerMode, "logged_in")
  assert.equal(profile.lockMetadata?.sections.portfolio, false)
  assert.equal(profile.lockMetadata?.sections.contact, false)
})

test("resolveViewerModeFromSearchParam defaults to logged_out", () => {
  assert.equal(resolveViewerModeFromSearchParam(undefined), "logged_out")
  assert.equal(resolveViewerModeFromSearchParam("invalid"), "logged_out")
  assert.equal(resolveViewerModeFromSearchParam(["invalid", "logged_in"]), "logged_out")
})

test("resolveViewerModeFromSearchParam resolves logged_in from direct or array values", () => {
  assert.equal(resolveViewerModeFromSearchParam("logged_in"), "logged_in")
  assert.equal(resolveViewerModeFromSearchParam(["logged_in"]), "logged_in")
})
