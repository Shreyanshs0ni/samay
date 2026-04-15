import { requireUser } from '@/lib/auth/requireUser';
import { createTimeBlock, listTimeBlocksByDate } from '@/lib/services/timeblockService';
import { parseDateParam, parseTimeBlockInput } from '@/lib/validators/timeblock';
import { ok } from '@/lib/utils/api';
import { toErrorResponse } from '@/lib/utils/errors';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const date = parseDateParam(searchParams.get('date'));
    const timeblocks = await listTimeBlocksByDate(user.id, date);
    return ok(timeblocks);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const payload = parseTimeBlockInput(await req.json());
    const timeblock = await createTimeBlock(user.id, payload);
    return ok(timeblock, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
