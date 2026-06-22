export default function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card-ggr">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-gold">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}
