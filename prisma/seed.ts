/**
 * Ghana Gold Radio — database seed
 * Run with: npm run db:seed  (wraps `prisma db seed`)
 *
 * Idempotent: safe to run on every deploy. Creates the admin account from
 * ADMIN_EMAIL/ADMIN_PASSWORD if it doesn't exist yet (first-deployment
 * bootstrap), plus baseline categories and feature-flag site settings.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      '[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin account creation. ' +
        'Set both in .env and re-run `npm run db:seed` to bootstrap an admin.'
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    console.log(`[seed] Admin user ${email} already exists — skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      fullName: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });
  console.log(`[seed] Created admin user: ${email}`);
}

async function seedCategories() {
  const categories: Array<{
    name: string;
    slug: string;
    type:
      | 'highlife'
      | 'gospel'
      | 'afrobeats_hiplife'
      | 'diaspora_update'
      | 'news'
      | 'event'
      | 'general';
    description: string;
    sortOrder: number;
  }> = [
    { name: 'Highlife Legends', slug: 'highlife-legends', type: 'highlife', description: 'The pioneers of Ghanaian Highlife.', sortOrder: 1 },
    { name: '80s Highlife', slug: '80s-highlife', type: 'highlife', description: 'Classic Highlife from the 1980s.', sortOrder: 2 },
    { name: '90s Highlife', slug: '90s-highlife', type: 'highlife', description: 'Highlife from the 1990s golden era.', sortOrder: 3 },
    { name: '2000s Highlife', slug: '2000s-highlife', type: 'highlife', description: 'Highlife into the new millennium.', sortOrder: 4 },
    { name: 'Wedding Classics', slug: 'wedding-classics', type: 'highlife', description: 'Highlife wedding favorites.', sortOrder: 5 },
    { name: 'Cultural Classics', slug: 'cultural-classics', type: 'highlife', description: 'Traditional and cultural Highlife.', sortOrder: 6 },
    { name: 'Worship', slug: 'worship', type: 'gospel', description: 'Ghanaian worship music.', sortOrder: 1 },
    { name: 'Praise', slug: 'praise', type: 'gospel', description: 'Ghanaian praise music.', sortOrder: 2 },
    { name: 'Sunday Spotlight', slug: 'sunday-spotlight', type: 'gospel', description: 'Weekly gospel artist spotlight.', sortOrder: 3 },
    { name: 'Afrobeats', slug: 'afrobeats', type: 'afrobeats_hiplife', description: 'Ghanaian Afrobeats.', sortOrder: 1 },
    { name: 'Hiplife', slug: 'hiplife', type: 'afrobeats_hiplife', description: 'Classic and modern Hiplife.', sortOrder: 2 },
    { name: 'Asakaa', slug: 'asakaa', type: 'afrobeats_hiplife', description: 'Kumerica / Asakaa drill scene.', sortOrder: 3 },
    { name: 'New Releases', slug: 'new-releases', type: 'afrobeats_hiplife', description: 'Latest Ghanaian music drops.', sortOrder: 4 },
    { name: 'Trending Artists', slug: 'trending-artists', type: 'afrobeats_hiplife', description: 'Artists trending right now.', sortOrder: 5 },
    { name: 'Community Events', slug: 'community-events', type: 'diaspora_update', description: 'Diaspora community events.', sortOrder: 1 },
    { name: 'Business Events', slug: 'business-events', type: 'diaspora_update', description: 'Diaspora business & networking.', sortOrder: 2 },
    { name: 'Cultural Events', slug: 'cultural-events', type: 'diaspora_update', description: 'Cultural festivals & celebrations.', sortOrder: 3 },
    { name: 'Travel Updates', slug: 'travel-updates', type: 'diaspora_update', description: 'Travel-to-Ghana updates.', sortOrder: 4 },
    { name: 'Ghanaian Organizations Abroad', slug: 'ghanaian-orgs-abroad', type: 'diaspora_update', description: 'Diaspora associations & unions.', sortOrder: 5 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`[seed] Ensured ${categories.length} categories exist.`);
}

async function seedSiteSettings() {
  const settings: Array<{ key: string; value: any; description: string }> = [
    { key: 'site_tagline', value: 'The Sound of Home, Anywhere in the World.', description: 'Global site tagline' },
    { key: 'streaming_enabled', value: false, description: 'Feature flag: legal streaming (Phase 2)' },
    { key: 'submission_open', value: true, description: 'Feature flag: artist submissions open' },
    { key: 'ai_auto_publish', value: false, description: 'Safety flag: AI content always requires manual approval' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`[seed] Ensured ${settings.length} site settings exist.`);
}

async function main() {
  await seedAdminUser();
  await seedCategories();
  await seedSiteSettings();
}

main()
  .catch((err) => {
    console.error('[seed] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
