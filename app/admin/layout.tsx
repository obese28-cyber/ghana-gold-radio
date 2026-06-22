import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';

/**
 * Wraps every /admin/* route (including the login page) with the Auth.js
 * session context. The actual auth guard + sidebar chrome lives in
 * app/admin/(dashboard)/layout.tsx so /admin/login can render standalone.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
