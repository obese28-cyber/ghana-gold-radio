'use client';

import { useState } from 'react';

type ToolKey = 'bio-generator' | 'spotlight' | 'summarizer' | 'top10-commentary' | 'caption-generator' | 'newsletter-generator' | 'event-summarizer';

const TOOLS: { key: ToolKey; label: string; description: string }[] = [
  { key: 'bio-generator', label: 'Artist Bio Generator', description: 'Draft a bio from known facts.' },
  { key: 'spotlight', label: 'Artist Spotlight', description: 'Feature-length artist spotlight.' },
  { key: 'summarizer', label: 'News Summarizer', description: 'Summarize a news source with attribution.' },
  { key: 'top10-commentary', label: 'Top 10 Commentary', description: 'Commentary on chart movement.' },
  { key: 'caption-generator', label: 'Social Caption Generator', description: 'Platform-specific captions.' },
  { key: 'newsletter-generator', label: 'Newsletter Generator', description: 'Draft the weekly newsletter.' },
  { key: 'event-summarizer', label: 'Event Summary Generator', description: 'Diaspora event write-ups.' },
];

export const dynamic = 'force-dynamic';

export default function AiToolsPage() {
  const [active, setActive] = useState<ToolKey>('bio-generator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ text: string; uncertaintyFlags: string[]; provider: string; model: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runTool() {
    setLoading(true);
    setError('');
    setResult(null);

    let payload: Record<string, unknown> = {};
    try {
      payload = input.trim() ? JSON.parse(input) : {};
    } catch {
      setError('Input must be valid JSON matching the tool schema (see placeholder).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/ai/${active}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Generation failed.');
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const placeholders: Record<ToolKey, string> = {
    'bio-generator': '{\n  "stageName": "...",\n  "genres": ["Highlife"],\n  "country": "Ghana",\n  "knownFacts": "..."\n}',
    spotlight: '{\n  "artistName": "...",\n  "knownFacts": "..."\n}',
    summarizer: '{\n  "sourceTitle": "...",\n  "sourceUrl": "https://...",\n  "sourceText": "..."\n}',
    'top10-commentary': '{\n  "entries": [{ "rank": 1, "title": "...", "artist": "...", "previousRank": 2 }]\n}',
    'caption-generator': '{\n  "topic": "...",\n  "platform": "instagram",\n  "context": "..."\n}',
    'newsletter-generator': '{\n  "weekOf": "June 22, 2026",\n  "highlights": "..."\n}',
    'event-summarizer': '{\n  "eventName": "...",\n  "details": "..."\n}',
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-white">AI Tools</h1>
      <p className="mb-6 text-sm text-white/60">
        Every result is a <strong>draft</strong>. Review uncertainty flags carefully before publishing — the AI
        never invents facts and will flag anything it cannot verify from your input.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.key}
            onClick={() => {
              setActive(tool.key);
              setResult(null);
              setError('');
              setInput('');
            }}
            className={`rounded-md px-3 py-1.5 text-sm ${
              active === tool.key ? 'bg-gold text-ghana-black' : 'border border-white/20 text-white/70 hover:border-gold'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-ggr">
          <p className="mb-2 text-sm text-white/60">{TOOLS.find((t) => t.key === active)?.description}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[active]}
            rows={12}
            className="w-full rounded-md border border-white/20 bg-black/40 p-3 font-mono text-xs text-white"
          />
          {error && <p className="mt-2 text-sm text-ghana-red">{error}</p>}
          <button onClick={runTool} disabled={loading} className="btn-gold mt-3">
            {loading ? 'Generating…' : 'Generate Draft'}
          </button>
        </div>

        <div className="card-ggr">
          <h2 className="mb-2 font-semibold text-white">Draft Output</h2>
          {!result ? (
            <p className="text-sm text-white/40">No draft generated yet.</p>
          ) : (
            <>
              <p className="whitespace-pre-line text-white/85">{result.text}</p>
              {result.uncertaintyFlags?.length > 0 && (
                <div className="mt-4 rounded-md border border-ghana-red/40 bg-ghana-red/10 p-3">
                  <p className="text-sm font-semibold text-ghana-red">Flagged as uncertain — review before publishing:</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-white/70">
                    {result.uncertaintyFlags.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-4 text-xs text-white/40">
                Generated via {result.provider} ({result.model}). This is a draft — copy it into the relevant content
                form and approve manually.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
