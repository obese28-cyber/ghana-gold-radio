import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo/metadata';
import { findArtistBySlug } from '@/lib/repositories/artist.repository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await findArtistBySlug(params.slug);
  if (!artist) return buildMetadata({ title: 'Artist Not Found', path: `/artists/${params.slug}`, noIndex: true });
  return buildMetadata({
    title: artist.stageName,
    description: artist.bio ?? undefined,
    path: `/artists/${params.slug}`,
    image: artist.pressPhotoUrl ?? undefined,
  });
}

export default async function ArtistProfilePage({ params }: { params: { slug: string } }) {
  const artist = await findArtistBySlug(params.slug);
  if (!artist) notFound();

  const social = (artist.socialLinks ?? {}) as Record<string, string>;

  return (
    <div className="container-ggr py-12">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
          {artist.pressPhotoUrl ? (
            <Image src={artist.pressPhotoUrl} alt={artist.stageName} fill className="object-cover" sizes="256px" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No photo</div>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{artist.stageName}</h1>
          <p className="mt-1 text-gold">{artist.genres?.join(' • ')}</p>
          <p className="mt-1 text-sm text-white/50">
            {artist.city ? `${artist.city}, ` : ''}
            {artist.country}
          </p>
          {artist.bio && <p className="mt-4 max-w-2xl text-white/80">{artist.bio}</p>}
          {artist.bioAiGenerated && <p className="mt-1 text-xs text-white/40">Bio drafted with AI assistance, reviewed by our editors.</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            {Object.entries(social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm capitalize text-white/80 hover:border-gold hover:text-gold"
              >
                {platform}
              </a>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/40">
            Permission status: <span className="font-medium text-white/60">{artist.permissionStatus}</span>
          </div>
        </div>
      </div>

      {artist.songs && artist.songs.length > 0 && (
        <div className="mt-10">
          <h2 className="section-heading mb-4">Songs</h2>
          <ul className="space-y-2">
            {artist.songs.map((song) => (
              <li key={song.id} className="card-ggr flex items-center justify-between">
                <span className="text-white">{song.title}</span>
                {song.officialYoutubeUrl && (
                  <a
                    href={song.officialYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm font-medium text-gold hover:underline"
                  >
                    Watch Official Video
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
