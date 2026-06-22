import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { listPostsForAdmin } from '@/lib/repositories/post.repository';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  const posts = await listPostsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">News & Posts</h1>
        <Link href="/admin/news/new" className="btn-gold text-sm">
          + New Post
        </Link>
      </div>
      <DataTable
        rows={posts}
        emptyMessage="No posts yet."
        columns={[
          { header: 'Title', render: (r) => r.title },
          { header: 'Type', render: (r) => r.postType },
          { header: 'Status', render: (r) => r.status },
          { header: 'AI?', render: (r) => (r.isAiGenerated ? `Yes (${r.aiReviewStatus})` : 'No') },
          {
            header: 'Actions',
            render: (r) => (
              <Link href={`/admin/news/${r.id}`} className="text-gold hover:underline">
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
