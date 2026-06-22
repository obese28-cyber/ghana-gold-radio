import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import SponsorInquiryForm from '@/components/forms/SponsorInquiryForm';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Sponsor Ghana Gold Radio',
  description: 'Sponsorship packages for brands, labels, and event organizers reaching the Ghanaian diaspora.',
  path: '/sponsor',
});

const PACKAGES = [
  { tier: 'Bronze', price: '$199/mo', features: ['Logo on website footer', 'Mention in newsletter (monthly)'] },
  { tier: 'Silver', price: '$499/mo', features: ['Homepage banner', 'Newsletter mention (bi-weekly)', 'Social shoutout'] },
  { tier: 'Gold', price: '$999/mo', features: ['Premium homepage placement', 'Weekly newsletter feature', '2 social posts/mo', 'Event co-branding'] },
  { tier: 'Platinum', price: 'Custom', features: ['Full custom partnership', 'Dedicated content series', 'Event sponsorship', 'Priority placement everywhere'] },
];

export default function SponsorPage() {
  return (
    <>
      <PageHeader title="Sponsor Ghana Gold Radio" description="Reach Ghanaian music lovers and the diaspora worldwide." />
      <div className="container-ggr py-10">
        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <div key={pkg.tier} className="card-ggr">
              <h3 className="font-display text-xl font-bold text-gold">{pkg.tier}</h3>
              <p className="mt-1 text-lg text-white">{pkg.price}</p>
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {pkg.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-xl">
          <h2 className="section-heading mb-4">Get In Touch</h2>
          <SponsorInquiryForm />
        </div>
      </div>
    </>
  );
}
