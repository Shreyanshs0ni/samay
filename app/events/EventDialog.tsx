'use client';
import { useState, useEffect } from 'react';
import type { CategoryDTO } from '@/types/category';
import type { TimeBlockDTO } from '@/types/timeblock';
import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

type EventDialogProps = {
  open: boolean;
  onClose: () => void;
  block: TimeBlockDTO | null;
  onSave: (payload: Record<string, unknown>, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const defaultForm = {
  title: '',
  startTime: '',
  endTime: '',
  categoryId: '',
  color: '',
  emoji: '',
  description: '',
};

export default function EventDialog({ open, onClose, block, onSave, onDelete }: EventDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const [pending, setPending] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: apiClient.getCategories,
  });

  const categories = categoriesQuery.data ?? [];

  async function handleSubmit() {
    try {
      setPending(true);
      const payload = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };

      await onSave(
        {
          ...payload,
          type: block?.type ?? 'planned',
        },
        block?.id
      );

      setForm(defaultForm);
      onClose();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!block) return;
    try {
      setPending(true);
      await onDelete(block.id);
      onClose();
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    if (block) {
      setForm({
        title: block.title,
        startTime: new Date(block.startTime).toISOString().slice(0, 16),
        endTime: new Date(block.endTime).toISOString().slice(0, 16),
        categoryId: block.categoryId || '',
        color: block.color || '',
        emoji: block.emoji || '',
        description: block.description || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [block, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-black p-6 rounded-2xl space-y-4 w-96 shadow-lg">
        <h2 className="text-lg font-semibold">{block ? 'Edit Event' : 'Create Event'}</h2>

        {/* Title */}
        <input
          placeholder="What are you doing?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Time */}
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-1/2"
          />

          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-1/2"
          />
        </div>

        {/* Category */}
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">No Category</option>
          {categories.map((cat: CategoryDTO) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Emoji  */}
        <div className="flex gap-2">
          <input
            placeholder="Emoji"
            value={form.emoji}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            className="w-1/2 border p-2 rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          {block && (
            <button onClick={handleDelete} className="text-red-500 text-sm" disabled={pending}>
              Delete
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={pending}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {block ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
