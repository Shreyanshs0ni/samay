import { prisma } from '@/lib/prisma';
import { toTimelineBlockDTO } from '@/lib/mappers/timeblockMapper';
import { dayEnd, dayStart } from '@/lib/utils/date';

export async function getTimelineByDate(userId: string, date: Date) {
  const start = dayStart(date);
  const end = dayEnd(date);

  const timeblocks = await prisma.timeBlock.findMany({
    where: {
      userId,
      startTime: { gte: start, lte: end },
    },
    include: {
      category: true,
    },
    orderBy: { startTime: 'asc' },
  });

  const blocks = timeblocks.map(toTimelineBlockDTO);
  const totalMinutes = blocks.reduce((acc, block) => acc + block.durationMinutes, 0);

  return {
    date: start.toISOString(),
    blocks,
    totals: {
      count: blocks.length,
      minutes: totalMinutes,
    },
  };
}
