import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET all categories
export async function GET() {
  //   const { userId } = await auth();

  //   if (!userId) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
  //For testing only 😡
  const userId = 'test-user';

  const categories = await prisma.category.findMany({
    where: { userId },
  });

  return NextResponse.json(categories);
}

// CREATE category
export async function POST(req: Request) {
  //   const { userId } = await auth();

  //   if (!userId) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
  //For testing only 😡
  const userId = 'test-user';

  try {
    const body = await req.json();

    if (!body.name || !body.color) {
      return NextResponse.json({ error: 'Name and color required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        color: body.color,
        userId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
