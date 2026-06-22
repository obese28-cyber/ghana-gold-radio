import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import GenreLandingPage from '@/components/shared/GenreLandingPage';

export const metadata: Metadata = buildMetadata({
  title: 'Ghana Gospel',
  description: 'Worship, praise, gospel artist profiles, and our weekly Sunday Spotlight.',
  path: '/gospel',
});
export const dynamic = 'force-dynamic';

export default function GospelPage() {
  return (
    <GenreLandingPage
      postType="gospel"
      basePath="/gospel"
      title="Ghana Gospel"
      description="Uplifting worship and praise music from Ghana's gospel artists."
    />
  );
}
