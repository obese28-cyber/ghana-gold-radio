'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Radio } from 'lucide-react';

const NAV_LINKS = [
  { href: '/top10', label: 'Top 10' },
  { href: '/artists', label: 'Artists' },
  { href: '/highlife', label: 'Highlife' },
  { href: '/gospel', label: 'Gospel' },
  { href: '/afrobeats', label: 'Afrobeats/Hiplife' },
  { href: '/news', label: 'News' },
  { href: '/diaspora', label: 'Diaspora' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ghana-black/95 backdrop-blur">
      <div className="container-ggr flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-gold">
          <Radio className="h-6 w-6" aria-hidden />
          Ghana Gold Radio
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/submit" className="btn-gold text-sm">
            Submit Music
          </Link>
        </div>

        <button
          type="button"
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 pb-4 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-1 text-white/90" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/submit" className="btn-gold mt-2 block text-center" onClick={() => setOpen(false)}>
                Submit Music
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
