import { prisma } from '@/lib/prisma';
import { toTimeBlockDTO } from '@/lib/mappers/timeblockMapper';
import {
  conflictError,
  notFoundError,
  unauthorizedError,
  validationError,
} from '@/lib/utils/errors';
import { dayEnd, dayStart } from '@/lib/utils/date';
import type { TimeBlockInput } from '@/types/timeblock';

type OverlapOptions = {
  userId: string;
  startTime: Date;
  endTime: Date;
  ignoreId?: string;
};

async function ensureCategoryOwnership(userId: string, categoryId?: string | null) {
  if (!categoryId) return;
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, isArchived: false },
    select: { id: true },
  });
  if (!category) {
    throw validationError('Category not found or archived');
  }
}

async function findOverlap({ userId, startTime, endTime, ignoreId }: OverlapOptions) {
  return prisma.timeBlock.findFirst({
    where: {
      userId,
      id: ignoreId ? { not: ignoreId } : undefined,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
    include: { category: true },
    orderBy: { startTime: 'asc' },
  });
}

export async function listTimeBlocksByDate(userId: string, date: Date) {
  const start = dayStart(date);
  const end = dayEnd(date);

  const timeblocks = await prisma.timeBlock.findMany({
    where: {
      userId,
      startTime: { gte: start, lte: end },
    },
    include: { category: true },
    orderBy: { startTime: 'asc' },
  });

  return timeblocks.map(toTimeBlockDTO);
}

export async function getTimeBlock(userId: string, id: string) {
  const timeblock = await prisma.timeBlock.findFirst({
    where: { id, userId },
    include: { category: true },
  });

  if (!timeblock) {
    throw notFoundError('Timeblock not found');
  }

  return toTimeBlockDTO(timeblock);
}

export async function createTimeBlock(userId: string, input: TimeBlockInput) {
  const startTime = new Date(input.startTime);
  const endTime = new Date(input.endTime);

  await ensureCategoryOwnership(userId, input.categoryId);

  const overlap = await findOverlap({ userId, startTime, endTime });
  if (overlap) {
    throw conflictError('Timeblock overlaps with an existing entry', {
      conflictingTimeBlockId: overlap.id,
    });
  }

  const created = await prisma.timeBlock.create({
    data: {
      userId,
      title: input.title,
      startTime,
      endTime,
      categoryId: input.categoryId ?? null,
      description: input.description ?? null,
      color: input.color ?? null,
      emoji: input.emoji ?? null,
      type: input.type ?? 'tracked',
      duration: Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60000)),
    },
    include: { category: true },
  });

  return toTimeBlockDTO(created);
}

export async function updateTimeBlock(userId: string, id: string, input: TimeBlockInput) {
  const existing = await prisma.timeBlock.findUnique({ where: { id } });
  if (!existing) {
    throw notFoundError('Timeblock not found');
  }
  if (existing.userId !== userId) {
    throw unauthorizedError();
  }

  await ensureCategoryOwnership(userId, input.categoryId);

  const startTime = new Date(input.startTime);
  const endTime = new Date(input.endTime);

  const overlap = await findOverlap({ userId, startTime, endTime, ignoreId: id });
  if (overlap) {
    throw conflictError('Timeblock overlaps with an existing entry', {
      conflictingTimeBlockId: overlap.id,
    });
  }

  const updated = await prisma.timeBlock.update({
    where: { id },
    data: {
      title: input.title,
      startTime,
      endTime,
      categoryId: input.categoryId ?? null,
      description: input.description ?? null,
      color: input.color ?? null,
      emoji: input.emoji ?? null,
      type: input.type ?? existing.type,
      duration: Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60000)),
    },
    include: { category: true },
  });

  return toTimeBlockDTO(updated);
}

export async function deleteTimeBlock(userId: string, id: string) {
  const existing = await prisma.timeBlock.findUnique({ where: { id } });

  if (!existing) {
    throw notFoundError('Timeblock not found');
  }

  if (existing.userId !== userId) {
    throw unauthorizedError();
  }

  await prisma.timeBlock.delete({ where: { id } });
  return { deleted: true };
}
