import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    // const user = 'cmnoi68dp0000xpc8b8elb1b4';

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const params = await context.params;
    const id = params.id;
    const sessionId = id;

    // 🔥 Find session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return new NextResponse('Session not found', { status: 404 });
    }

    if (session.endTime) {
      return new NextResponse('Session already stopped', { status: 400 });
    }

    const endTime = new Date();

    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('[STOP_SESSION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
