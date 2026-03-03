import assert from "node:assert/strict"
import { AsyncLocalStorage } from "node:async_hooks"
import { readFile } from "node:fs/promises"
import test from "node:test"

type CachedFetchEntry = {
  kind: "FETCH"
  data: {
    body: string
  }
}

type MockIncrementalCache = {
  isOnDemandRevalidate: boolean
  generateCacheKey: (key: string) => Promise<string>
  get: (key: string) => Promise<{ value: CachedFetchEntry; isStale: boolean } | null>
  set: (key: string, entry: CachedFetchEntry) => Promise<void>
}

const cacheStore = new Map<string, string>()

const mockIncrementalCache: MockIncrementalCache = {
  isOnDemandRevalidate: false,
  async generateCacheKey(key) {
    return key
  },
  async get(key) {
    const body = cacheStore.get(key)
    if (!body) {
      return null
    }

    return {
      value: {
        kind: "FETCH",
        data: { body },
      },
      isStale: false,
    }
  },
  async set(key, entry) {
    cacheStore.set(key, entry.data.body)
  },
}

;(globalThis as typeof globalThis & { AsyncLocalStorage?: typeof AsyncLocalStorage }).AsyncLocalStorage = AsyncLocalStorage
;(globalThis as typeof globalThis & { __incrementalCache?: MockIncrementalCache }).__incrementalCache = mockIncrementalCache

test("wallet summary source returns deterministic contract fields", async () => {
  const { getWalletSummary } = await import("@/lib/data/wallet")
  const wallet = await getWalletSummary()

  assert.deepEqual(Object.keys(wallet).sort(), [
    "accountId",
    "availableBalanceCents",
    "currency",
    "nextPayoutDate",
    "pendingBalanceCents",
    "totalEarnedCents",
    "updatedAt",
  ])
  assert.equal(typeof wallet.accountId, "string")
  assert.equal(wallet.currency, "USD")
  assert.equal(typeof wallet.availableBalanceCents, "number")
  assert.equal(typeof wallet.pendingBalanceCents, "number")
  assert.equal(typeof wallet.totalEarnedCents, "number")
  assert.equal(typeof wallet.nextPayoutDate, "string")
  assert.equal(typeof wallet.updatedAt, "string")
})

test("/canvas, /billing, and /api/wallet consume shared wallet source contract", async () => {
  const [canvasSource, billingSource, walletRouteSource] = await Promise.all([
    readFile("app/(with-sidebar)/canvas/page.tsx", "utf8"),
    readFile("app/(with-sidebar)/billing/page.tsx", "utf8"),
    readFile("app/api/wallet/route.ts", "utf8"),
  ])

  assert.match(canvasSource, /import\s*\{\s*getWalletSummary\s*\}\s*from\s*['"]@\/lib\/data\/wallet['"]/) 
  assert.match(billingSource, /import\s*\{\s*getWalletSummary\s*\}\s*from\s*['"]@\/lib\/data\/wallet['"]/) 
  assert.match(walletRouteSource, /import\s*\{\s*getWalletSummary\s*\}\s*from\s*['"]@\/lib\/data\/wallet['"]/) 

  assert.match(canvasSource, /const\s+wallet\s*=\s*await\s+getWalletSummary\(\)/)
  assert.match(billingSource, /const\s+wallet\s*=\s*await\s+getWalletSummary\(\)/)
  assert.match(walletRouteSource, /const\s+wallet\s*=\s*await\s+getWalletSummary\(\)/)

  assert.match(canvasSource, /wallet\.availableBalanceCents/)
  assert.match(canvasSource, /wallet\.pendingBalanceCents/)

  assert.match(billingSource, /wallet\.availableBalanceCents/)
  assert.match(billingSource, /wallet\.pendingBalanceCents/)
  assert.match(billingSource, /wallet\.totalEarnedCents/)
  assert.match(billingSource, /wallet\.nextPayoutDate/)
  assert.match(billingSource, /wallet\.accountId/)
  assert.match(walletRouteSource, /NextResponse\.json\(\{\s*wallet\s*\}\)/)
})
