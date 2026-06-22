import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Newsletter',
  description: 'Subscribe to the Ghana Gold Radio newsletter for Top 10 charts, news, and diaspora updates.',
  path: '/newsletter',
});

export default function NewsletterPage() {
  return (
    <>
      <PageHeader title="Newsletter" description="The Sound of Home, delivered to your inbox." />
      <div className="container-ggr max-w-lg py-10">
        <NewsletterForm />
        <p className="mt-4 text-xs text-white/40">You can manage your preferences or unsubscribe anytime from any email we send.</p>
      </div>
    </>
  );
}
