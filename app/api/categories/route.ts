import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//get all categories
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(categories);
}
//create category
export async function POST(req: Request) {
  console.log('POST HIT'); // 👈 add this

  const body = await req.json();
  const { color, name } = body;

  if (!color || !name) {
    return NextResponse.json({ error: 'Name and Color required' }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, color },
  });
  return NextResponse.json(category);
}
