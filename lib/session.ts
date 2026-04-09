import { prisma } from '@/lib/prisma';

export async function getSessionsByDate(userId: string, date: string) {
  // ✅ Force LOCAL day boundaries (not UTC confusion)
  const [year, month, day] = date.split('-').map(Number);

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

  console.log('START:', startOfDay);
  console.log('END:', endOfDay);

  return await prisma.session.findMany({
    where: {
      userId: userId, // keep this
    },
    include: {
      category: true,
    },
  });
}
