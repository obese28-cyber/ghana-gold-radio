import { NextRequest } from 'next/server';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { findManyArtists } from '@/lib/repositories/artist.repository';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || undefined;
  const genre = req.nextUrl.searchParams.get('genre') || undefined;

  try {
    const artists = await findManyArtists({ query, genre, limit: 100 });
    return jsonOk(artists);
  } catch (err) {
    console.error('artists fetch error', err);
    return jsonError('Failed to load artists.', 500);
  }
}
