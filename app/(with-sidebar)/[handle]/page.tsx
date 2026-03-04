import { notFound, redirect } from 'next/navigation';
import ProfileClientShell from '@/components/profile/ProfileClientShell';
import {
  getPortfolioByUsername,
  getProfileByUsername,
  normalizeUsername,
  resolveViewerModeFromSearchParam,
} from '@/lib/data/profile';

export default async function HandleProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ viewerMode?: string | string[] }>;
}) {
  const { handle } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewerMode = resolveViewerModeFromSearchParam(resolvedSearchParams?.viewerMode);
  let decodedHandle = handle;
  try {
    decodedHandle = decodeURIComponent(handle);
  } catch {
    decodedHandle = handle;
  }

  const username = normalizeUsername(decodedHandle);
  if (!username) {
    notFound();
  }

  const canonicalHandle = `@${username}`;
  const canonicalPath = `/${canonicalHandle}`;
  if (decodedHandle !== canonicalHandle) {
    const canonicalUrl = viewerMode === 'logged_in' ? `${canonicalPath}?viewerMode=logged_in` : canonicalPath;
    redirect(canonicalUrl);
  }

  const [profile, portfolioItems] = await Promise.all([
    getProfileByUsername(username, viewerMode),
    getPortfolioByUsername(username),
  ]);

  if (!profile) {
    notFound();
  }

  return <ProfileClientShell initialProfile={profile} portfolioItems={portfolioItems} />;
}
