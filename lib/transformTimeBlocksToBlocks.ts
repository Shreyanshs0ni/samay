import type { TimeBlockDTO, TimelineBlockDTO } from '@/types/timeblock';

export function transformTimeBlocksToBlocks(timeBlocks: TimeBlockDTO[]): TimelineBlockDTO[] {
  return timeBlocks.map((timeblock) => {
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
      category: timeblock.category,
    };
  });
}
