import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { buildMetadata, articleJsonLd } from '@/lib/seo/metadata';
import JsonLd from '@/components/seo/JsonLd';
import { findPostBySlug } from '@/lib/repositories/post.repository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await findPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: 'Post Not Found', path: `/news/${params.slug}`, noIndex: true });
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    path: `/news/${params.slug}`,
    image: post.featuredImageUrl ?? undefined,
    type: 'article',
    publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
  });
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const post = await findPostBySlug(params.slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghanagoldradio.com';

  return (
    <article className="container-ggr max-w-3xl py-12">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt ?? '',
          publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
          image: post.featuredImageUrl ?? undefined,
          url: `${siteUrl}/news/${post.slug}`,
        })}
      />
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{post.title}</h1>
      <div className="mt-2 flex items-center gap-3 text-sm text-white/50">
        {post.publishedAt && <span>{format(post.publishedAt, 'MMMM d, yyyy')}</span>}
        {post.sourceName && <span>Source: {post.sourceName}</span>}
      </div>

      {post.featuredImageUrl && (
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-lg bg-white/10">
          <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" sizes="800px" />
        </div>
      )}

      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-white/85">{post.body}</div>

      {post.isAiGenerated && (
        <p className="mt-8 rounded-md border border-gold/30 bg-gold/5 p-3 text-xs text-white/60">
          This content was AI-assisted and reviewed/approved by our editorial team before publishing.
          {post.sourceUrl && (
            <>
              {' '}
              Original source:{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-gold underline">
                {post.sourceName ?? post.sourceUrl}
              </a>
            </>
          )}
        </p>
      )}
    </article>
  );
}
