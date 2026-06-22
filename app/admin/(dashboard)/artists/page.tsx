import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { listArtistsForAdmin } from '@/lib/repositories/artist.repository';

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const artists = await listArtistsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Artists</h1>
        <Link href="/admin/artists/new" className="btn-gold text-sm">
          + New Artist
        </Link>
      </div>
      <DataTable
        rows={artists}
        emptyMessage="No artists yet."
        columns={[
          { header: 'Stage Name', render: (r) => r.stageName },
          { header: 'Genres', render: (r) => (r.genres || []).join(', ') },
          { header: 'Featured', render: (r) => (r.isFeatured ? 'Yes' : 'No') },
          { header: 'Permission', render: (r) => r.permissionStatus },
          { header: 'Verified', render: (r) => (r.verified ? 'Yes' : 'No') },
          {
            header: 'Actions',
            render: (r) => (
              <Link href={`/admin/artists/${r.id}`} className="text-gold hover:underline">
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
