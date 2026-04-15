// /api/timeblocks/route.ts
import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  const start = new Date(date!);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date!);
  end.setHours(23, 59, 59, 999);

  // const { userId: clerkId } = await auth();
  //only for testing 😡
  const userId = 'cmnvozbn90000pwaklfk0b2vo';

  // const user = await prisma.user.findUnique({
  //   where: { userId },
  // });

  const blocks = await prisma.timeBlock.findMany({
    where: {
      userId,
      startTime: {
        gte: start,
        lte: end,
      },
    },
    include: { category: true },
    orderBy: { startTime: 'asc' },
  });

  return Response.json(blocks);
}

export async function POST(req: Request) {
  // const { userId: clerkId } = await auth();

  //only for testing 😡
  const userId = 'cmnvozbn90000pwaklfk0b2vo';

  // if (!clerkId) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const body = await req.json();

  // 🔥 Get DB user
  // const user = await prisma.user.findUnique({
  //   where: { clerkId },
  // });

  if (!userId) {
    return new Response('User not found', { status: 404 });
  }

  const block = await prisma.timeBlock.create({
    data: {
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      type: body.type || 'planned',

      categoryId: body.categoryId || null,
      color: body.color || null,
      emoji: body.emoji || null,
      description: body.description || null,

      userId,
    },
  });

  return Response.json(block);
}
