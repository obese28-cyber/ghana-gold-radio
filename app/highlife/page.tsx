import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import GenreLandingPage from '@/components/shared/GenreLandingPage';

export const metadata: Metadata = buildMetadata({
  title: 'Old School Highlife',
  description: 'Highlife legends, 80s, 90s, 2000s, wedding classics, and cultural classics.',
  path: '/highlife',
});
export const dynamic = 'force-dynamic';

export default function HighlifePage() {
  return (
    <GenreLandingPage
      postType="highlife"
      basePath="/highlife"
      title="Old School Highlife"
      description="From the legends to wedding-day favorites — explore the eras of Ghanaian Highlife."
    />
  );
}
