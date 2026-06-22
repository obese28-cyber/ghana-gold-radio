import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/shared/PageHeader';
import { buildMetadata } from '@/lib/seo/metadata';
import { findManyArtists } from '@/lib/repositories/artist.repository';

export const metadata: Metadata = buildMetadata({
  title: 'Artist Directory',
  description: 'Discover independent Ghanaian artists — bios, genres, social links, and more.',
  path: '/artists',
});

export const dynamic = 'force-dynamic';

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: { q?: string; genre?: string };
}) {
  const artists = await findManyArtists({ query: searchParams.q, genre: searchParams.genre, limit: 60 });

  return (
    <>
      <PageHeader title="Artist Directory" description="Independent Ghanaian artists building the future of the sound." />
      <div className="container-ggr py-10">
        <form className="mb-8 flex flex-wrap gap-3" action="/artists">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search artists…"
            className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white"
          />
          <select name="genre" defaultValue={searchParams.genre} className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white">
            <option value="">All genres</option>
            <option value="Highlife">Highlife</option>
            <option value="Gospel">Gospel</option>
            <option value="Afrobeats">Afrobeats</option>
            <option value="Hiplife">Hiplife</option>
          </select>
          <button type="submit" className="btn-outline">
            Filter
          </button>
        </form>

        {artists.length === 0 ? (
          <p className="text-white/60">No artists found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link key={artist.slug} href={`/artists/${artist.slug}`} className="card-ggr">
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-md bg-white/10">
                  {artist.pressPhotoUrl ? (
                    <Image src={artist.pressPhotoUrl} alt={artist.stageName} fill className="object-cover" sizes="350px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40">No photo</div>
                  )}
                </div>
                <h3 className="font-semibold text-white">{artist.stageName}</h3>
                <p className="mt-1 text-sm text-gold">{artist.genres?.join(' • ')}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
