import Link from 'next/link';

export default function SponsorCTA() {
  return (
    <section className="container-ggr py-14">
      <div className="rounded-xl bg-gold-gradient p-8 text-ghana-black sm:p-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Partner with Ghana Gold Radio</h2>
            <p className="mt-2 max-w-xl text-ghana-black/80">
              Reach Ghanaian music lovers and the diaspora worldwide. Sponsorship packages available for brands,
              labels, and event organizers.
            </p>
          </div>
          <Link
            href="/sponsor"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-ghana-black px-6 py-3 font-semibold text-gold hover:bg-black"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </section>
  );
}
