import { notFound } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import NewsCard from '@/components/news/NewsCard';
import { buildMetadata } from '@/lib/seo/metadata';
import { findCategoryBySlugAndType } from '@/lib/repositories/category.repository';
import { findPostsByCategory } from '@/lib/repositories/post.repository';

export const dynamic = 'force-dynamic';

async function getCategoryAndPosts(slug: string) {
  const category = await findCategoryBySlugAndType(slug, 'gospel');
  if (!category) return { category: null, posts: [] };
  const posts = await findPostsByCategory(category.id);
  return { category, posts };
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const { category } = await getCategoryAndPosts(params.category);
  if (!category) return buildMetadata({ title: 'Category Not Found', noIndex: true });
  return buildMetadata({ title: category.name, description: category.description ?? undefined, path: `/gospel/${params.category}` });
}

export default async function GospelCategoryPage({ params }: { params: { category: string } }) {
  const { category, posts } = await getCategoryAndPosts(params.category);
  if (!category) notFound();

  return (
    <>
      <PageHeader title={category.name} description={category.description ?? undefined} />
      <div className="container-ggr py-10">
        {posts.length === 0 ? (
          <p className="text-white/60">No posts in this category yet.</p>
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
