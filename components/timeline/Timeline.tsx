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
        <div className="absolute inset-0 flex">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex-1 border-r text-xs text-muted-foreground">
              {i}
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
                    className="absolute top-6 h-10 rounded-md px-2 text-xs text-white cursor-pointer hover:opacity-80 transition"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: block.category.color,
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
