import assert from "node:assert/strict"
import test from "node:test"

import { GET as getFollowingCount } from "@/app/api/following/count/route"
import { GET as getRecommendations } from "@/app/api/following/recommendations/route"
import { DELETE } from "@/app/api/follows/[targetId]/route"
import { POST } from "@/app/api/follows/route"
import { resetFollowStateForTests } from "@/lib/data/follows"

type FollowingCountResponse = {
  count: number
}

type Recommendation = {
  id: string
  handle: string
  displayName: string
}

type RecommendationsResponse = {
  recommendations: Recommendation[]
}

type FollowMutationResponse = {
  followed: boolean
  targetId: string
  count: number
}

test("GET /api/following/count returns count contract", async () => {
  resetFollowStateForTests()

  const response = await getFollowingCount()
  const body = (await response.json()) as FollowingCountResponse

  assert.equal(response.status, 200)
  assert.equal(typeof body.count, "number")
  assert.equal(body.count, 0)
})

test("GET /api/following/recommendations returns recommendation shape", async () => {
  const request = new Request("http://localhost/api/following/recommendations?limit=3")
  const response = await getRecommendations(request)
  const body = (await response.json()) as RecommendationsResponse

  assert.equal(response.status, 200)
  assert.equal(Array.isArray(body.recommendations), true)
  assert.equal(body.recommendations.length, 3)

  for (const recommendation of body.recommendations) {
    assert.equal(typeof recommendation.id, "string")
    assert.equal(typeof recommendation.handle, "string")
    assert.equal(typeof recommendation.displayName, "string")
  }
})

test("GET /api/following/recommendations falls back to default limit on invalid limit query", async () => {
  const request = new Request("http://localhost/api/following/recommendations?limit=oops")
  const response = await getRecommendations(request)
  const body = (await response.json()) as RecommendationsResponse

  assert.equal(response.status, 200)
  assert.equal(body.recommendations.length, 5)
})

test("POST /api/follows returns follow contract", async () => {
  resetFollowStateForTests()

  const request = new Request("http://localhost/api/follows", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ targetId: "u_123" }),
  })
  const response = await POST(request)
  const body = (await response.json()) as FollowMutationResponse

  assert.equal(response.status, 200)
  assert.equal(typeof body.followed, "boolean")
  assert.equal(body.followed, true)
  assert.equal(typeof body.targetId, "string")
  assert.equal(body.targetId, "u_123")
  assert.equal(typeof body.count, "number")
  assert.equal(body.count, 1)
})

test("DELETE /api/follows/:targetId returns unfollow contract", async () => {
  resetFollowStateForTests()

  const followRequest = new Request("http://localhost/api/follows", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ targetId: "u_123" }),
  })
  await POST(followRequest)

  const request = new Request("http://localhost/api/follows/u_123", {
    method: "DELETE",
  })
  const response = await DELETE(request, {
    params: Promise.resolve({ targetId: "u_123" }),
  })
  const body = (await response.json()) as FollowMutationResponse

  assert.equal(response.status, 200)
  assert.equal(typeof body.followed, "boolean")
  assert.equal(body.followed, false)
  assert.equal(typeof body.targetId, "string")
  assert.equal(body.targetId, "u_123")
  assert.equal(typeof body.count, "number")
  assert.equal(body.count, 0)
})

test("POST and DELETE update GET /api/following/count", async () => {
  resetFollowStateForTests()

  const initialResponse = await getFollowingCount()
  const initialBody = (await initialResponse.json()) as FollowingCountResponse
  assert.equal(initialBody.count, 0)

  await POST(
    new Request("http://localhost/api/follows", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetId: "u_001" }),
    })
  )
  await POST(
    new Request("http://localhost/api/follows", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetId: "u_002" }),
    })
  )

  const afterFollowResponse = await getFollowingCount()
  const afterFollowBody = (await afterFollowResponse.json()) as FollowingCountResponse
  assert.equal(afterFollowBody.count, 2)

  await DELETE(new Request("http://localhost/api/follows/u_001", { method: "DELETE" }), {
    params: Promise.resolve({ targetId: "u_001" }),
  })

  const afterUnfollowResponse = await getFollowingCount()
  const afterUnfollowBody = (await afterUnfollowResponse.json()) as FollowingCountResponse
  assert.equal(afterUnfollowBody.count, 1)
})
