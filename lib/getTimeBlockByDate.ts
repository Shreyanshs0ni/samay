import { prisma } from '@/lib/prisma';
import { dayEnd, dayStart } from '@/lib/utils/date';

export async function getTimeBlockByDate(userId: string, date: string) {
  const parsedDate = new Date(date);
  const startOfDay = dayStart(parsedDate);
  const endOfDay = dayEnd(parsedDate);

  return prisma.timeBlock.findMany({
    where: {
      userId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}
