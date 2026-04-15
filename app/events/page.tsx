'use client';

import { useMemo, useState } from 'react';
import EventList from './EventList';
import EventDialog from './EventDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { TimeBlockDTO } from '@/types/timeblock';
import { toLocalIsoDate } from '@/lib/utils/date';

export default function EventsPage() {
  const [selectedBlock, setSelectedBlock] = useState<TimeBlockDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toLocalIsoDate(new Date()));
  const queryClient = useQueryClient();

  const blocksQuery = useQuery({
    queryKey: queryKeys.timeline(selectedDate),
    queryFn: () => apiClient.getTimeBlocks(selectedDate),
  });

  const blocks = useMemo(() => blocksQuery.data ?? [], [blocksQuery.data]);

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => apiClient.createTimeBlock(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.timeline(selectedDate) });
      const previous =
        queryClient.getQueryData<TimeBlockDTO[]>(queryKeys.timeline(selectedDate)) ?? [];
      const optimistic: TimeBlockDTO = {
        id: `optimistic-${Date.now()}`,
        title: String(payload.title ?? ''),
        startTime: String(payload.startTime),
        endTime: String(payload.endTime),
        categoryId: (payload.categoryId as string | null) ?? null,
        color: (payload.color as string | null) ?? null,
        emoji: (payload.emoji as string | null) ?? null,
        description: (payload.description as string | null) ?? null,
        type: String(payload.type ?? 'planned'),
        category: null,
      };
      queryClient.setQueryData<TimeBlockDTO[]>(queryKeys.timeline(selectedDate), [
        ...previous,
        optimistic,
      ]);
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.timeline(selectedDate), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(selectedDate) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      apiClient.updateTimeBlock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(selectedDate) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTimeBlock(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.timeline(selectedDate) });
      const previous =
        queryClient.getQueryData<TimeBlockDTO[]>(queryKeys.timeline(selectedDate)) ?? [];
      queryClient.setQueryData<TimeBlockDTO[]>(
        queryKeys.timeline(selectedDate),
        previous.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.timeline(selectedDate), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(selectedDate) });
    },
  });

  function handleSelect(block: TimeBlockDTO) {
    setSelectedBlock(block);
    setOpen(true);
  }

  function handleCreate() {
    setSelectedBlock(null);
    setOpen(true);
  }

  async function handleSave(payload: Record<string, unknown>, id?: string) {
    if (id) {
      await updateMutation.mutateAsync({ id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  }

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Events</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        className="my-4 rounded border border-white/20 bg-transparent px-3 py-2"
      />

      <button onClick={handleCreate}>+ New Event</button>

      <EventList blocks={blocks} onSelect={handleSelect} />

      <EventDialog
        open={open}
        onClose={() => setOpen(false)}
        block={selectedBlock}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
