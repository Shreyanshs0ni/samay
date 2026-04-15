import type { Category } from '@prisma/client';
import type { CategoryDTO } from '@/types/category';

export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    isArchived: category.isArchived,
  };
}
