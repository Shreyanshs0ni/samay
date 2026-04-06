import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, color } = body;

  const updated = await prisma.category.update({
    where: { id: params.id },
    data: { name, color },
  });
  return NextResponse.json(updated);
}

//delete
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.category.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
