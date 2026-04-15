import type { Category, TimeBlock } from '@prisma/client';
import type { TimeBlockDTO, TimelineBlockDTO } from '@/types/timeblock';

type TimeBlockWithCategory = TimeBlock & { category: Category | null };

export function toTimeBlockDTO(timeblock: TimeBlockWithCategory): TimeBlockDTO {
  return {
    id: timeblock.id,
    title: timeblock.title,
    startTime: timeblock.startTime.toISOString(),
    endTime: timeblock.endTime.toISOString(),
    description: timeblock.description,
    color: timeblock.color,
    emoji: timeblock.emoji,
    type: timeblock.type,
    categoryId: timeblock.categoryId,
    category: timeblock.category
      ? {
          name: timeblock.category.name,
          color: timeblock.category.color,
        }
      : null,
  };
}

export function toTimelineBlockDTO(timeblock: TimeBlockWithCategory): TimelineBlockDTO {
  const start = new Date(timeblock.startTime);
  const end = new Date(timeblock.endTime);

  const startMinuteOfDay = start.getHours() * 60 + start.getMinutes();
  const endMinuteOfDay = end.getHours() * 60 + end.getMinutes();
  const durationMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));

  return {
    id: timeblock.id,
    title: timeblock.title,
    startMinuteOfDay,
    endMinuteOfDay,
    durationMinutes,
    category: timeblock.category
      ? { name: timeblock.category.name, color: timeblock.category.color }
      : null,
  };
}
