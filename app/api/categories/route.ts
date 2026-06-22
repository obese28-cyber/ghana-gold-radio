import { NextRequest } from 'next/server';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { findActiveCategories } from '@/lib/repositories/category.repository';
import type { PostCategoryType } from '@prisma/client';

export async function GET(req: NextRequest) {
  const type = (req.nextUrl.searchParams.get('type') as PostCategoryType | null) || undefined;

  try {
    const categories = await findActiveCategories(type);
    return jsonOk(categories);
  } catch (err) {
    console.error('categories fetch error', err);
    return jsonError('Failed to load categories.', 500);
  }
}
