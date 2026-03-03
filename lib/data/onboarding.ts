export const OPTIONAL_ONBOARDING_STEPS = ['followCreators', 'completeOptionalProfile'] as const;

export type OptionalOnboardingStep = (typeof OPTIONAL_ONBOARDING_STEPS)[number];

export type OptionalStepStatus = 'pending' | 'completed' | 'skipped';

export type OnboardingState = {
  usernameCompleted: boolean;
  optionalSteps: Record<OptionalOnboardingStep, OptionalStepStatus>;
  revision: number;
};

export type OptionalStepAction = {
  step: OptionalOnboardingStep;
  action: 'complete' | 'skip';
};

export type OnboardingPatch = {
  usernameCompleted?: boolean;
  optionalStepAction?: OptionalStepAction;
};

const CURRENT_ONBOARDING_USER_ID = 'current-user';

const onboardingSeedByUserId: Record<string, OnboardingState> = {
  [CURRENT_ONBOARDING_USER_ID]: {
    usernameCompleted: false,
    optionalSteps: {
      followCreators: 'pending',
      completeOptionalProfile: 'pending',
    },
    revision: 1,
  },
};

const mutableOnboardingStateByUserId: Record<string, OnboardingState> = {
  [CURRENT_ONBOARDING_USER_ID]: cloneState(onboardingSeedByUserId[CURRENT_ONBOARDING_USER_ID]),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOptionalStep(step: string): step is OptionalOnboardingStep {
  return OPTIONAL_ONBOARDING_STEPS.includes(step as OptionalOnboardingStep);
}

function cloneOptionalSteps(
  optionalSteps: Record<OptionalOnboardingStep, OptionalStepStatus>
): Record<OptionalOnboardingStep, OptionalStepStatus> {
  return {
    followCreators: optionalSteps.followCreators,
    completeOptionalProfile: optionalSteps.completeOptionalProfile,
  };
}

function cloneState(state: OnboardingState): OnboardingState {
  return {
    usernameCompleted: state.usernameCompleted,
    optionalSteps: cloneOptionalSteps(state.optionalSteps),
    revision: state.revision,
  };
}

export function getCurrentOnboardingUserId(): string {
  return CURRENT_ONBOARDING_USER_ID;
}

export function getOnboardingState(userId = CURRENT_ONBOARDING_USER_ID): OnboardingState {
  const state = mutableOnboardingStateByUserId[userId] ?? onboardingSeedByUserId[CURRENT_ONBOARDING_USER_ID];
  return cloneState(state);
}

export function isValidOnboardingPatch(payload: unknown): payload is OnboardingPatch {
  if (!isRecord(payload)) {
    return false;
  }

  const payloadKeys = Object.keys(payload);
  if (payloadKeys.length === 0) {
    return false;
  }

  for (const key of payloadKeys) {
    if (key !== 'usernameCompleted' && key !== 'optionalStepAction') {
      return false;
    }
  }

  if ('usernameCompleted' in payload && typeof payload.usernameCompleted !== 'boolean') {
    return false;
  }

  if (!('optionalStepAction' in payload)) {
    return true;
  }

  if (!isRecord(payload.optionalStepAction)) {
    return false;
  }

  const actionKeys = Object.keys(payload.optionalStepAction);
  if (actionKeys.length !== 2) {
    return false;
  }

  if (!('step' in payload.optionalStepAction) || !('action' in payload.optionalStepAction)) {
    return false;
  }

  if (typeof payload.optionalStepAction.step !== 'string') {
    return false;
  }

  if (!isOptionalStep(payload.optionalStepAction.step)) {
    return false;
  }

  if (payload.optionalStepAction.action !== 'complete' && payload.optionalStepAction.action !== 'skip') {
    return false;
  }

  return true;
}

export function patchOnboardingState(
  patch: OnboardingPatch,
  userId = CURRENT_ONBOARDING_USER_ID
): OnboardingState {
  const current = getOnboardingState(userId);

  const nextOptionalSteps: Record<OptionalOnboardingStep, OptionalStepStatus> = cloneOptionalSteps(
    current.optionalSteps
  );

  if (patch.optionalStepAction) {
    nextOptionalSteps[patch.optionalStepAction.step] =
      patch.optionalStepAction.action === 'complete' ? 'completed' : 'skipped';
  }

  const nextState: OnboardingState = {
    usernameCompleted: patch.usernameCompleted ?? current.usernameCompleted,
    optionalSteps: nextOptionalSteps,
    revision: current.revision + 1,
  };

  mutableOnboardingStateByUserId[userId] = cloneState(nextState);
  return cloneState(nextState);
}
