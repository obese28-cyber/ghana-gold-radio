'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Music2, ListMusic, Newspaper, Mail, UserCog,
  BarChart3, Sparkles, FolderTree, HandCoins, ClipboardList,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/submissions', label: 'Submissions', icon: ClipboardList },
  { href: '/admin/artists', label: 'Artists', icon: Users },
  { href: '/admin/charts', label: 'Top 10 Charts', icon: ListMusic },
  { href: '/admin/news', label: 'News & Posts', icon: Newspaper },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/sponsors', label: 'Sponsors', icon: HandCoins },
  { href: '/admin/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: UserCog },
  { href: '/admin/settings', label: 'Settings', icon: Music2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-black/60 lg:block">
      <div className="px-6 py-5">
        <Link href="/admin" className="font-display text-lg font-bold text-gold">
          Ghana Gold Radio
        </Link>
        <p className="text-xs text-white/40">Admin Dashboard</p>
      </div>
      <nav className="space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-gold/10 text-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
