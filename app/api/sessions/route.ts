import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 🔐 1. Get user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    //For testing only 😡
    // const userId = 'test-user';

    // 📦 2. Parse body
    const body = await req.json();
    const { title, type, taskId } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date();

    // 🔍 3. Find active session
    const activeSession = await prisma.session.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    // ⛔ 4. Stop existing session (if exists)
    if (activeSession) {
      const duration = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000);

      await prisma.session.update({
        where: { id: activeSession.id },
        data: {
          endTime: now,
          duration,
        },
      });
    }

    // ✅ 5. Create new session
    const newSession = await prisma.session.create({
      data: {
        userId,
        title,
        type,
        startTime: now,
        endTime: null,
        taskId: taskId || null,
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('START SESSION ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
