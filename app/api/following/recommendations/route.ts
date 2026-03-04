import { NextResponse } from 'next/server';

type Recommendation = {
  id: string;
  handle: string;
  displayName: string;
};

const DEFAULT_LIMIT = 5;
const MIN_LIMIT = 1;
const MAX_LIMIT = 20;
const SEED = 20260301;

const SEEDED_RECOMMENDATIONS: Recommendation[] = [
  { id: 'u_001', handle: 'nina.codes', displayName: 'Nina Calder' },
  { id: 'u_002', handle: 'alexwave', displayName: 'Alex Watanabe' },
  { id: 'u_003', handle: 'mara.pixel', displayName: 'Mara Chen' },
  { id: 'u_004', handle: 'devonfield', displayName: 'Devon Fielding' },
  { id: 'u_005', handle: 'zara.builds', displayName: 'Zara Ibrahim' },
  { id: 'u_006', handle: 'tobi.journal', displayName: 'Tobias Kim' },
  { id: 'u_007', handle: 'salma.design', displayName: 'Salma Haddad' },
  { id: 'u_008', handle: 'kai.stream', displayName: 'Kai Nakamura' },
  { id: 'u_009', handle: 'lena.systems', displayName: 'Lena Novak' },
  { id: 'u_010', handle: 'rory.loop', displayName: 'Rory Patel' },
  { id: 'u_011', handle: 'mina.alpha', displayName: 'Mina Russo' },
  { id: 'u_012', handle: 'omar.graph', displayName: 'Omar Salim' },
];

function clampLimit(rawLimit: string | null): number {
  if (!rawLimit) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(rawLimit, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, parsed));
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRecommendations(limit: number): Recommendation[] {
  const random = createSeededRandom(SEED);
  const pool = [...SEEDED_RECOMMENDATIONS];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, limit);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = clampLimit(url.searchParams.get('limit'));

  return NextResponse.json({
    recommendations: pickRecommendations(limit),
  });
}
