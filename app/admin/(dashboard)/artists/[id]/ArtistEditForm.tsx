'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArtistEditForm({ artist }: { artist: any }) {
  const router = useRouter();
  const [stageName, setStageName] = useState(artist.stageName);
  const [bio, setBio] = useState(artist.bio ?? '');
  const [genres, setGenres] = useState((artist.genres ?? []).join(', '));
  const [isFeatured, setIsFeatured] = useState(artist.isFeatured);
  const [verified, setVerified] = useState(artist.verified);
  const [permissionStatus, setPermissionStatus] = useState(artist.permissionStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/admin/artists/${artist.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stageName,
        bio,
        genres: genres.split(',').map((g: string) => g.trim()).filter(Boolean),
        isFeatured,
        verified,
        permissionStatus,
      }),
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
    <div className="card-ggr max-w-xl space-y-4">
      <input value={stageName} onChange={(e) => setStageName(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <input value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="Genres (comma-separated)" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
      <select value={permissionStatus} onChange={(e) => setPermissionStatus(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white">
        {['unknown', 'requested', 'granted', 'denied', 'expired'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured artist
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Verified
      </label>
      {error && <p className="text-sm text-ghana-red">{error}</p>}
      <button onClick={handleSave} disabled={saving} className="btn-gold">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
