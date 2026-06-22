'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChartEditor({ chart }: { chart: any }) {
  const router = useRouter();
  const [songId, setSongId] = useState('');
  const [rank, setRank] = useState(1);
  const [commentary, setCommentary] = useState(chart.aiCommentary ?? '');
  const [isPublished, setIsPublished] = useState(chart.isPublished);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function addItem() {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/charts/${chart.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId, rank: Number(rank) }),
    });
    setBusy(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Failed to add item.');
      return;
    }
    setSongId('');
    router.refresh();
  }

  async function saveChart() {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/charts/${chart.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished, aiCommentary: commentary }),
    });
    setBusy(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Failed to save.');
      return;
    }
    router.refresh();
  }

  const items = (chart.items ?? []).slice().sort((a: any, b: any) => a.rank - b.rank);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card-ggr">
        <h2 className="mb-3 font-semibold text-white">Chart Items</h2>
        <ul className="mb-4 space-y-1 text-sm text-white/80">
          {items.length === 0 && <li className="text-white/40">No songs added yet.</li>}
          {items.map((item: any) => (
            <li key={item.rank}>
              #{item.rank} — {item.song?.title} ({item.song?.artist?.stageName})
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
            placeholder="Song UUID"
            className="flex-1 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
          />
          <input
            type="number"
            min={1}
            max={10}
            value={rank}
            onChange={(e) => setRank(Number(e.target.value))}
            className="w-20 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
          />
          <button onClick={addItem} disabled={busy} className="btn-outline text-sm">
            Add
          </button>
        </div>
      </div>

      <div className="card-ggr">
        <h2 className="mb-3 font-semibold text-white">Commentary & Publish</h2>
        <textarea
          value={commentary}
          onChange={(e) => setCommentary(e.target.value)}
          rows={6}
          placeholder="Use the AI Tools dashboard to draft commentary, then paste and review it here."
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Published
        </label>
        {error && <p className="mt-2 text-sm text-ghana-red">{error}</p>}
        <button onClick={saveChart} disabled={busy} className="btn-gold mt-3">
          {busy ? 'Saving…' : 'Save Chart'}
        </button>
      </div>
    </div>
  );
}
