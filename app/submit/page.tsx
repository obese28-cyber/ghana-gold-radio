import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import SubmitMusicForm from '@/components/forms/SubmitMusicForm';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Submit Your Music',
  description: 'Submit your music to Ghana Gold Radio for a chance to be featured.',
  path: '/submit',
});

export default function SubmitPage() {
  return (
    <>
      <PageHeader
        title="Submit Your Music"
        description="Share your music with Ghana Gold Radio. We never host or restream copyrighted audio — submissions are used for promotion via official links only."
      />
      <div className="container-ggr max-w-2xl py-10">
        <SubmitMusicForm />
      </div>
    </>
  );
}
