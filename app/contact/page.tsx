import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import ContactForm from '@/components/forms/ContactForm';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the Ghana Gold Radio team.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" description="Questions, press inquiries, or feedback — we'd love to hear from you." />
      <div className="container-ggr max-w-xl py-10">
        <ContactForm />
      </div>
    </>
  );
}
