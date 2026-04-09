import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // const user = 'cmnoi68dp0000xpc8b8elb1b4';

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { categoryId } = body;

    if (!categoryId) {
      return new NextResponse('Category required', { status: 400 });
    }

    // 🔥 1. Find active session
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        endTime: null,
      },
    });

    // 🔥 2. Stop it if exists
    if (activeSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - activeSession.startTime.getTime()) / 1000);

      await prisma.session.update({
        where: { id: activeSession.id },
        data: {
          endTime,
          duration,
        },
      });
    }

    // 🔥 3. Create new session
    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
        categoryId,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('[START_SESSION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
