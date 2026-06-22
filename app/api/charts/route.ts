import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { findPublishedCharts } from '@/lib/repositories/chart.repository';

export async function GET() {
  try {
    const charts = await findPublishedCharts(20);
    return jsonOk(charts);
  } catch (err) {
    console.error('charts fetch error', err);
    return jsonError('Failed to load charts.', 500);
  }
}
