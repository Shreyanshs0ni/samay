import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    //For testing only 😡
    const userId = 'test-user';

    const activeSession = await prisma.session.findFirst({
      where: {
        userId,
        endTime: null,
      },
      include: {},
    });

    return NextResponse.json(activeSession);
  } catch (error) {
    console.error('GET ACTIVE SESSION ERROR:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
