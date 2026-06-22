import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, organizationJsonLd } from '@/lib/seo/metadata';

// Deliberately using system font stacks (defined in globals.css via
// --font-display / --font-sans) instead of next/font/google. This removes a
// build-time network dependency on Google Fonts, which matters for CI
// runners and VPS hosts with restricted egress — the build should never fail
// because a font CDN was unreachable. Swap in next/font/local with
// self-hosted font files here if a custom typeface is required later.

export const metadata: Metadata = buildMetadata({
  title: 'Ghana Gold Radio — The Sound of Home, Anywhere in the World',
  path: '/',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

  return (
    <html lang="en">
      <head>
        {/* Runtime stylesheet link (not a build-time fetch) — keeps next build
            independent of Google Fonts availability while still giving
            production users the branded typeface via the browser's own request. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700;800&display=swap"
        />
      </head>
      <body className="font-sans">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        {plausibleDomain && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script defer data-domain={plausibleDomain} src={plausibleSrc} />
        )}
      </body>
    </html>
  );
}
