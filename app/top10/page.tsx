import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, musicPlaylistJsonLd } from '@/lib/seo/metadata';
import { format } from 'date-fns';
import Link from 'next/link';
import { findPublishedCharts } from '@/lib/repositories/chart.repository';

export const metadata: Metadata = buildMetadata({
  title: 'Top 10 Ghana Songs',
  description: 'Weekly Top 10 Ghana music chart with rankings, artist info, and AI-assisted commentary.',
  path: '/top10',
});

export const dynamic = 'force-dynamic';

export default async function Top10Page() {
  const charts = await findPublishedCharts(8);
  const latest = charts[0];
  const history = charts.slice(1);

  const jsonLdEntries = (latest?.items ?? []).map((i) => ({
    name: i.song.title,
    artist: i.song.artist.stageName,
    position: i.rank,
  }));

  return (
    <>
      <PageHeader
        title="Top 10 Ghana Songs"
        description="Weekly rankings of the hottest songs in Ghana, with AI-assisted commentary reviewed by our editorial team."
      />
      {jsonLdEntries.length > 0 && <JsonLd data={musicPlaylistJsonLd(jsonLdEntries)} />}

      <div className="container-ggr py-10">
        {!latest ? (
          <p className="text-white/60">No chart has been published yet. Check back soon.</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-white/50">
              Week of {format(latest.weekStartDate, 'MMM d')} – {format(latest.weekEndDate, 'MMM d, yyyy')}
            </p>
            <ol className="space-y-3">
              {latest.items.map((item) => (
                <li key={item.rank} className="card-ggr flex items-center gap-5">
                  <span className="font-display text-3xl font-bold text-gold">#{item.rank}</span>
                  <div className="flex-1">
                    <Link href={`/artists/${item.song.artist.slug}`} className="font-semibold text-white hover:text-gold">
                      {item.song.title}
                    </Link>
                    <p className="text-sm text-white/60">{item.song.artist.stageName}</p>
                  </div>
                  {item.previousRank && <span className="text-xs text-white/40">was #{item.previousRank}</span>}
                  {item.song.officialYoutubeUrl && (
                    <a
                      href={item.song.officialYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs font-medium text-gold hover:underline"
                    >
                      Official Video
                    </a>
                  )}
                </li>
              ))}
            </ol>

            {latest.aiCommentary && (
              <div className="card-ggr mt-8">
                <h2 className="mb-2 font-display text-xl text-gold">Chart Commentary</h2>
                <p className="text-white/80">{latest.aiCommentary}</p>
                <p className="mt-2 text-xs text-white/40">AI-assisted, reviewed and approved by our editorial team.</p>
              </div>
            )}
          </>
        )}

        {history.length > 0 && (
          <div className="mt-12">
            <h2 className="section-heading mb-4">Historical Charts</h2>
            <ul className="flex flex-wrap gap-2">
              {history.map((c) => (
                <li key={c.id} className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70">
                  Week of {format(c.weekStartDate, 'MMM d, yyyy')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
