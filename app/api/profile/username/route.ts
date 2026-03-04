import { NextResponse } from 'next/server';
import {
  isReservedHandle,
  normalizeHandle,
  validateHandle,
} from '@/lib/routing/handle';

type UsernamePayload = {
  username?: unknown;
};

export async function PATCH(request: Request) {
  let payload: UsernamePayload;

  try {
    payload = (await request.json()) as UsernamePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof payload.username !== 'string') {
    return NextResponse.json({ error: 'Username must be a string' }, { status: 400 });
  }

  const username = normalizeHandle(payload.username);

  if (!validateHandle(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  if (isReservedHandle(username)) {
    return NextResponse.json({ error: 'Username is reserved' }, { status: 409 });
  }

  return NextResponse.json({ username });
}
