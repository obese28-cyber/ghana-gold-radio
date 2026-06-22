# Deployment

On Ubuntu 22.04+ install Docker and Docker Compose, clone this repository to `/opt/ghana-gold-radio`, then create the production environment file:

```bash
cp .env.example .env
chmod 600 .env
```

Set strong values for `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CRON_SECRET`. `DATABASE_URL` must use the Docker hostname `postgres` as shown in the example.

Place a Cloudflare Origin Certificate (recommended) in `docker/nginx/certs/live/ghanagoldradio.com/`, then deploy:

```bash
docker compose up --build -d
docker compose ps
curl -I https://ghanagoldradio.com/api/health
```

The `app` service waits for PostgreSQL, applies committed Prisma migrations, and idempotently seeds the first administrator. Uploads and PostgreSQL data live in Docker named volumes and survive image rebuilds.

For later releases run `scripts/deploy/deploy.sh`. Configure Cloudflare SSL/TLS as Full (strict), proxy the A records, and use the origin certificate or the included Certbot service.
