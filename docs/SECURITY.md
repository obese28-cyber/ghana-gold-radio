# Security

Authentication uses Auth.js credentials sessions with bcrypt password hashes, secure production cookies, and role checks in middleware plus server-side API guards. PostgreSQL access remains server-only through Prisma repositories and services.

All public inputs use Zod validation, plain/rich text sanitization, rate limiting, and Turnstile verification where configured. Uploads are MIME and size validated, written with generated filenames outside user-provided paths, and persisted in a dedicated Docker volume.

Security headers include CSP, HSTS, clickjacking protection, content-type protection, referrer policy, and a restrictive permissions policy. Keep `.env` private, rotate `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, `CRON_SECRET`, SMTP, and AI provider credentials after exposure, and regularly update dependencies.
