'use client';

import { useEffect, useState } from 'react';
import { AddCategoryButton } from '@/components/categories/add-category';

type Category = {
  id: string;
  name: string;
  color: string;
};

export default function TrackingPage() {
  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="px-4 py-2 rounded-xl text-sm"
            style={{ backgroundColor: cat.color }}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* Add button */}
      <AddCategoryButton onAdd={fetchCategories} />
    </div>
  );
}
