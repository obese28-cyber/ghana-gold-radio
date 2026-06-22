import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      { href: '/top10', label: 'Top 10 Charts' },
      { href: '/artists', label: 'Artist Directory' },
      { href: '/news', label: 'Music News' },
      { href: '/diaspora', label: 'Diaspora Updates' },
    ],
  },
  {
    title: 'Genres',
    links: [
      { href: '/highlife', label: 'Old School Highlife' },
      { href: '/gospel', label: 'Ghana Gospel' },
      { href: '/afrobeats', label: 'Afrobeats / Hiplife' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { href: '/submit', label: 'Submit Your Music' },
      { href: '/sponsor', label: 'Sponsor Us' },
      { href: '/newsletter', label: 'Newsletter' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container-ggr grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-ggr flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Ghana Gold Radio. All rights reserved.</p>
        <p>The Sound of Home, Anywhere in the World.</p>
      </div>
    </footer>
  );
}
