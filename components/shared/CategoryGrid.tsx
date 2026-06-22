import Link from 'next/link';

export interface CategoryGridItem {
  slug: string;
  name: string;
  description?: string | null;
  basePath: string;
}

export default function CategoryGrid({ items }: { items: CategoryGridItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link key={item.slug} href={`${item.basePath}/${item.slug}`} className="card-ggr group">
          <h3 className="font-semibold text-white group-hover:text-gold">{item.name}</h3>
          {item.description && <p className="mt-1 text-sm text-white/60">{item.description}</p>}
        </Link>
      ))}
    </div>
  );
}
