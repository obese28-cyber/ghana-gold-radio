import Link from 'next/link';
import { listArtistsForAdmin } from '@/lib/repositories/artist.repository';
import NewSongForm from './NewSongForm';

export const dynamic = 'force-dynamic';

export default async function NewSongPage() {
  const artists = await listArtistsForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">New Song</h1>
      {artists.length === 0 ? (
        <div className="card-ggr max-w-xl">
          <p className="text-white/70">
            You need at least one artist before you can add a song.{' '}
            <Link href="/admin/artists/new" className="text-gold underline">
              Create an artist first
            </Link>
            .
          </p>
        </div>
      ) : (
        <NewSongForm artists={artists.map((a) => ({ id: a.id, stageName: a.stageName }))} />
      )}
    </div>
  );
}
