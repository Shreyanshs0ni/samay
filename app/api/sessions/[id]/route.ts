import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const now = new Date();

    // 🔍 1. Find session (must belong to user)
    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // ⚠️ Already stopped?
    if (session.endTime) {
      return NextResponse.json({ error: 'Session already stopped' }, { status: 400 });
    }

    // ⏱️ 2. Calculate duration
    const duration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);

    // 💾 3. Update session
    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        endTime: now,
        duration,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('STOP SESSION ERROR:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
