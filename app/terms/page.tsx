import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({ title: 'Terms of Service', path: '/terms' });

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" description={`Last updated: ${new Date().toLocaleDateString()}`} />
      <div className="container-ggr max-w-2xl py-10 space-y-4 text-white/80 text-sm">
        <p>
          By submitting music to Ghana Gold Radio, you confirm that you own or are authorized to represent the
          rights to the submitted material, and you grant us permission to use your provided bio, press photo, and
          official links (YouTube, streaming platforms, social media) for promotional purposes on our website,
          newsletter, and social channels.
        </p>
        <p>
          Ghana Gold Radio does not host, download, re-upload, or restream copyrighted audio. We link only to
          official sources. Embeds (e.g. YouTube) are used only where platform terms permit.
        </p>
        <p>
          We reserve the right to decline or remove any submission at our discretion, including for rights or
          quality concerns. Continued use of this site constitutes acceptance of these terms, which may be updated
          periodically.
        </p>
      </div>
    </>
  );
}
