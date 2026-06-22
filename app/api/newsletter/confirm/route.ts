import { NextRequest, NextResponse } from 'next/server';
import { confirmNewsletterSubscription } from '@/lib/services/newsletter.service';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (!token) return NextResponse.redirect(`${siteUrl}/newsletter?status=invalid`);

  const confirmed = await confirmNewsletterSubscription(token);
  if (!confirmed) return NextResponse.redirect(`${siteUrl}/newsletter?status=invalid`);
  return NextResponse.redirect(`${siteUrl}/newsletter?status=confirmed`);
}
