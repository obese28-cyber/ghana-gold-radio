import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeFromNewsletter } from '@/lib/services/newsletter.service';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (!token) return NextResponse.redirect(`${siteUrl}/newsletter?status=invalid`);

  const unsubscribed = await unsubscribeFromNewsletter(token);
  if (!unsubscribed) return NextResponse.redirect(`${siteUrl}/newsletter?status=invalid`);
  return NextResponse.redirect(`${siteUrl}/newsletter?status=unsubscribed`);
}
