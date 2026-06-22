import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-ggr flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-4xl font-bold text-gold">404</h1>
      <p className="mt-2 text-white/70">We couldn&apos;t find that page.</p>
      <Link href="/" className="btn-gold mt-6">
        Back to Home
      </Link>
    </div>
  );
}
