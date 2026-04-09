import { getSessionsByDate } from '@/lib/session';
import { transformSessionsToBlocks } from '@/lib/timeline';
import Timeline from '@/components/timeline/Timeline';
import { getPrevDate } from '@/lib/getDate';
import { getCurrentUser } from '@/lib/current-user';
import { getNextDate } from '@/lib/getDate';

export default async function TimelinePage({ searchParams }: { searchParams: { date?: string } }) {
  const user = await getCurrentUser();

  if (!user) return null;

  const today = new Date();
  const date = searchParams.date || today.toISOString().split('T')[0];

  const sessions = await getSessionsByDate(user.id, date);
  const blocks = transformSessionsToBlocks(sessions);

  console.log('SESSIONS:', sessions);
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <a href={`?date=${getPrevDate(date)}`}>← Prev</a>
        <a href={`?date=${getNextDate(date)}`}>Next →</a>
      </div>{' '}
      <Timeline blocks={blocks} date={date} />
      <div className="text-red-500">Blocks count: {blocks.length}</div>
    </div>
  );
}
