import { RESERVED_HANDLE_SET } from "@/lib/routing/reserved-handles"

const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])?$/

export function normalizeHandle(input: string): string {
  return input.trim().replace(/^@+/, "").toLowerCase()
}

export function validateHandle(normalized: string): boolean {
  return HANDLE_PATTERN.test(normalized)
}

export function isReservedHandle(normalized: string): boolean {
  return RESERVED_HANDLE_SET.has(normalized)
}
