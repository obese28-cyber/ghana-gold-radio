'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSongForm({ artists }: { artists: { id: string; stageName: string }[] }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title'),
      artistId: fd.get('artistId'),
      genre: fd.get('genre'),
      releaseDate: fd.get('releaseDate'),
      officialYoutubeUrl: fd.get('officialYoutubeUrl'),
      coverArtUrl: fd.get('coverArtUrl'),
    };

    const res = await fetch('/api/admin/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.success) {
      setError(json.error || 'Failed to create song.');
      return;
    }
    router.push('/admin/songs');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card-ggr max-w-xl space-y-4">
      <input name="title" required placeholder="Song title" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <select name="artistId" required defaultValue="" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white">
        <option value="" disabled>
          Select artist…
        </option>
        {artists.map((a) => (
          <option key={a.id} value={a.id}>
            {a.stageName}
          </option>
        ))}
      </select>
      <input name="genre" placeholder="Genre (e.g. Highlife, Afrobeats)" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <div className="grid grid-cols-2 gap-4">
        <input name="releaseDate" type="date" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        <input name="officialYoutubeUrl" type="url" placeholder="YouTube URL" className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      </div>
      <input name="coverArtUrl" type="url" placeholder="Cover art URL" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      {error && <p className="text-sm text-ghana-red">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold">
        {loading ? 'Creating…' : 'Create Song'}
      </button>
    </form>
  );
}
