import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ghana-black">
      <div className="absolute inset-0 bg-gold-gradient opacity-10" aria-hidden />
      <div className="container-ggr relative flex flex-col items-start gap-6 py-20 sm:py-28">
        <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold">
          Ghana&apos;s Sound, Worldwide
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Ghana Gold Radio
        </h1>
        <p className="max-w-xl text-lg text-white/80">
          The Sound of Home, Anywhere in the World. Discover Top 10 Ghana charts, Highlife classics, Gospel,
          Afrobeats &amp; Hiplife, and the latest news from home and the diaspora.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/top10" className="btn-gold">
            Explore Top 10
          </Link>
          <Link href="/submit" className="btn-outline">
            Submit Your Music
          </Link>
        </div>
      </div>
    </section>
  );
}
