import { getSessionsByDate } from '@/lib/session';
import { transformSessionsToBlocks } from '@/lib/timeline';
import Timeline from '@/components/timeline/Timeline';
import { auth } from '@clerk/nextjs/server';
import { getPrevDate } from '@/lib/getDate';
import { getNextDate } from '@/lib/getDate';

export default async function TimelinePage({ searchParams }: { searchParams: { date?: string } }) {
  const { userId } = await auth();

  if (!userId) return null;

  const date = searchParams.date || new Date().toISOString();

  const sessions = await getSessionsByDate(userId, date);
  const blocks = transformSessionsToBlocks(sessions);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <a href={`?date=${getPrevDate(date)}`}>← Prev</a>
        <a href={`?date=${getNextDate(date)}`}>Next →</a>
      </div>{' '}
      <Timeline blocks={blocks} date={date} />
    </div>
  );
}
