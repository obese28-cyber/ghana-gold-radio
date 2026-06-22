# Ghana Gold Radio

Ghana Gold Radio is a Next.js 14 application for Ghanaian music, culture, news, artist submissions, and editorial tools. It runs entirely on one Hetzner VPS: Next.js, PostgreSQL, Prisma, Auth.js, local uploads, Nginx, Docker, and Cloudflare.

## Quick start

```bash
cp .env.example .env
docker compose up --build -d
```

The app applies Prisma migrations and seeds the administrator specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD` on startup. Open `/admin/login` to sign in.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate:dev` | Create and apply a development migration |
| `npm run db:migrate` | Apply committed migrations |
| `npm run db:seed` | Seed baseline data and the initial admin |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit and integration tests |

See `docs/DEPLOYMENT.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, and `docs/BACKUP.md` for operating guidance.
