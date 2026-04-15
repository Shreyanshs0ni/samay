'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Timeline from '@/components/timeline/Timeline';
import { getNextDate, getPrevDate, toLocalIsoDate } from '@/lib/utils/date';
import { queryKeys } from '@/lib/queryKeys';
import { apiClient } from '@/lib/apiClient';
import { transformTimeBlocksToBlocks } from '@/lib/transformTimeBlocksToBlocks';

export default function TimelinePage() {
  const [date, setDate] = useState(toLocalIsoDate(new Date()));
  const timelineQuery = useQuery({
    queryKey: queryKeys.timeline(date),
    queryFn: () => apiClient.getTimeBlocks(date),
  });

  const blocks = transformTimeBlocksToBlocks(timelineQuery.data ?? []);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setDate(getPrevDate(date))}
          className="rounded border border-white/20 px-3 py-1"
        >
          ← Prev
        </button>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded border border-white/20 bg-transparent px-3 py-1"
        />
        <button
          onClick={() => setDate(getNextDate(date))}
          className="rounded border border-white/20 px-3 py-1"
        >
          Next →
        </button>
      </div>
      {blocks.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No timeblocks for selected day
        </div>
      )}
      <Timeline blocks={blocks} date={date} />
    </div>
  );
}
