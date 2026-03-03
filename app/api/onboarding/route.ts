import { NextResponse } from 'next/server';
import {
  getCurrentOnboardingUserId,
  getOnboardingState,
  isValidOnboardingPatch,
  patchOnboardingState,
} from '@/lib/data/onboarding';
import { getCurrentProfileUsername } from '@/lib/data/profile';
import { normalizeHandle, validateHandle } from '@/lib/routing/handle';
import { createAnalyticsEvent } from '@/lib/analytics/events';
import { ingestAnalyticsEvent } from '@/lib/analytics/pipeline';

export async function GET() {
  const userId = getCurrentOnboardingUserId();
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

  const userId = getCurrentOnboardingUserId();
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
    response.cookies.set("crtv_onboarding_completed", payload.usernameCompleted ? "1" : "0", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  }

  return response;
}
