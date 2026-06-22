import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_PREFIX = '/admin';
const ADMIN_LOGIN_PATH = '/admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // RBAC gate: any /admin/* route (except the login page itself) requires a
  // valid Auth.js session JWT. Role-level checks (admin/editor/moderator)
  // happen again server-side per route via requireStaff() — this is a
  // fast-fail layer to avoid rendering protected UI to anonymous visitors.
  if (pathname.startsWith(ADMIN_PREFIX) && pathname !== ADMIN_LOGIN_PATH) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, Next internals, and uploaded
     * media, so the auth check doesn't add overhead to asset requests.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|uploads/).*)',
  ],
};
