'use client';

import { useEffect, useState } from 'react';
import EventList from './EventList';
import EventDialog from './EventDialog';

export default function EventsPage() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [open, setOpen] = useState(false);

  async function fetchBlocks() {
    try {
      const res = await fetch('/api/timeblocks?date=2026-04-12');

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setBlocks(data);
    } catch (err) {
      console.error(err);
      setBlocks([]);
    }
  }

  useEffect(() => {
    fetchBlocks();
  }, []);

  function handleSelect(block) {
    setSelectedBlock(block);
    setOpen(true);
  }

  function handleCreate() {
    setSelectedBlock(null);
    setOpen(true);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Events</h1>

      <button onClick={handleCreate}>+ New Event</button>

      <EventList blocks={blocks} onSelect={handleSelect} />

      <EventDialog
        open={open}
        onClose={() => setOpen(false)}
        block={selectedBlock}
        onSuccess={fetchBlocks}
      />
    </div>
  );
}
