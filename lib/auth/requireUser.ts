import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { unauthenticatedError } from '@/lib/utils/errors';
import { cache } from 'react';

const resolveUser = cache(async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw unauthenticatedError();
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
    },
  });

  return user;
});

export async function requireUser() {
  return resolveUser();
}
