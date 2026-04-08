import { prisma } from '@/lib/prisma';

export async function getSessionsByDate(userId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.session.findMany({
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
