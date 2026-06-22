'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const POST_TYPES = ['news', 'diaspora_update', 'event', 'highlife', 'gospel', 'afrobeats_hiplife', 'general'];

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: fd.get('title'),
        excerpt: fd.get('excerpt'),
        body: fd.get('body'),
        postType: fd.get('postType'),
        sourceName: fd.get('sourceName'),
        sourceUrl: fd.get('sourceUrl'),
        featuredImageUrl: fd.get('featuredImageUrl'),
        isAiGenerated: fd.get('isAiGenerated') === 'on',
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      setError(json.error || 'Failed to create post.');
      return;
    }
    router.push(`/admin/news/${json.data.id}`);
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">New Post</h1>
      <form onSubmit={handleSubmit} className="card-ggr max-w-2xl space-y-4">
        <input name="title" required placeholder="Title" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <input name="excerpt" placeholder="Excerpt" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <select name="postType" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white">
          {POST_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <textarea name="body" required rows={8} placeholder="Body" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <div className="grid grid-cols-2 gap-4">
          <input name="sourceName" placeholder="Source name (for news)" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
          <input name="sourceUrl" type="url" placeholder="Source URL" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        </div>
        <input name="featuredImageUrl" type="url" placeholder="Featured image URL" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="isAiGenerated" /> This content is AI-assisted (requires approval before publish)
        </label>
        {error && <p className="text-sm text-ghana-red">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? 'Creating…' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
