'use client';

import { useState, type FormEvent } from 'react';

const CATEGORIES = ['general', 'press', 'artist', 'sponsor', 'technical', 'other'];

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      category: fd.get('category'),
      subject: fd.get('subject'),
      message: fd.get('message'),
      turnstileToken: 'dev-bypass',
      honeypot: fd.get('company') || '',
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to send message.');
      setStatus('success');
      setMessage('Message sent! We’ll get back to you soon.');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return <p className="card-ggr text-gold">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="email" type="email" required placeholder="Your email" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
      </div>
      <select name="category" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white">
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>
      <input name="subject" placeholder="Subject" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
      <textarea name="message" required rows={5} placeholder="Your message" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
      {status === 'error' && <p className="text-sm text-ghana-red">{message}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold">
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
