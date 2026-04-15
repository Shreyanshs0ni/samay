import type { CategoryDTO } from '@/types/category';
import type { TimeBlockDTO } from '@/types/timeblock';

type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let payload: ApiError | null = null;
    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = null;
    }

    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  getCategories: () => request<CategoryDTO[]>('/api/categories'),
  createCategory: (payload: { name: string; color: string }) =>
    request<CategoryDTO>('/api/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateCategory: (id: string, payload: { name: string; color: string }) =>
    request<CategoryDTO>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id: string) =>
    request<{ deleted?: boolean; archived?: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
  getTimeBlocks: (date: string) =>
    request<TimeBlockDTO[]>(`/api/timeblocks?date=${encodeURIComponent(date)}`),
  createTimeBlock: (payload: Record<string, unknown>) =>
    request<TimeBlockDTO>('/api/timeblocks', { method: 'POST', body: JSON.stringify(payload) }),
  updateTimeBlock: (id: string, payload: Record<string, unknown>) =>
    request<TimeBlockDTO>(`/api/timeblocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteTimeBlock: (id: string) =>
    request<{ deleted: boolean }>(`/api/timeblocks/${id}`, { method: 'DELETE' }),
  getTimeline: (date: string) =>
    request<{
      date: string;
      blocks: import('@/types/timeblock').TimelineBlockDTO[];
      totals: { count: number; minutes: number };
    }>(`/api/timeline?date=${encodeURIComponent(date)}`),
};
