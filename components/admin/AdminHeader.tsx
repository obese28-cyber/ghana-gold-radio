'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function AdminHeader({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-black/40 px-6">
      <span className="text-sm text-white/60">{userEmail}</span>
      <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/70 hover:text-gold">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </header>
  );
}
