import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import GenreLandingPage from '@/components/shared/GenreLandingPage';

export const metadata: Metadata = buildMetadata({
  title: 'Diaspora Updates',
  description: 'Community events, business events, cultural events, travel updates, and Ghanaian organizations abroad.',
  path: '/diaspora',
});
export const dynamic = 'force-dynamic';

export default function DiasporaPage() {
  return (
    <GenreLandingPage
      postType="diaspora_update"
      basePath="/diaspora"
      title="Diaspora Updates"
      description="Stay connected to home — events, organizations, and news for Ghanaians abroad."
    />
  );
}
