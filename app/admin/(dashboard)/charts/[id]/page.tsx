import { notFound } from 'next/navigation';
import { findChartById } from '@/lib/repositories/chart.repository';
import ChartEditor from './ChartEditor';

export const dynamic = 'force-dynamic';

export default async function EditChartPage({ params }: { params: { id: string } }) {
  const chart = await findChartById(params.id);
  if (!chart) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Edit Chart</h1>
      <ChartEditor chart={chart} />
    </div>
  );
}
