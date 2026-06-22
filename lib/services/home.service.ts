import * as chartRepo from '@/lib/repositories/chart.repository';
import * as artistRepo from '@/lib/repositories/artist.repository';
import * as postRepo from '@/lib/repositories/post.repository';

export async function getHomePageData() {
  const [chart, featuredArtist, news] = await Promise.all([
    chartRepo.findLatestPublishedChart(),
    artistRepo.findFeaturedArtist(),
    postRepo.findPublishedPosts({ limit: 3 }),
  ]);

  const top10Items = (chart?.items ?? []).map((item) => ({
    rank: item.rank,
    title: item.song.title,
    artist: item.song.artist.stageName,
  }));

  return {
    top10Items,
    featuredArtist: featuredArtist
      ? {
          slug: featuredArtist.slug,
          stageName: featuredArtist.stageName,
          bio: featuredArtist.bio,
          genres: featuredArtist.genres,
          pressPhotoUrl: featuredArtist.pressPhotoUrl,
        }
      : null,
    news,
  };
}
