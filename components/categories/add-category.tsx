'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddCategoryButton({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F8CFF');

  async function handleCreate() {
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });

    setName('');
    setColor('#4F8CFF');
    setOpen(false);
    onAdd();
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add Category</Button>

      {open && (
        <div className="mt-4 p-4 border border-white/10 rounded-xl space-y-3">
          <Input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

          <Button onClick={handleCreate}>Create</Button>
        </div>
      )}
    </div>
  );
}
