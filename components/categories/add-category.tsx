'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export function AddCategoryButton({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F8CFF');
  const createMutation = useMutation({
    mutationFn: apiClient.createCategory,
    onSuccess: () => {
      setName('');
      setColor('#4F8CFF');
      setOpen(false);
      onAdd();
    },
  });

  async function handleCreate() {
    await createMutation.mutateAsync({ name, color });
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

          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      )}
    </div>
  );
}
