import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { createChart } from '@/lib/repositories/chart.repository';

const schema = z.object({
  weekStartDate: z.string(),
  weekEndDate: z.string(),
  title: z.string().max(150).default('Top 10 Ghana Songs'),
});

export async function POST(req: NextRequest) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  try {
    const created = await createChart({
      weekStartDate: new Date(parsed.data.weekStartDate),
      weekEndDate: new Date(parsed.data.weekEndDate),
      title: parsed.data.title,
      createdById: auth.user.id,
    });
    return jsonOk(created, 201);
  } catch (err) {
    console.error('admin create chart error', err);
    return jsonError('Failed to create chart. (A chart for that week may already exist.)', 500);
  }
}
