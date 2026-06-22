import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description: 'Learn about Ghana Gold Radio’s mission to connect Ghanaian music lovers worldwide.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Ghana Gold Radio" description="The Sound of Home, Anywhere in the World." />
      <div className="container-ggr max-w-2xl py-10 space-y-4 text-white/80">
        <p>
          Ghana Gold Radio is a digital platform built for Ghanaian music lovers and the Ghanaian diaspora across the
          USA, Canada, UK, Europe, and beyond. We celebrate Highlife, Gospel, Afrobeats, Hiplife, and the artists
          shaping Ghana&apos;s sound today.
        </p>
        <p>
          We are building an audience-first platform: weekly Top 10 charts, an artist directory, music news, and
          diaspora community updates — all while respecting artist rights. We never host or restream copyrighted
          music without explicit permission. We link only to official sources and tracked, permissioned content.
        </p>
        <p>
          In the future, Ghana Gold Radio plans to launch legal, artist-approved streaming, a mobile app, and tools
          for artists and sponsors to grow together with our community.
        </p>
      </div>
    </>
  );
}
