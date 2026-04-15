import { requireUser } from '@/lib/auth/requireUser';
import { deleteTimeBlock, getTimeBlock, updateTimeBlock } from '@/lib/services/timeblockService';
import { parseTimeBlockInput } from '@/lib/validators/timeblock';
import { ok } from '@/lib/utils/api';
import { toErrorResponse } from '@/lib/utils/errors';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const timeblock = await getTimeBlock(user.id, id);
    return ok(timeblock);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const payload = parseTimeBlockInput(await req.json());
    const updated = await updateTimeBlock(user.id, id, payload);
    return ok(updated);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const result = await deleteTimeBlock(user.id, id);
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
