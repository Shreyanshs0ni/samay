'use client';
import { useEffect, useState } from 'react';
import { AddCategoryButton } from '@/components/categories/add-category';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/format-time';

type Category = {
  id: string;
  name: string;
  color: string;
};

export default function TrackingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeStartTime, setActiveStartTime] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

  const seconds = useTimer(activeStartTime);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      console.log(data);
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  }

  // ▶️ START (NO API)
  const handleStart = (cat: Category) => {
    if (starting || activeStartTime) return;

    setStarting(true);

    setActiveStartTime(new Date());
    setActiveCategory(cat);

    setStarting(false);
  };

  // ⏹ STOP → CREATE TIMEBLOCK
  const handleStop = async () => {
    if (!activeStartTime || !activeCategory || stopping) return;

    setStopping(true);

    const endTime = new Date();

    await fetch('/api/timeblocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: activeCategory.name,
        startTime: activeStartTime,
        endTime,
        categoryId: activeCategory.id,
        color: activeCategory.color,
        type: 'tracked',
      }),
    });

    // reset state
    setActiveStartTime(null);
    setActiveCategory(null);

    setStopping(false);
  };

  useEffect(() => {
    async function load() {
      await fetchCategories();
    }
    load();
  }, []);

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

        <AddCategoryButton onAdd={fetchCategories} />
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
