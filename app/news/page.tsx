import type { Metadata } from 'next';
import PageHeader from '@/components/shared/PageHeader';
import NewsCard from '@/components/news/NewsCard';
import { buildMetadata } from '@/lib/seo/metadata';
import { findPublishedPosts } from '@/lib/repositories/post.repository';

export const metadata: Metadata = buildMetadata({
  title: 'Ghana Music News',
  description: 'AI-assisted news summaries with full source attribution, reviewed by our editors.',
  path: '/news',
});

export const dynamic = 'force-dynamic';

export default async function NewsPage({ searchParams }: { searchParams: { q?: string } }) {
  const posts = await findPublishedPosts({ postType: 'news', query: searchParams.q, limit: 30 });

  return (
    <>
      <PageHeader title="Ghana Music News" description="The latest from the Ghanaian music scene, with full source attribution." />
      <div className="container-ggr py-10">
        <form action="/news" className="mb-8 flex gap-3">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search news…"
            className="w-full max-w-sm rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white"
          />
          <button type="submit" className="btn-outline">
            Search
          </button>
        </form>

        {posts.length === 0 ? (
          <p className="text-white/60">No news posts published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
      </div>
    </>
  );
}
