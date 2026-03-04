import { NextResponse } from "next/server"
import { ingestAnalyticsEvent } from "@/lib/analytics/pipeline"

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const ingestResult = ingestAnalyticsEvent(payload)
  if (!ingestResult.ok) {
    return NextResponse.json({ error: ingestResult.error }, { status: 400 })
  }

  return NextResponse.json({ accepted: true }, { status: 202 })
}
