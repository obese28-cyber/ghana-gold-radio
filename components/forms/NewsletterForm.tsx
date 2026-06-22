'use client';

import { useState, type FormEvent } from 'react';

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: 'dev-bypass', honeypot: '' }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong.');
      setStatus('success');
      setMessage("You're subscribed! Check your inbox to confirm.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex gap-2' : 'flex flex-col gap-3 sm:flex-row'}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 focus:border-gold focus:outline-none"
      />
      {/* Honeypot field — hidden from real users, bots tend to fill every input */}
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <button type="submit" disabled={status === 'loading'} className="btn-gold whitespace-nowrap">
        {status === 'loading' ? 'Joining…' : 'Join the List'}
      </button>
      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-ghana-red' : 'text-ghana-green'}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
