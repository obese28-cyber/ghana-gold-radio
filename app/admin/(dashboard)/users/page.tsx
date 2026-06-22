import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';
import { listUsersForAdmin } from '@/lib/repositories/user.repository';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await listUsersForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Users</h1>
      <DataTable
        rows={users}
        emptyMessage="No users found."
        columns={[
          { header: 'Email', render: (r) => r.email },
          { header: 'Name', render: (r) => r.fullName ?? '—' },
          { header: 'Role', render: (r) => r.role },
          { header: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
          { header: 'Joined', render: (r) => format(r.createdAt, 'MMM d, yyyy') },
        ]}
      />
    </div>
  );
}
