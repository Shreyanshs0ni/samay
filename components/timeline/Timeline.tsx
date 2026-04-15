import * as Tooltip from '@radix-ui/react-tooltip';
import { useMemo } from 'react';
import type { TimelineBlockDTO } from '@/types/timeblock';

type PositionedBlock = TimelineBlockDTO & {
  lane: number;
  laneCount: number;
};

function formatTime(minutesFromDayStart: number) {
  const h = Math.floor(minutesFromDayStart / 60);
  const m = minutesFromDayStart % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function formatDuration(durationMinutes: number) {
  const h = Math.floor(durationMinutes / 60);
  const m = durationMinutes % 60;
  return `${h}h ${m}m`;
}

function positionOverlaps(blocks: TimelineBlockDTO[]): PositionedBlock[] {
  const sorted = [...blocks].sort((a, b) => a.startMinuteOfDay - b.startMinuteOfDay);
  const active: PositionedBlock[] = [];
  const positioned: PositionedBlock[] = [];

  for (const block of sorted) {
    for (let i = active.length - 1; i >= 0; i -= 1) {
      if (active[i].endMinuteOfDay <= block.startMinuteOfDay) {
        active.splice(i, 1);
      }
    }

    const occupiedLanes = new Set(active.map((item) => item.lane));
    let lane = 0;
    while (occupiedLanes.has(lane)) lane += 1;

    const laneCount = Math.max(active.length + 1, lane + 1);
    const placed: PositionedBlock = { ...block, lane, laneCount };
    active.push(placed);

    // Keep same laneCount for all blocks in this overlap group.
    for (const item of active) {
      item.laneCount = Math.max(item.laneCount, laneCount);
    }

    positioned.push(placed);
  }

  return positioned;
}

export default function Timeline({ blocks, date }: { blocks: TimelineBlockDTO[]; date: string }) {
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const positionedBlocks = useMemo(() => positionOverlaps(blocks), [blocks]);

  const left = (currentMinute / 1440) * 100;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Timeline</h1>
      <p className="text-xs text-white/60 mb-6">{new Date(date).toDateString()}</p>

      <div className="relative w-full h-52 border rounded-lg overflow-hidden">
        {/* Time axis */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
          style={{ left: `${left}%` }}
        >
          <span className="absolute -top-5 -left-3 text-[10px] text-red-500">NOW</span>
        </div>
        <div className="absolute inset-x-0 top-2 flex">
          {[0, 4, 8, 12, 16, 20].map((hour) => (
            <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
              {hour === 0
                ? '12 AM'
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? '12 PM'
                    : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Blocks */}
        <Tooltip.Provider>
          {positionedBlocks.map((block) => {
            const blockLeft = (block.startMinuteOfDay / 1440) * 100;
            const blockWidth = (block.durationMinutes / 1440) * 100;
            const adjustedWidth = blockWidth / block.laneCount;
            const adjustedLeft = blockLeft + adjustedWidth * block.lane;

            return (
              <Tooltip.Root key={block.id}>
                <Tooltip.Trigger asChild>
                  <div
                    className="absolute top-10 h-8 rounded-lg px-2 flex items-center text-[10px] font-medium text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      left: `${adjustedLeft}%`,
                      width: `${adjustedWidth}%`,
                      backgroundColor: block.category?.color ?? '#6B7280',
                      minWidth: '2%',
                    }}
                  >
                    {block.category?.name ?? 'Uncategorized'}
                  </div>
                </Tooltip.Trigger>

                <Tooltip.Content className="bg-black text-white px-3 py-2 rounded text-xs shadow-lg">
                  <p>{block.title}</p>
                  <p>
                    {formatTime(block.startMinuteOfDay)} → {formatTime(block.endMinuteOfDay)}
                  </p>
                  <p>{formatDuration(block.durationMinutes)}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </Tooltip.Provider>
      </div>
    </div>
  );
}
