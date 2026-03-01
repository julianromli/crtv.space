import ProfileClientShell from '@/components/profile/ProfileClientShell';
import { getPortfolioByUsername, getProfileByUsername, normalizeUsername } from '@/lib/data/profile';
import { notFound } from 'next/navigation';

export default async function HandleProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!handle.startsWith('@')) {
    notFound();
  }

  const username = normalizeUsername(handle);
  if (!username) {
    notFound();
  }

  const [profile, portfolioItems] = await Promise.all([
    getProfileByUsername(username),
    getPortfolioByUsername(username),
  ]);

  if (!profile) {
    notFound();
  }

  return <ProfileClientShell initialProfile={profile} portfolioItems={portfolioItems} />;
}
