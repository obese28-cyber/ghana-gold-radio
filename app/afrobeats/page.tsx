import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import GenreLandingPage from '@/components/shared/GenreLandingPage';

export const metadata: Metadata = buildMetadata({
  title: 'Afrobeats / Hiplife',
  description: 'Afrobeats, Hiplife, Asakaa, new releases, and trending Ghanaian artists.',
  path: '/afrobeats',
});
export const dynamic = 'force-dynamic';

export default function AfrobeatsPage() {
  return (
    <GenreLandingPage
      postType="afrobeats_hiplife"
      basePath="/afrobeats"
      title="Afrobeats / Hiplife"
      description="The sound of now — Afrobeats, Hiplife, and the Asakaa movement."
    />
  );
}
