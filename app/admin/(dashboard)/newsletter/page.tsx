import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';
import { listSubscribersForAdmin } from '@/lib/repositories/newsletter.repository';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const subscribers = await listSubscribersForAdmin();
  const activeCount = subscribers.filter((s) => !s.unsubscribedAt).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Newsletter</h1>
        <span className="text-sm text-white/60">{activeCount} active subscribers</span>
      </div>
      <DataTable
        rows={subscribers}
        emptyMessage="No subscribers yet."
        columns={[
          { header: 'Email', render: (r) => r.email },
          { header: 'Name', render: (r) => r.fullName ?? '—' },
          { header: 'Country', render: (r) => r.country ?? '—' },
          { header: 'Confirmed', render: (r) => (r.isConfirmed ? 'Yes' : 'No') },
          { header: 'Status', render: (r) => (r.unsubscribedAt ? 'Unsubscribed' : 'Active') },
          { header: 'Joined', render: (r) => format(r.createdAt, 'MMM d, yyyy') },
        ]}
      />
    </div>
  );
}
