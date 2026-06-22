export default function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-white/10 bg-black/40">
      <div className="container-ggr py-10">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-white/70">{description}</p>}
      </div>
    </div>
  );
}
