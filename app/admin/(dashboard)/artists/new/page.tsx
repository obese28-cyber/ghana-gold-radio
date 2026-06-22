'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function NewArtistPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      stageName: fd.get('stageName'),
      legalName: fd.get('legalName'),
      bio: fd.get('bio'),
      genres: String(fd.get('genres') || '')
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      country: fd.get('country') || 'Ghana',
      city: fd.get('city'),
      pressPhotoUrl: fd.get('pressPhotoUrl'),
      isFeatured: fd.get('isFeatured') === 'on',
      verified: fd.get('verified') === 'on',
    };

    const res = await fetch('/api/admin/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.success) {
      setError(json.error || 'Failed to create artist.');
      return;
    }
    router.push('/admin/artists');
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">New Artist</h1>
      <form onSubmit={handleSubmit} className="card-ggr max-w-xl space-y-4">
        <input name="stageName" required placeholder="Stage name" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <input name="legalName" placeholder="Legal name" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <textarea name="bio" rows={4} placeholder="Bio" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <input name="genres" placeholder="Genres (comma-separated)" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <div className="grid grid-cols-2 gap-4">
          <input name="country" defaultValue="Ghana" placeholder="Country" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
          <input name="city" placeholder="City" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        </div>
        <input name="pressPhotoUrl" type="url" placeholder="Press photo URL" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="isFeatured" /> Featured artist
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="verified" /> Verified
        </label>
        {error && <p className="text-sm text-ghana-red">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? 'Creating…' : 'Create Artist'}
        </button>
      </form>
    </div>
  );
}
