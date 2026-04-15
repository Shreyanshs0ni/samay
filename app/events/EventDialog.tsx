'use client';
import { useState, useEffect } from 'react';

export default function EventDialog({ open, onClose, block, onSuccess }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    categoryId: '',
    color: '',
    emoji: '',
    description: '',
  });

  async function handleSubmit() {
    const payload = {
      ...form,
      startTime: new Date(form.startTime),
      endTime: new Date(form.endTime),
    };

    if (block) {
      await fetch(`/api/timeblocks/${block.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`/api/timeblocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          type: 'planned',
        }),
      });
    }

    onSuccess?.();
    onClose();
  }

  async function handleDelete() {
    await fetch(`/api/timeblocks/${block.id}`, {
      method: 'DELETE',
    });

    onSuccess?.();
    onClose();
  }

  function openDialog(block) {
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

    setOpen(true);
  }

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

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
          {categories.map((cat) => (
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
            <button onClick={handleDelete} className="text-red-500 text-sm">
              Delete
            </button>
          )}

          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            {block ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
