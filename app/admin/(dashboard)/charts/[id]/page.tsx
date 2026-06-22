import { notFound } from 'next/navigation';
import { findChartById } from '@/lib/repositories/chart.repository';
import { listSongsForAdmin } from '@/lib/repositories/song.repository';
import ChartEditor from './ChartEditor';

export const dynamic = 'force-dynamic';

export default async function EditChartPage({ params }: { params: { id: string } }) {
  const [chart, songs] = await Promise.all([findChartById(params.id), listSongsForAdmin()]);
  if (!chart) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">Edit Chart</h1>
      <ChartEditor
        chart={chart}
        songs={songs.map((s) => ({ id: s.id, title: s.title, artistStageName: s.artist.stageName }))}
      />
    </div>
  );
}
