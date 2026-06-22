import Image from 'next/image';
import Link from 'next/link';

export interface FeaturedArtistData {
  slug: string;
  stageName: string;
  bio: string | null;
  genres: string[];
  pressPhotoUrl: string | null;
}

export default function FeaturedArtist({ artist }: { artist: FeaturedArtistData | null }) {
  if (!artist) return null;

  return (
    <section className="container-ggr py-14">
      <h2 className="section-heading mb-6">Featured Artist</h2>
      <div className="card-ggr flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
          {artist.pressPhotoUrl ? (
            <Image src={artist.pressPhotoUrl} alt={artist.stageName} fill className="object-cover" sizes="192px" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No photo</div>
          )}
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white">{artist.stageName}</h3>
          <p className="mt-1 text-sm text-gold">{artist.genres.join(' • ')}</p>
          <p className="mt-3 max-w-2xl text-white/70">{artist.bio}</p>
          <Link href={`/artists/${artist.slug}`} className="btn-outline mt-4 inline-block">
            View Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
