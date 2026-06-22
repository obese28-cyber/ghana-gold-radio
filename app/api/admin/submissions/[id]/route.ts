import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { changeSubmissionStatus } from '@/lib/services/submission.service';

const schema = z.object({
  status: z.enum(['pending', 'in_review', 'approved', 'rejected', 'published', 'withdrawn']),
  adminNotes: z.string().max(2000).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor', 'moderator']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Invalid request.', 422);

  try {
    const updated = await changeSubmissionStatus(
      params.id,
      parsed.data.status,
      parsed.data.adminNotes,
      auth.user.id,
      auth.user.email
    );
    return jsonOk(updated);
  } catch (err) {
    console.error('submission status update error', err);
    return jsonError('Failed to update submission.', 500);
  }
}
