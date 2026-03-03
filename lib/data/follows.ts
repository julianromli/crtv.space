const followedTargetIds = new Set<string>();

function normalizeTargetId(value: string): string {
  return value.trim();
}

export function followTarget(targetId: string) {
  const normalizedTargetId = normalizeTargetId(targetId);
  if (!normalizedTargetId) {
    return null;
  }

  followedTargetIds.add(normalizedTargetId);

  return {
    followed: true as const,
    targetId: normalizedTargetId,
    count: followedTargetIds.size,
  };
}

export function unfollowTarget(targetId: string) {
  const normalizedTargetId = normalizeTargetId(targetId);
  if (!normalizedTargetId) {
    return null;
  }

  followedTargetIds.delete(normalizedTargetId);

  return {
    followed: false as const,
    targetId: normalizedTargetId,
    count: followedTargetIds.size,
  };
}

export function getFollowingCount() {
  return followedTargetIds.size;
}

export function resetFollowStateForTests() {
  followedTargetIds.clear();
}
