'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostEditForm({ post }: { post: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [status, setStatus] = useState(post.status);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/admin/news/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, status }),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Failed to save.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="card-ggr max-w-2xl space-y-4">
      {post.isAiGenerated && post.aiUncertaintyFlags?.length > 0 && (
        <div className="rounded-md border border-ghana-red/40 bg-ghana-red/10 p-3">
          <p className="text-sm font-semibold text-ghana-red">AI flagged these as uncertain:</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-white/70">
            {post.aiUncertaintyFlags.map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white">
        {['draft', 'pending_review', 'published', 'archived'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {error && <p className="text-sm text-ghana-red">{error}</p>}
      <button onClick={handleSave} disabled={saving} className="btn-gold">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
