import { NextRequest } from 'next/server';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { findPublishedPosts } from '@/lib/repositories/post.repository';
import type { PostCategoryType } from '@prisma/client';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || undefined;
  const postType = (req.nextUrl.searchParams.get('type') as PostCategoryType | null) || undefined;

  try {
    const posts = await findPublishedPosts({ query, postType, limit: 50 });
    return jsonOk(posts);
  } catch (err) {
    console.error('news fetch error', err);
    return jsonError('Failed to load posts.', 500);
  }
}
