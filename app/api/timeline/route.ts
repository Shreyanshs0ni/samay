import { requireUser } from '@/lib/auth/requireUser';
import { getTimelineByDate } from '@/lib/services/timelineService';
import { parseDateParam } from '@/lib/validators/timeblock';
import { ok } from '@/lib/utils/api';
import { toErrorResponse } from '@/lib/utils/errors';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const date = parseDateParam(searchParams.get('date'));
    const timeline = await getTimelineByDate(user.id, date);
    return ok(timeline);
  } catch (error) {
    return toErrorResponse(error);
  }
}
