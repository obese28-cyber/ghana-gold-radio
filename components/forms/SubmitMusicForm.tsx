'use client';

import { useState, type FormEvent } from 'react';

const GENRES = ['Highlife', 'Hiplife', 'Afrobeats', 'Asakaa', 'Gospel', 'Amapiano', 'Other'];

async function uploadFile(file: File, category: 'press-photos' | 'demos'): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('category', category);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'File upload failed.');
  return json.data.url as string;
}

export default function SubmitMusicForm() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      setStatus('uploading');
      const pressPhotoFile = fd.get('pressPhotoFile');
      const demoFile = fd.get('demoFile');

      const [pressPhotoUrl, demoUploadUrl] = await Promise.all([
        pressPhotoFile instanceof File && pressPhotoFile.size > 0
          ? uploadFile(pressPhotoFile, 'press-photos')
          : Promise.resolve(undefined),
        demoFile instanceof File && demoFile.size > 0
          ? uploadFile(demoFile, 'demos')
          : Promise.resolve(undefined),
      ]);

      setStatus('loading');

      const payload = {
        stageName: fd.get('stageName'),
        legalName: fd.get('legalName'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        whatsapp: fd.get('whatsapp'),
        country: fd.get('country'),
        city: fd.get('city'),
        genre: fd.get('genre'),
        songTitle: fd.get('songTitle'),
        officialYoutubeUrl: fd.get('officialYoutubeUrl'),
        artistBio: fd.get('artistBio'),
        pressPhotoUrl,
        demoUploadUrl,
        rightsOwnershipDeclared: fd.get('rightsOwnershipDeclared') === 'on',
        promotionalPermissionDeclared: fd.get('promotionalPermissionDeclared') === 'on',
        turnstileToken: 'dev-bypass',
        honeypot: fd.get('company') || '',
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.details) {
          const fieldErrors: Record<string, string> = {};
          for (const d of json.details) fieldErrors[d.path] = d.message;
          setErrors(fieldErrors);
        }
        throw new Error(json.error || 'Submission failed. Please check the form and try again.');
      }
      setStatus('success');
      setMessage("Thank you! Your submission has been received. We'll be in touch.");
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="card-ggr text-center">
        <h2 className="font-display text-2xl text-gold">Submission Received!</h2>
        <p className="mt-2 text-white/70">{message}</p>
      </div>
    );
  }

  const busy = status === 'uploading' || status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Field label="Stage Name" name="stageName" required error={errors.stageName} />
        <Field label="Legal Name" name="legalName" required error={errors.legalName} />
        <Field label="Email" name="email" type="email" required error={errors.email} />
        <Field label="Phone" name="phone" error={errors.phone} />
        <Field label="WhatsApp" name="whatsapp" error={errors.whatsapp} />
        <Field label="Country" name="country" required error={errors.country} />
        <Field label="City" name="city" error={errors.city} />
        <div>
          <label htmlFor="genre" className="mb-1 block text-sm font-medium text-white/80">
            Genre <span className="text-ghana-red">*</span>
          </label>
          <select
            id="genre"
            name="genre"
            required
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-gold focus:outline-none"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <Field label="Song Title" name="songTitle" required error={errors.songTitle} />
        <Field label="Official YouTube Link" name="officialYoutubeUrl" type="url" error={errors.officialYoutubeUrl} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pressPhotoFile" className="mb-1 block text-sm font-medium text-white/80">
            Press Photo
          </label>
          <input
            id="pressPhotoFile"
            name="pressPhotoFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1 file:text-ghana-black"
          />
        </div>
        <div>
          <label htmlFor="demoFile" className="mb-1 block text-sm font-medium text-white/80">
            Demo Upload (optional)
          </label>
          <input
            id="demoFile"
            name="demoFile"
            type="file"
            accept="audio/mpeg,audio/wav,audio/x-m4a"
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1 file:text-ghana-black"
          />
        </div>
      </div>

      <div>
        <label htmlFor="artistBio" className="mb-1 block text-sm font-medium text-white/80">
          Artist Bio
        </label>
        <textarea
          id="artistBio"
          name="artistBio"
          rows={4}
          className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-gold focus:outline-none"
        />
      </div>

      <div className="space-y-3 rounded-md border border-gold/30 bg-gold/5 p-4">
        <p className="text-sm font-semibold text-gold">Required Consent</p>
        <label className="flex items-start gap-3 text-sm text-white/80">
          <input type="checkbox" name="rightsOwnershipDeclared" required className="mt-1" />
          I confirm that I own or am authorized to represent the rights to this music, and the information
          provided is accurate.
        </label>
        <label className="flex items-start gap-3 text-sm text-white/80">
          <input type="checkbox" name="promotionalPermissionDeclared" required className="mt-1" />
          I grant Ghana Gold Radio permission to use my official links, bio, and press photo for promotional
          purposes only (no copyrighted audio hosting).
        </label>
      </div>

      {status === 'error' && (
        <p className="text-sm text-ghana-red" role="alert">
          {message}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-gold w-full sm:w-auto">
        {status === 'uploading' ? 'Uploading files…' : status === 'loading' ? 'Submitting…' : 'Submit Music'}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-ghana-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-gold focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-ghana-red">{error}</p>}
    </div>
  );
}
