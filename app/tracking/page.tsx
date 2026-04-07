/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { AddCategoryButton } from '@/components/categories/add-category';
import { useActiveSession } from '@/hooks/useActiveSession';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/format-time';

type Category = {
  id: string;
  name: string;
  color: string;
};

export default function TrackingPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const { session, loading, refetch } = useActiveSession();

  const seconds = useTimer(session?.startTime);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');

      if (!res.ok) {
        console.error('Failed to fetch categories');
        setCategories([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  }

  const handleStart = async (cat: Category) => {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: cat.name,
        type: 'FOCUS',
      }),
    });

    refetch(); // 🔥 refresh active session
  };

  const handleStop = async () => {
    await fetch(`/api/sessions/${session?.id}`, {
      method: 'PATCH',
    });
    refetch();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-6 space-y-8">
      <div className="p-8 flex flex-col items-center justify-center h-screen">
        {session ? (
          <div className="p-8 rounded-2xl bg-black text-white text-center space-y-4">
            <h2 className="text-sm opacity-60">Currently Tracking</h2>

            <h1 className="text-2xl font-semibold">{session.title}</h1>

            <div className="text-6xl font-mono">{formatTime(seconds)}</div>

            <button onClick={handleStop} className="px-6 py-3 bg-red-500 rounded-xl">
              Stop
            </button>
          </div>
        ) : (
          <div className="text-gray-500">No active session</div>
        )}
      </div>
      <h1 className="text-xl font-semibold">Categories</h1>
      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleStart(cat)}
            className="px-4 py-2 rounded-xl text-sm text-white"
            style={{ backgroundColor: cat.color }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Add button */}
      <AddCategoryButton onAdd={fetchCategories} />
    </div>
  );
}
