import * as Tooltip from '@radix-ui/react-tooltip';

type Block = {
  id: string;
  start: number;
  end: number;
  duration: number;
  category: {
    name: string;
    color: string;
  };
};

function formatTime(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour % 1) * 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function formatDuration(duration: number) {
  const h = Math.floor(duration);
  const m = Math.round((duration % 1) * 60);
  return `${h}h ${m}m`;
}

export default function Timeline({ blocks, date }: { blocks: Block[]; date: string }) {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  const left = (currentHour / 24) * 100;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Timeline</h1>

      <div className="relative w-full h-24 border rounded-lg overflow-hidden">
        {/* Time axis */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
          style={{ left: `${left}%` }}
        >
          <span className="absolute -top-5 -left-3 text-[10px] text-red-500">NOW</span>
        </div>
        <div className="absolute inset-0 flex">
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
          {blocks.map((block) => {
            const left = (block.start / 24) * 100;
            const width = (block.duration / 24) * 100;

            return (
              <Tooltip.Root key={block.id}>
                <Tooltip.Trigger asChild>
                  <div
                    className="absolute top-6 h-10 rounded-lg px-3 flex items-center text-xs font-medium text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: block.category.color,
                      minWidth: '2%',
                    }}
                  >
                    {block.category.name}
                  </div>
                </Tooltip.Trigger>

                <Tooltip.Content className="bg-black text-white px-3 py-2 rounded text-xs shadow-lg">
                  <p>{block.category.name}</p>
                  <p>
                    {formatTime(block.start)} → {formatTime(block.end)}
                  </p>
                  <p>{formatDuration(block.duration)}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </Tooltip.Provider>
      </div>
    </div>
  );
}
