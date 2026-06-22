# Contributing

Use TypeScript, run `npm run typecheck`, `npm run lint`, and `npm test` before committing. Database changes require an additive Prisma migration created with `npm run db:migrate:dev -- --name <change>` and a corresponding schema update. Keep database access in repositories/services and keep UI components data-access free.
