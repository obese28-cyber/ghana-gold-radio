import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';
import { listSponsorInquiriesForAdmin } from '@/lib/repositories/sponsor.repository';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  const inquiries = await listSponsorInquiriesForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Sponsor Inquiries</h1>
      <DataTable
        rows={inquiries}
        emptyMessage="No sponsor inquiries yet."
        columns={[
          { header: 'Company', render: (r) => r.companyName },
          { header: 'Contact', render: (r) => r.contactName },
          { header: 'Email', render: (r) => r.email },
          { header: 'Status', render: (r) => r.status },
          { header: 'Received', render: (r) => format(r.createdAt, 'MMM d, yyyy') },
        ]}
      />
    </div>
  );
}
