import { notFound } from 'next/navigation';
import { findArtistById } from '@/lib/repositories/artist.repository';
import ArtistEditForm from './ArtistEditForm';

export const dynamic = 'force-dynamic';

export default async function EditArtistPage({ params }: { params: { id: string } }) {
  const artist = await findArtistById(params.id);
  if (!artist) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Edit Artist</h1>
      <ArtistEditForm artist={artist} />
    </div>
  );
}
