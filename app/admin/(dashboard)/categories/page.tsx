import DataTable from '@/components/admin/DataTable';
import { listAllCategoriesForAdmin } from '@/lib/repositories/category.repository';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await listAllCategoriesForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Categories</h1>
      <DataTable
        rows={categories}
        emptyMessage="No categories."
        columns={[
          { header: 'Name', render: (r) => r.name },
          { header: 'Slug', render: (r) => r.slug },
          { header: 'Type', render: (r) => r.type },
          { header: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
        ]}
      />
    </div>
  );
}
