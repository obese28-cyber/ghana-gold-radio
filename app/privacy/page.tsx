import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({ title: 'Privacy Policy', path: '/privacy', noIndex: false });

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" description={`Last updated: ${new Date().toLocaleDateString()}`} />
      <div className="container-ggr max-w-2xl py-10 space-y-4 text-white/80 text-sm">
        <p>
          Ghana Gold Radio (&quot;we&quot;, &quot;us&quot;) collects information you voluntarily provide through
          our artist submission, newsletter, contact, and sponsorship forms, including name, email, phone, and
          social media links. We use this information solely to operate the platform: reviewing submissions,
          sending newsletters, and responding to inquiries.
        </p>
        <p>
          We use privacy-focused analytics (Plausible) that do not use cookies or track individuals across sites.
          We do not sell personal data to third parties. Newsletter subscribers may unsubscribe at any time via the
          link in any email.
        </p>
        <p>
          Data is stored securely in our self-hosted PostgreSQL database. For data access or deletion
          requests, contact us via the Contact page.
        </p>
      </div>
    </>
  );
}
