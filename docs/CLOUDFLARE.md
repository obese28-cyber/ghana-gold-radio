# Cloudflare Configuration — Ghana Gold Radio

## DNS

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `<Hetzner VPS IPv4>` | Proxied (orange cloud) |
| A | `www` | `<Hetzner VPS IPv4>` | Proxied |
| AAAA | `@` | `<Hetzner VPS IPv6>` (if available) | Proxied |
| CNAME | `*` (optional, future subdomains) | `ghanagoldradio.com` | Proxied |

Keep DNS proxied (orange cloud) so Cloudflare's CDN, WAF, and DDoS protection sit in front of the origin. Hide the real origin IP from public DNS lookups.

## SSL/TLS

- **SSL/TLS encryption mode:** Full (Strict) — requires a valid certificate on the origin (Let's Encrypt via the `certbot` container in `docker-compose.yml`, or a Cloudflare Origin CA certificate, which is simpler to maintain).
- **Always Use HTTPS:** On.
- **Automatic HTTPS Rewrites:** On.
- **Minimum TLS Version:** 1.2.
- **TLS 1.3:** On.
- **HSTS:** Enable with `max-age=63072000; includeSubDomains; preload` (the app already sends this header; mirror it at the edge in Cloudflare → SSL/TLS → Edge Certificates).

## Security

- **WAF (Web Application Firewall):** Enable Cloudflare Managed Ruleset. Add a custom rule to challenge/block requests to `/admin/*` from outside expected countries if traffic patterns justify it.
- **Bot Fight Mode / Super Bot Fight Mode:** On — mitigates scraping of the artist directory and news content.
- **Rate Limiting Rules:**
  - `POST /api/submissions` — 5 requests / 10 min per IP.
  - `POST /api/newsletter` — 10 requests / 10 min per IP.
  - `POST /api/contact`, `/api/sponsor` — 8 requests / 10 min per IP.
  - These mirror the app-level limits in `lib/security/rate-limit.ts` — Cloudflare rules add edge-level defense so abusive traffic never reaches the VPS.
- **Turnstile:** Use Cloudflare Turnstile (free CAPTCHA alternative) on all public forms — site/secret keys go in `.env` (`TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`).
- **Firewall rule recommendation:** Block known bad bot user agents and countries with no expected traffic, if applicable. Always allow Cloudflare's own IP ranges to reach the origin (Nginx config already trusts `CF-Connecting-IP`).

## Caching

- **Caching Level:** Standard.
- **Browser Cache TTL:** Respect existing headers (4 hours default is fine).
- **Cache Rules:**
  - Cache Everything for `/_next/static/*` and `/images/*` (immutable, long TTL — matches `Cache-Control: public, max-age=31536000, immutable` set by Next.js).
  - Bypass cache for `/api/*` and `/admin/*` entirely.
  - Standard caching for public HTML pages, respecting the app's `revalidate` windows (5–10 minutes) — set Edge Cache TTL to 5 minutes for these routes if using Cache Rules, or rely on origin cache-control.

## Page Rules / Redirects

- Force `www.ghanagoldradio.com` → `ghanagoldradio.com` (or the reverse, pick one canonical host) at the Cloudflare level to avoid duplicate-content SEO issues alongside the app's canonical tags.

## Performance

- **Auto Minify:** JS/CSS/HTML — optional, Next.js already minifies; safe to enable for any pass-through HTML.
- **Brotli:** On.
- **Rocket Loader:** Off (can conflict with hydration in modern frameworks like Next.js).
- **Early Hints:** On.

## Monitoring

- Use Cloudflare Health Checks pointed at `https://ghanagoldradio.com/api/health`, alerting via email/webhook on failure, as a second layer alongside any external uptime monitor (UptimeRobot, Better Uptime, etc.).
