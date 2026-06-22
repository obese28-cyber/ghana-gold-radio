import { notFound } from 'next/navigation';
import { findPostById } from '@/lib/repositories/post.repository';
import PostEditForm from './PostEditForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await findPostById(params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Edit Post</h1>
      <PostEditForm post={post} />
    </div>
  );
}
