import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Login page renders standalone (no sidebar/guard) — handled by its own route.
  // This layout wraps every other /admin/* route.
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-ghana-black">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader userEmail={session.user.email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
