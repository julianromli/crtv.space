import { redirect } from 'next/navigation';
import { getCurrentProfileUsername } from '@/lib/data/profile';

export default function ProfilePage() {
  redirect(`/@${getCurrentProfileUsername()}`);
}
