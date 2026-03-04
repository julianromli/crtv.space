const LEADING_PROTOCOL_PATTERN = /^\/(?:https?|javascript|data|vbscript|file):/i

export function sanitizeNextPath(candidate: string | null | undefined): string | null {
  if (typeof candidate !== "string") {
    return null
  }

  const nextPath = candidate.trim()

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return null
  }

  if (nextPath.includes("://") || LEADING_PROTOCOL_PATTERN.test(nextPath)) {
    return null
  }

  return nextPath
}
