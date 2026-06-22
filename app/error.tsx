'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-ggr flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-3xl font-bold text-ghana-red">Something went wrong</h1>
      <p className="mt-2 text-white/70">An unexpected error occurred. Our team has been notified.</p>
      <button onClick={reset} className="btn-gold mt-6">
        Try again
      </button>
    </div>
  );
}
