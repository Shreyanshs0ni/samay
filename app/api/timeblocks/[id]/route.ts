// /api/timeblocks/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return new Response('Unauthorized', { status: 401 });
  }

  //only for testing 😡
  //   const userId = 'cmnvozbn90000pwaklfk0b2vo';
  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!userId) {
    return new Response('User not found', { status: 404 });
  }

  // 🔒 Ensure ownership
  const existing = await prisma.timeBlock.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  const updated = await prisma.timeBlock.update({
    where: { id: params.id },
    data: {
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),

      categoryId: body.categoryId || null,
      color: body.color || null,
      emoji: body.emoji || null,
      description: body.description || null,
    },
  });

  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  //only for testing 😡
  //   const userId = 'cmnvozbn90000pwaklfk0b2vo';

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  const existing = await prisma.timeBlock.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  await prisma.timeBlock.delete({
    where: { id: params.id },
  });

  return new Response('Deleted');
}
