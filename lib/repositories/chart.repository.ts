import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const chartWithItems = {
  items: {
    orderBy: { rank: 'asc' as const },
    include: { song: { include: { artist: true } } },
  },
} satisfies Prisma.Top10ChartInclude;

export function findLatestPublishedChart() {
  return prisma.top10Chart.findFirst({
    where: { isPublished: true, deletedAt: null },
    orderBy: { weekStartDate: 'desc' },
    include: chartWithItems,
  });
}

export function findPublishedCharts(limit = 8) {
  return prisma.top10Chart.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { weekStartDate: 'desc' },
    take: limit,
    include: chartWithItems,
  });
}

export function findChartById(id: string) {
  return prisma.top10Chart.findUnique({ where: { id }, include: chartWithItems });
}

export function listChartsForAdmin() {
  return prisma.top10Chart.findMany({
    where: { deletedAt: null },
    orderBy: { weekStartDate: 'desc' },
    take: 50,
  });
}

export function createChart(data: { weekStartDate: Date; weekEndDate: Date; title: string; createdById?: string }) {
  return prisma.top10Chart.create({
    data: {
      weekStartDate: data.weekStartDate,
      weekEndDate: data.weekEndDate,
      title: data.title,
      createdById: data.createdById,
    },
    select: { id: true },
  });
}

export function updateChart(id: string, data: Prisma.Top10ChartUpdateInput) {
  return prisma.top10Chart.update({ where: { id }, data, select: { id: true } });
}

export function upsertChartItem(chartId: string, songId: string, rank: number, previousRank?: number | null) {
  return prisma.top10ChartItem.upsert({
    where: { chartId_rank: { chartId, rank } },
    update: { songId, previousRank: previousRank ?? null },
    create: { chartId, songId, rank, previousRank: previousRank ?? null },
    select: { id: true },
  });
}
