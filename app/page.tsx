import HeroSection from '@/components/home/HeroSection';
import Top10Preview from '@/components/charts/Top10Preview';
import FeaturedArtist from '@/components/artists/FeaturedArtist';
import NewsCard from '@/components/news/NewsCard';
import SponsorCTA from '@/components/home/SponsorCTA';
import NewsletterForm from '@/components/forms/NewsletterForm';
import Link from 'next/link';
import { getHomePageData } from '@/lib/services/home.service';

// Content here is admin-published and changes frequently (new charts, news,
// featured artist) — render per-request rather than statically at build time.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { top10Items, featuredArtist, news } = await getHomePageData();

  return (
    <>
      <HeroSection />
      <Top10Preview items={top10Items} />
      <FeaturedArtist artist={featuredArtist} />

      <section className="container-ggr py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="section-heading">Latest Music News</h2>
          <Link href="/news" className="text-sm font-medium text-gold hover:underline">
            All news →
          </Link>
        </div>
        {news.length === 0 ? (
          <p className="text-white/60">No news posts published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            {news.map((post) => (
              <NewsCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  featuredImageUrl: post.featuredImageUrl,
                  publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
                  sourceName: post.sourceName,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="container-ggr py-14">
        <h2 className="section-heading mb-6">Explore by Category</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/highlife" className="card-ggr">
            <h3 className="font-semibold text-white">Old School Highlife</h3>
            <p className="mt-1 text-sm text-white/60">Legends, 80s, 90s, 2000s, wedding & cultural classics.</p>
          </Link>
          <Link href="/gospel" className="card-ggr">
            <h3 className="font-semibold text-white">Ghana Gospel</h3>
            <p className="mt-1 text-sm text-white/60">Worship, praise, and Sunday spotlight artists.</p>
          </Link>
          <Link href="/afrobeats" className="card-ggr">
            <h3 className="font-semibold text-white">Afrobeats / Hiplife</h3>
            <p className="mt-1 text-sm text-white/60">Asakaa, new releases, and trending artists.</p>
          </Link>
        </div>
      </section>

      <SponsorCTA />

      <section className="container-ggr py-14">
        <div className="card-ggr text-center">
          <h2 className="section-heading">Join the Ghana Gold Radio Family</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/70">
            Get the Top 10 chart, music news, and diaspora updates straight to your inbox.
          </p>
          <div className="mx-auto mt-5 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
