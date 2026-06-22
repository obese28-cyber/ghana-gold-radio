export const dynamic = 'force-dynamic';

export default function AdminAnalyticsPage() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Analytics</h1>
      <div className="card-ggr">
        <p className="text-white/70">
          Full analytics are available in your Plausible dashboard
          {plausibleDomain ? (
            <>
              {' '}
              for{' '}
              <a
                href={`https://plausible.io/${plausibleDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                {plausibleDomain}
              </a>
              .
            </>
          ) : (
            '. Configure NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable tracking.'
          )}
        </p>
        <p className="mt-2 text-sm text-white/50">
          Plausible is privacy-focused (no cookies, GDPR-compliant) and tracks pageviews, referrers, and top pages
          without collecting personal data.
        </p>
      </div>
    </div>
  );
}
