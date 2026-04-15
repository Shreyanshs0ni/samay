'use client';
import { useState } from 'react';
import { AddCategoryButton } from '@/components/categories/add-category';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/format-time';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CategoryDTO } from '@/types/category';
import { apiClient } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';

export default function TrackingPage() {
  const [activeStartTime, setActiveStartTime] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryDTO | null>(null);

  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const queryClient = useQueryClient();

  const seconds = useTimer(activeStartTime);
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: apiClient.getCategories,
  });
  const categories = categoriesQuery.data ?? [];

  // ▶️ START (NO API)
  const handleStart = (cat: CategoryDTO) => {
    if (starting || activeStartTime) return;

    setStarting(true);

    setActiveStartTime(new Date());
    setActiveCategory(cat);

    setStarting(false);
  };

  const stopMutation = useMutation({
    mutationFn: async () => {
      if (!activeStartTime || !activeCategory) return;
      const endTime = new Date();

      return apiClient.createTimeBlock({
        title: activeCategory.name,
        startTime: activeStartTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId: activeCategory.id,
        color: activeCategory.color,
        type: 'tracked',
      });
    },
    onSuccess: () => {
      const today = new Date();
      const keyDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
      ).padStart(2, '0')}`;
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(keyDate) });
    },
  });

  // ⏹ STOP → CREATE TIMEBLOCK
  const handleStop = async () => {
    if (!activeStartTime || !activeCategory || stopping) return;

    setStopping(true);
    await stopMutation.mutateAsync();

    // reset state
    setActiveStartTime(null);
    setActiveCategory(null);

    setStopping(false);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-semibold">Categories</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleStart(cat)}
            disabled={!!activeStartTime}
            className="px-4 py-2 rounded-xl text-sm text-white"
            style={{ backgroundColor: cat.color }}
          >
            {cat.name}
          </button>
        ))}

        <AddCategoryButton
          onAdd={() => queryClient.invalidateQueries({ queryKey: queryKeys.categories })}
        />
      </div>

      {/* Tracking UI */}
      <div className="p-8 flex flex-col items-center justify-center h-screen">
        {activeStartTime && activeCategory ? (
          <div className="p-8 rounded-2xl bg-black text-white text-center space-y-4">
            <h2 className="text-sm opacity-60 animate-pulse">Currently Tracking</h2>

            <h1 className="text-2xl font-semibold">{activeCategory.name}</h1>

            <div className="text-6xl font-mono">{formatTime(seconds)}</div>

            <button
              onClick={handleStop}
              disabled={stopping}
              className="px-6 py-3 bg-red-500 rounded-xl disabled:opacity-50"
            >
              {stopping ? 'Stopping...' : 'Stop'}
            </button>
          </div>
        ) : (
          <div className="text-gray-500 text-center space-y-2">
            <p>No active session</p>
            <p className="text-sm opacity-60">Start something meaningful 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}
