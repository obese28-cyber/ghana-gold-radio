import DataTable from '@/components/admin/DataTable';
import { listAllSettings } from '@/lib/repositories/setting.repository';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await listAllSettings();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Site Settings</h1>
      <DataTable
        rows={settings}
        emptyMessage="No settings configured."
        columns={[
          { header: 'Key', render: (r) => r.key },
          { header: 'Value', render: (r) => JSON.stringify(r.value) },
          { header: 'Description', render: (r) => r.description ?? '—' },
        ]}
      />
    </div>
  );
}
