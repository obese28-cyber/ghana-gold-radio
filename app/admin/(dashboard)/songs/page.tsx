import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { listSongsForAdmin } from '@/lib/repositories/song.repository';

export const dynamic = 'force-dynamic';

export default async function AdminSongsPage() {
  const songs = await listSongsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Songs</h1>
        <Link href="/admin/songs/new" className="btn-gold text-sm">
          + New Song
        </Link>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Songs created here become selectable when adding items to a Top 10 chart.
      </p>
      <DataTable
        rows={songs}
        emptyMessage="No songs yet. Add one before building a Top 10 chart."
        columns={[
          { header: 'Title', render: (r) => r.title },
          { header: 'Artist', render: (r) => r.artist.stageName },
          { header: 'Genre', render: (r) => r.genre || '—' },
          { header: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
        ]}
      />
    </div>
  );
}
