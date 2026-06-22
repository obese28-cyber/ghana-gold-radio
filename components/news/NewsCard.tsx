import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export interface NewsCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  publishedAt: string | null;
  sourceName: string | null;
}

export default function NewsCard({ post }: { post: NewsCardData }) {
  return (
    <Link href={`/news/${post.slug}`} className="card-ggr block">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-md bg-white/10">
        {post.featuredImageUrl ? (
          <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" sizes="400px" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">Ghana Gold Radio</div>
        )}
      </div>
      <h3 className="font-semibold text-white">{post.title}</h3>
      {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-white/60">{post.excerpt}</p>}
      <div className="mt-3 flex items-center justify-between text-xs text-white/40">
        {post.publishedAt && <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>}
        {post.sourceName && <span>Source: {post.sourceName}</span>}
      </div>
    </Link>
  );
}
