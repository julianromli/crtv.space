import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import {
  getOnboardingState,
  isValidOnboardingPatch,
  patchOnboardingState,
} from '@/lib/data/onboarding';
import { getCurrentProfileUsername } from '@/lib/data/profile';
import { normalizeHandle, validateHandle } from '@/lib/routing/handle';
import { ONBOARDING_COOKIE_NAME } from "@/lib/routing/cookies";
import { createAnalyticsEvent } from '@/lib/analytics/events';
import { ingestAnalyticsEvent } from '@/lib/analytics/pipeline';

async function getOnboardingUserId() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return userId;
}

export async function GET() {
  const userId = await getOnboardingUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = getOnboardingState(userId);
  return NextResponse.json({ onboarding });
}

export async function PATCH(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed onboarding payload' }, { status: 400 });
  }

  if (!isValidOnboardingPatch(payload)) {
    return NextResponse.json({ error: 'Malformed onboarding payload' }, { status: 400 });
  }

  if (payload.usernameCompleted === true) {
    const normalizedUsername = normalizeHandle(getCurrentProfileUsername());

    if (!validateHandle(normalizedUsername)) {
      return NextResponse.json(
        { error: 'Cannot complete onboarding without a valid username' },
        { status: 422 }
      );
    }
  }

  const userId = await getOnboardingUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = patchOnboardingState(payload, userId);

  if (payload.optionalStepAction?.action === 'skip') {
    ingestAnalyticsEvent(
      createAnalyticsEvent({
        event: 'onboarding_step_skipped',
        context: {
          path: '/onboarding',
          source: 'onboarding_api_patch',
          userId,
        },
        payload: {
          step: payload.optionalStepAction.step,
        },
      })
    );
  }

  const response = NextResponse.json({ onboarding });

  if (typeof payload.usernameCompleted === "boolean") {
    response.cookies.set(ONBOARDING_COOKIE_NAME, payload.usernameCompleted ? "1" : "0", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  }

  return response;
}
