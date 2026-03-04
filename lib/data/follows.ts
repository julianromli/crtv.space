export const FOLLOWING_COOKIE_NAME = "crtv_following_targets"

export type FollowMutationResult = {
  followed: boolean
  targetId: string
  count: number
  followedTargetIds: Set<string>
}

function normalizeTargetId(value: string): string {
  const normalizedValue = value.trim()

  if (normalizedValue.includes(",")) {
    return ""
  }

  return normalizedValue
}

function parseCookieHeader(cookieHeader: string | null | undefined): Map<string, string> {
  const cookies = new Map<string, string>()

  if (!cookieHeader) {
    return cookies
  }

  for (const segment of cookieHeader.split(";")) {
    const trimmedSegment = segment.trim()

    if (trimmedSegment.length === 0) {
      continue
    }

    const separatorIndex = trimmedSegment.indexOf("=")
    if (separatorIndex < 0) {
      continue
    }

    const key = trimmedSegment.slice(0, separatorIndex).trim()
    const value = trimmedSegment.slice(separatorIndex + 1)

    if (key.length > 0) {
      cookies.set(key, value)
    }
  }

  return cookies
}

function decodeCookiePart(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return ""
  }
}

export function getFollowedTargetIdsFromCookieHeader(cookieHeader: string | null | undefined): Set<string> {
  const cookies = parseCookieHeader(cookieHeader)
  const encodedValue = cookies.get(FOLLOWING_COOKIE_NAME)

  if (!encodedValue) {
    return new Set<string>()
  }

  const decodedValue = decodeCookiePart(encodedValue)
  if (!decodedValue) {
    return new Set<string>()
  }

  let parsedTargetIds: unknown

  try {
    parsedTargetIds = JSON.parse(decodedValue)
  } catch {
    return new Set<string>()
  }

  if (!Array.isArray(parsedTargetIds)) {
    return new Set<string>()
  }

  const followedTargetIds = new Set<string>()

  for (const rawTargetId of parsedTargetIds) {
    if (typeof rawTargetId !== "string") {
      continue
    }

    const normalizedTargetId = normalizeTargetId(rawTargetId)
    if (normalizedTargetId) {
      followedTargetIds.add(normalizedTargetId)
    }
  }

  return followedTargetIds
}

export function serializeFollowedTargetIdsCookieValue(followedTargetIds: Iterable<string>): string {
  const normalizedUniqueIds = new Set<string>()

  for (const rawTargetId of followedTargetIds) {
    const normalizedTargetId = normalizeTargetId(rawTargetId)
    if (normalizedTargetId) {
      normalizedUniqueIds.add(normalizedTargetId)
    }
  }

  return JSON.stringify([...normalizedUniqueIds])
}

export function followTarget(targetId: string, currentFollowedTargetIds: Iterable<string>): FollowMutationResult | null {
  const normalizedTargetId = normalizeTargetId(targetId)
  if (!normalizedTargetId) {
    return null
  }

  const nextFollowedTargetIds = new Set<string>(currentFollowedTargetIds)
  nextFollowedTargetIds.add(normalizedTargetId)

  return {
    followed: true,
    targetId: normalizedTargetId,
    count: nextFollowedTargetIds.size,
    followedTargetIds: nextFollowedTargetIds,
  }
}

export function unfollowTarget(targetId: string, currentFollowedTargetIds: Iterable<string>): FollowMutationResult | null {
  const normalizedTargetId = normalizeTargetId(targetId)
  if (!normalizedTargetId) {
    return null
  }

  const nextFollowedTargetIds = new Set<string>(currentFollowedTargetIds)
  nextFollowedTargetIds.delete(normalizedTargetId)

  return {
    followed: false,
    targetId: normalizedTargetId,
    count: nextFollowedTargetIds.size,
    followedTargetIds: nextFollowedTargetIds,
  }
}

export function getFollowingCount(followedTargetIds: Iterable<string>) {
  return new Set<string>(followedTargetIds).size
}

export function resetFollowStateForTests() {
  // Retained as a no-op for compatibility with older tests.
}
