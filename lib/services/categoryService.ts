import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { notFoundError, validationError } from '@/lib/utils/errors';
import { toCategoryDTO } from '@/lib/mappers/categoryMapper';
import type { CategoryInput } from '@/types/category';

export async function listCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId, isArchived: false },
    orderBy: { createdAt: 'asc' },
  });

  return categories.map(toCategoryDTO);
}

export async function createCategory(userId: string, input: CategoryInput) {
  try {
    const category = await prisma.category.create({
      data: {
        userId,
        name: input.name,
        color: input.color,
      },
    });

    return toCategoryDTO(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw validationError('Category with same name already exists');
    }
    throw error;
  }
}

export async function updateCategory(userId: string, id: string, input: Partial<CategoryInput>) {
  const existing = await prisma.category.findFirst({ where: { id, userId } });
  if (!existing) {
    throw notFoundError('Category not found');
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      color: input.color,
    },
  });

  return toCategoryDTO(category);
}

export async function deleteCategory(userId: string, id: string) {
  const existing = await prisma.category.findFirst({
    where: { id, userId },
    include: { timeBlocks: { select: { id: true }, take: 1 } },
  });

  if (!existing) {
    throw notFoundError('Category not found');
  }

  if (existing.timeBlocks.length > 0) {
    await prisma.category.update({
      where: { id },
      data: { isArchived: true },
    });
    return { archived: true };
  }

  await prisma.category.delete({ where: { id } });
  return { deleted: true };
}
