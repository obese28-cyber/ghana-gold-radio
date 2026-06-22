import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { findFeaturedArtistCandidates, clearFeaturedArtists, setFeaturedArtist } from '@/lib/repositories/artist.repository';
import { logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Weekly job: Featured artist recommendation.
 * Rotates the homepage "Featured Artist" among verified, non-featured artists.
 * Admin can override the selection manually in /admin/artists at any time.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const candidates = await findFeaturedArtistCandidates();

  if (candidates.length === 0) {
    return jsonOk({ ran: 'featured-artist', status: 'no_candidates' });
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];

  if (!pick) {
    return jsonOk({ ran: 'featured-artist', status: 'no_candidates' });
  }

  await clearFeaturedArtists();
  await setFeaturedArtist(pick.id);

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.featured_artist_rotated',
    entityType: 'artist',
    entityId: pick.id,
  });

  return jsonOk({ ran: 'featured-artist', status: 'ok', artistId: pick.id });
}
