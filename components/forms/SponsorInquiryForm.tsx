'use client';

import { useState, type FormEvent } from 'react';

export default function SponsorInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const payload = {
      companyName: fd.get('companyName'),
      contactName: fd.get('contactName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      packageInterest: fd.get('packageInterest'),
      budgetRange: fd.get('budgetRange'),
      message: fd.get('message'),
      turnstileToken: 'dev-bypass',
      honeypot: fd.get('company2') || '',
    };
    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to send inquiry.');
      setStatus('success');
      setMessage('Thank you! Our partnerships team will reach out shortly.');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') return <p className="card-ggr text-gold">{message}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="company2" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="companyName" required placeholder="Company name" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="contactName" required placeholder="Contact name" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="email" type="email" required placeholder="Email" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="phone" placeholder="Phone" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="packageInterest" placeholder="Package of interest (e.g. Gold)" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
        <input name="budgetRange" placeholder="Budget range" className="rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
      </div>
      <textarea name="message" rows={4} placeholder="Tell us about your goals" className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white" />
      {status === 'error' && <p className="text-sm text-ghana-red">{message}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold">
        {status === 'loading' ? 'Sending…' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
