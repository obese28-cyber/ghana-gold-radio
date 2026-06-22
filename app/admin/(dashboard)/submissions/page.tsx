import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';
import SubmissionActions from './SubmissionActions';
import { listSubmissionsForAdmin } from '@/lib/repositories/submission.repository';
import type { SubmissionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status as SubmissionStatus | undefined;
  const submissions = await listSubmissionsForAdmin(status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Artist Submissions</h1>
        <form className="flex gap-2" action="/admin/submissions">
          <select name="status" defaultValue={searchParams.status} className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
          <button type="submit" className="btn-outline text-sm">Filter</button>
        </form>
      </div>

      <DataTable
        rows={submissions}
        emptyMessage="No submissions found."
        columns={[
          { header: 'Stage Name', render: (r) => r.stageName },
          { header: 'Song', render: (r) => r.songTitle },
          { header: 'Genre', render: (r) => r.genre },
          { header: 'Country', render: (r) => r.country },
          { header: 'Email', render: (r) => r.email },
          { header: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
          { header: 'Submitted', render: (r) => format(r.createdAt, 'MMM d, yyyy') },
          { header: 'Actions', render: (r) => <SubmissionActions id={r.id} currentStatus={r.status} /> },
        ]}
      />
    </div>
  );
}
