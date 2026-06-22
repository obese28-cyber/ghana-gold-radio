import Link from 'next/link';

export interface Top10PreviewItem {
  rank: number;
  title: string;
  artist: string;
  coverArtUrl?: string | null;
}

export default function Top10Preview({ items }: { items: Top10PreviewItem[] }) {
  return (
    <section className="container-ggr py-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="section-heading">This Week&apos;s Top 10</h2>
        <Link href="/top10" className="text-sm font-medium text-gold hover:underline">
          View full chart →
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-white/60">No chart has been published yet. Check back soon.</p>
      ) : (
        <ol className="grid gap-3 sm:grid-cols-2">
          {items.slice(0, 10).map((item) => (
            <li key={item.rank} className="card-ggr flex items-center gap-4">
              <span className="font-display text-2xl font-bold text-gold">#{item.rank}</span>
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-sm text-white/60">{item.artist}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
