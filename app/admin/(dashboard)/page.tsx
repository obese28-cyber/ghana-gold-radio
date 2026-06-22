import { getAdminDashboardStats } from '@/lib/services/analytics.service';
import StatCard from '@/components/admin/StatCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { pendingSubmissions, totalArtists, activeSubscribers, pendingAiDrafts } = await getAdminDashboardStats();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Submissions" value={pendingSubmissions} hint="Awaiting review" />
        <StatCard label="Total Artists" value={totalArtists} />
        <StatCard label="Newsletter Subscribers" value={activeSubscribers} hint="Active" />
        <StatCard label="AI Drafts Pending Approval" value={pendingAiDrafts} />
      </div>

      <div className="mt-10 card-ggr">
        <h2 className="mb-2 font-semibold text-white">Quick Links</h2>
        <ul className="space-y-1 text-sm text-gold">
          <li><a href="/admin/submissions" className="hover:underline">Review pending submissions →</a></li>
          <li><a href="/admin/charts" className="hover:underline">Manage this week&apos;s Top 10 chart →</a></li>
          <li><a href="/admin/ai-tools" className="hover:underline">Generate AI content drafts →</a></li>
        </ul>
      </div>
    </div>
  );
}
