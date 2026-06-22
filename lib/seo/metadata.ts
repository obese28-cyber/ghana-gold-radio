import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghanagoldradio.com';
const SITE_NAME = 'Ghana Gold Radio';
const DEFAULT_DESCRIPTION =
  'Ghana Gold Radio — The Sound of Home, Anywhere in the World. Top 10 Ghana charts, Highlife, Gospel, Afrobeats/Hiplife, artist directory, music news, and diaspora updates.';

export interface PageSeoInput {
  title: string;
  description?: string;
  path?: string; // e.g. '/top10'
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata(input: PageSeoInput): Metadata {
  const url = `${SITE_URL}${input.path ?? ''}`;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const image = input.image ?? `${SITE_URL}/images/og-default.jpg`;
  const title = `${input.title} | ${SITE_NAME}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL) as any,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [],
    description: DEFAULT_DESCRIPTION,
  };
}

export function musicPlaylistJsonLd(entries: Array<{ name: string; artist: string; position: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Ghana Gold Radio Top 10',
    numTracks: entries.length,
    track: entries.map((e) => ({
      '@type': 'MusicRecording',
      name: e.name,
      byArtist: { '@type': 'MusicGroup', name: e.artist },
      position: e.position,
    })),
  };
}

export function articleJsonLd(post: { title: string; description: string; publishedTime: string; image?: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedTime,
    image: post.image ? [post.image] : undefined,
    mainEntityOfPage: post.url,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}
