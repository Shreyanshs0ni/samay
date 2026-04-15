import type { TimeBlockDTO } from '@/types/timeblock';

type EventListProps = {
  blocks?: TimeBlockDTO[];
  onSelect?: (block: TimeBlockDTO) => void;
};

export default function EventList({ blocks = [], onSelect }: EventListProps) {
  return (
    <div className="space-y-3 mt-6">
      {blocks.map((block) => (
        <div
          key={block.id}
          onClick={() => onSelect?.(block)}
          className="p-4 rounded-xl border cursor-pointer hover:bg-gray-50"
        >
          <div className="font-medium flex items-center gap-2">
            {block.emoji && <span>{block.emoji}</span>}
            {block.title}
          </div>

          <div className="text-sm text-gray-500">
            {new Date(block.startTime).toLocaleTimeString()} -{' '}
            {new Date(block.endTime).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
