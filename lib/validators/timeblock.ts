import { validationError } from '@/lib/utils/errors';
import type { TimeBlockInput } from '@/types/timeblock';

function parseDateOrThrow(value: unknown, label: string): Date {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw validationError(`${label} must be a valid date`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw validationError(`${label} must be a valid date`);
  }

  return date;
}

export function parseTimeBlockInput(input: unknown): TimeBlockInput {
  if (!input || typeof input !== 'object') {
    throw validationError('Invalid timeblock payload');
  }

  const payload = input as Record<string, unknown>;
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const startTime = parseDateOrThrow(payload.startTime, 'startTime');
  const endTime = parseDateOrThrow(payload.endTime, 'endTime');
  const categoryId = typeof payload.categoryId === 'string' ? payload.categoryId : null;
  const description = typeof payload.description === 'string' ? payload.description : null;
  const color = typeof payload.color === 'string' ? payload.color : null;
  const emoji = typeof payload.emoji === 'string' ? payload.emoji : null;
  const type = typeof payload.type === 'string' ? payload.type : 'tracked';

  if (!title) {
    throw validationError('Title is required');
  }

  if (startTime >= endTime) {
    throw validationError('startTime must be earlier than endTime');
  }

  return {
    title,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    categoryId,
    description,
    color,
    emoji,
    type,
  };
}

export function parseDateParam(value: string | null): Date {
  if (!value) {
    throw validationError('date query param is required');
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw validationError('date query param is invalid');
  }

  return date;
}
