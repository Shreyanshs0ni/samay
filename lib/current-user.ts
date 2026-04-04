import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export default async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: userId },
  });
}
