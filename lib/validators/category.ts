import { validationError } from '@/lib/utils/errors';
import type { CategoryInput } from '@/types/category';

export function parseCategoryInput(input: unknown): CategoryInput {
  if (!input || typeof input !== 'object') {
    throw validationError('Invalid category payload');
  }

  const payload = input as Record<string, unknown>;
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const color = typeof payload.color === 'string' ? payload.color.trim() : '';

  if (!name) {
    throw validationError('Category name is required');
  }

  if (!color) {
    throw validationError('Category color is required');
  }

  return { name, color };
}
