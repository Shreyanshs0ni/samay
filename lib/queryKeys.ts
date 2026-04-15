export const queryKeys = {
  timeline: (date: string) => ['timeline', date] as const,
  categories: ['categories'] as const,
};
