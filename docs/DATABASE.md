# Database

The application uses PostgreSQL 16 in Docker and Prisma. The database schema is defined in `prisma/schema.prisma`; committed migrations in `prisma/migrations` are the deployment source of truth.

Use `npm run db:migrate:dev -- --name <change>` while developing, commit the resulting migration, and use `npm run db:migrate` in deployment. `npm run db:seed` creates baseline categories, settings, and the initial admin account when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set.

Database access is server-only through `lib/prisma.ts`, repositories, and services. UI components do not access PostgreSQL directly.
