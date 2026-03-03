import { unstable_cache } from 'next/cache';
import type { PortfolioItem } from '@/types/gallery';
import type { ProfileLockMetadata, UserProfile, ViewerMode } from '@/types/profile';

const CURRENT_PROFILE_USERNAME = 'faiz-intifada';

type UserProfileSeed = Omit<UserProfile, 'viewerMode'>;

const profileSeedByUsername: Record<string, UserProfileSeed> = {
  [CURRENT_PROFILE_USERNAME]: {
    name: 'Faiz Intifada',
    username: 'faiz-intifada',
    avatar: 'https://picsum.photos/seed/user/200/200',
    bio: 'Community Manager @aiforproductivity.id\nFounder @crtv.space @cinemart.official\nBuild crtv.space\n🔗 threads.com/@faizntfd',
  },
};

const portfolioSeedByUsername: Record<string, PortfolioItem[]> = {
  [CURRENT_PROFILE_USERNAME]: [
    { id: 1, src: 'https://picsum.photos/seed/p1/600/800', alt: 'AI Art 1', aspect: 'aspect-[3/4]', type: 'image', width: 600, height: 800 },
    { id: 2, src: 'https://picsum.photos/seed/p2/600/600', alt: 'AI Video 1', aspect: 'aspect-square', type: 'video', width: 600, height: 600 },
    { id: 3, src: 'https://picsum.photos/seed/p3/600/800', alt: 'AI Art 2', aspect: 'aspect-[3/4]', type: 'image', width: 600, height: 800 },
    { id: 4, src: 'https://picsum.photos/seed/p4/600/600', alt: 'AI Art 3', aspect: 'aspect-square', type: 'image', width: 600, height: 600 },
    { id: 5, src: 'https://picsum.photos/seed/p5/600/800', alt: 'AI Video 2', aspect: 'aspect-[3/4]', type: 'video', width: 600, height: 800 },
    { id: 6, src: 'https://picsum.photos/seed/p6/600/600', alt: 'AI Art 4', aspect: 'aspect-square', type: 'image', width: 600, height: 600 },
  ],
};

export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, '').toLowerCase();
}

export function getCurrentProfileUsername(): string {
  return CURRENT_PROFILE_USERNAME;
}

export function resolveViewerMode(value: string | null | undefined): ViewerMode {
  return value === 'logged_in' ? 'logged_in' : 'logged_out';
}

export function resolveViewerModeFromSearchParam(value: string | string[] | null | undefined): ViewerMode {
  const rawViewerMode = Array.isArray(value) ? value[0] : value;
  return resolveViewerMode(rawViewerMode);
}

function resolveLockMetadata(viewerMode: ViewerMode): ProfileLockMetadata {
  const isLocked = viewerMode === 'logged_out';
  return {
    sections: {
      portfolio: isLocked,
      contact: isLocked,
    },
    ctaHint: 'auth_required',
  };
}

export async function getProfileByUsernameUncached(username: string, viewerMode: ViewerMode = 'logged_out') {
  const normalizedUsername = normalizeUsername(username);
  const profile = profileSeedByUsername[normalizedUsername];
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    viewerMode,
    lockMetadata: resolveLockMetadata(viewerMode),
  };
}

export const getProfileByUsername = unstable_cache(
  getProfileByUsernameUncached,
  ['profile-by-username'],
  { revalidate: 300 }
);

export const getPortfolioByUsername = unstable_cache(
  async (username: string) => {
    const normalizedUsername = normalizeUsername(username);
    return portfolioSeedByUsername[normalizedUsername] ?? [];
  },
  ['portfolio-by-username'],
  { revalidate: 300 }
);
