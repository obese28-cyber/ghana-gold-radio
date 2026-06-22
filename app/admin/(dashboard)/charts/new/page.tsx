'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function NewChartPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/charts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekStartDate: fd.get('weekStartDate'),
        weekEndDate: fd.get('weekEndDate'),
        title: fd.get('title') || 'Top 10 Ghana Songs',
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      setError(json.error || 'Failed to create chart.');
      return;
    }
    router.push(`/admin/charts/${json.data.id}`);
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">New Top 10 Chart</h1>
      <form onSubmit={handleSubmit} className="card-ggr max-w-md space-y-4">
        <label className="block text-sm text-white/80">
          Week start date
          <input name="weekStartDate" type="date" required className="mt-1 w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        </label>
        <label className="block text-sm text-white/80">
          Week end date
          <input name="weekEndDate" type="date" required className="mt-1 w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        </label>
        <input name="title" defaultValue="Top 10 Ghana Songs" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white" />
        {error && <p className="text-sm text-ghana-red">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? 'Creating…' : 'Create Chart'}
        </button>
      </form>
    </div>
  );
}
