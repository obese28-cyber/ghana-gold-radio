import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';
import { listChartsForAdmin } from '@/lib/repositories/chart.repository';

export const dynamic = 'force-dynamic';

export default async function AdminChartsPage() {
  const charts = await listChartsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Top 10 Charts</h1>
        <Link href="/admin/charts/new" className="btn-gold text-sm">
          + New Chart
        </Link>
      </div>
      <DataTable
        rows={charts}
        emptyMessage="No charts created yet."
        columns={[
          {
            header: 'Week',
            render: (r) => `${format(r.weekStartDate, 'MMM d')} – ${format(r.weekEndDate, 'MMM d, yyyy')}`,
          },
          { header: 'AI Review', render: (r) => r.aiReviewStatus },
          { header: 'Published', render: (r) => (r.isPublished ? 'Yes' : 'No') },
          {
            header: 'Actions',
            render: (r) => (
              <Link href={`/admin/charts/${r.id}`} className="text-gold hover:underline">
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
