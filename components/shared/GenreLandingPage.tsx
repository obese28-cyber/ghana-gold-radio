import PageHeader from '@/components/shared/PageHeader';
import CategoryGrid from '@/components/shared/CategoryGrid';
import NewsCard from '@/components/news/NewsCard';
import { findActiveCategories } from '@/lib/repositories/category.repository';
import { findPublishedPosts } from '@/lib/repositories/post.repository';
import type { PostCategoryType } from '@prisma/client';

interface Props {
  postType: PostCategoryType;
  basePath: string; // e.g. '/highlife'
  title: string;
  description: string;
}

export default async function GenreLandingPage({ postType, basePath, title, description }: Props) {
  const [categories, posts] = await Promise.all([
    findActiveCategories(postType),
    findPublishedPosts({ postType, limit: 9 }),
  ]);

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="container-ggr py-10 space-y-12">
        {categories.length > 0 && (
          <section>
            <h2 className="section-heading mb-4">Categories</h2>
            <CategoryGrid
              items={categories.map((c) => ({ slug: c.slug, name: c.name, description: c.description, basePath }))}
            />
          </section>
        )}

        <section>
          <h2 className="section-heading mb-4">Latest</h2>
          {posts.length === 0 ? (
            <p className="text-white/60">No posts yet in this category.</p>
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
        </section>
      </div>
    </>
  );
}
