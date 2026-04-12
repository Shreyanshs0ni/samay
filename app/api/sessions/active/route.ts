import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    // const user = 'cmnoi68dp0000xpc8b8elb1b4';

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const activeSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        endTime: null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(activeSession);
  } catch (error) {
    console.error('[GET_ACTIVE_SESSION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
