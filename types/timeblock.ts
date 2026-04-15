import type { CategoryDTO } from '@/types/category';

export type TimeBlockDTO = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string | null;
  color: string | null;
  emoji: string | null;
  type: string;
  categoryId: string | null;
  category: Pick<CategoryDTO, 'name' | 'color'> | null;
};

export type TimelineBlockDTO = {
  id: string;
  startMinuteOfDay: number;
  durationMinutes: number;
  endMinuteOfDay: number;
  title: string;
  category: Pick<CategoryDTO, 'name' | 'color'> | null;
};

export type TimeBlockInput = {
  title: string;
  startTime: string;
  endTime: string;
  categoryId?: string | null;
  description?: string | null;
  color?: string | null;
  emoji?: string | null;
  type?: string;
};
